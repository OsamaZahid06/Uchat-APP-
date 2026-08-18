import React, {
    useState,
    useEffect,
    useRef
} from "react";

import api from "../../api/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function MessageArea({

    selectedChat,

    socket,

    currentUser

}) {

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);



    const scrollToBottom = () => {

        messagesEndRef.current?.scrollIntoView({

            behavior: "smooth"

        });

    };



    useEffect(() => {

        scrollToBottom();

    }, [messages]);

    /* ==========================================
       READ RECEIPTS
    ========================================== */

    useEffect(() => {

        if (!socket || !selectedChat) return;

        socket.emit(

            "messagesSeen",

            {

                chatId: selectedChat.Id,

                userId: currentUser.Id

            }

        );

        api.put(

            `/messages/read/${selectedChat.Id}`

        ).catch(console.log);

    }, [selectedChat]);



    /* ==========================================
       LOAD OLDER MESSAGES
    ========================================== */

    const loadOlderMessages = async () => {

        if (messages.length === 0) return;

        try {

            const oldestId = messages[0].Id;

            const res = await api.get(

                `/messages/${selectedChat.Id}?before=${oldestId}`

            );

            if (res.data.success && res.data.data.length > 0) {

                setMessages(prev => [

                    ...res.data.data,

                    ...prev

                ]);

            }

        }

        catch (err) {

            console.log(err);

        }

    };



    /* ==========================================
       SCROLL LOAD
    ========================================== */

    const handleScroll = (e) => {

        if (e.target.scrollTop === 0) {

            loadOlderMessages();

        }

    };



    /* ==========================================
       SOCKET READ UPDATE
    ========================================== */

    useEffect(() => {

        if (!socket) return;

        socket.on(

            "messagesSeen",

            ({ chatId }) => {

                if (

                    selectedChat &&

                    chatId === selectedChat.Id

                ) {

                    setMessages(prev =>

                        prev.map(msg => ({

                            ...msg,

                            IsRead: 1

                        }))

                    );

                }

            }

        );

        return () => {

            socket.off(

                "messagesSeen"

            );

        };

    }, [socket, selectedChat]);



    /* ==========================================
       TYPING STATUS
    ========================================== */

    const [typingUser, setTypingUser] = useState("");



    useEffect(() => {

        if (!socket) return;

        socket.on(

            "typing",

            ({ userName, chatId }) => {

                if (

                    selectedChat &&

                    chatId === selectedChat.Id

                ) {

                    setTypingUser(userName);

                }

            }

        );



        socket.on(

            "stopTyping",

            ({ chatId }) => {

                if (

                    selectedChat &&

                    chatId === selectedChat.Id

                ) {

                    setTypingUser("");

                }

            }

        );



        return () => {

            socket.off("typing");

            socket.off("stopTyping");

        };

    }, [socket, selectedChat]);

    useEffect(() => {

        if (selectedChat) {

            loadMessages();

        }

    }, [selectedChat]);



    const loadMessages = async () => {

        try {

            setLoading(true);

            const res = await api.get(

                `/messages/${selectedChat.Id}`

            );

            if (res.data.success) {

                setMessages(res.data.data);

            }

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        if (!socket || !selectedChat) return;

        socket.emit(

            "joinChat",

            selectedChat.Id

        );



        socket.on(

            "newMessage",

            (message) => {

                if (

                    message.ChatId === selectedChat.Id

                ) {

                    setMessages((prev) => [

                        ...prev,

                        message

                    ]);

                }

            }

        );



        socket.on(

            "messageDeleted",

            ({ messageId }) => {

                setMessages((prev) =>

                    prev.filter(

                        m => m.Id !== messageId

                    )

                );

            }

        );



        socket.on(

            "messageUpdated",

            (updated) => {

                setMessages((prev) =>

                    prev.map((m) =>

                        m.Id === updated.Id

                            ? updated
                            : m

                    )

                );

            }

        );



        return () => {

            socket.off("newMessage");

            socket.off("messageDeleted");

            socket.off("messageUpdated");

        };

    }, [

        socket,

        selectedChat

    ]);



    if (!selectedChat) {

        return (

            <div

                className="d-flex justify-content-center align-items-center bg-light"

                style={{

                    height: "100%"

                }}

            >

                <div className="text-center">

                    <i className="bi bi-chat-square-text display-1 text-success"></i>

                    <h4 className="mt-3 text-muted">

                        Select a chat

                    </h4>

                </div>

            </div>

        );

    }



    if (loading) {

        return (

            <div

                className="d-flex justify-content-center align-items-center"

                style={{

                    height: "100%"

                }}

            >

                <div className="spinner-border text-success"></div>

            </div>

        );

    }



    return (

        <div

            className="flex-grow-1 overflow-auto p-3"

            onScroll={handleScroll}

            style={{

                background: "#efeae2",

                height: "calc(100vh - 145px)"

            }}

        >


            {/* Part 2 will render message bubbles here */}
            {
                messages.map((msg) => {

                    const isMine =
                        msg.SenderId === currentUser.Id;

                    return (

                        <div

                            key={msg.Id}

                            className={`d-flex mb-3 ${isMine
                                    ?
                                    "justify-content-end"
                                    :
                                    "justify-content-start"
                                }`}

                        >

                            <div

                                className={`shadow-sm rounded-4 px-3 py-2 ${isMine
                                        ?
                                        "bg-success text-white"
                                        :
                                        "bg-white"
                                    }`}

                                style={{

                                    maxWidth: "70%",

                                    wordBreak: "break-word"

                                }}

                            >

                                {/* TEXT MESSAGE */}

                                {

                                    msg.MessageType === "text"

                                    &&

                                    <p className="mb-1">

                                        {msg.Message}

                                    </p>

                                }



                                {/* IMAGE */}

                                {

                                    msg.MessageType === "image"

                                    &&

                                    <img

                                        src={`http://localhost:5000/uploads/${msg.FileName}`}

                                        alt=""

                                        className="img-fluid rounded"

                                        style={{

                                            maxWidth: "260px"

                                        }}

                                    />

                                }



                                {/* VIDEO */}

                                {

                                    msg.MessageType === "video"

                                    &&

                                    <video

                                        controls

                                        className="rounded"

                                        style={{

                                            maxWidth: "280px"

                                        }}

                                    >

                                        <source

                                            src={`http://localhost:5000/uploads/${msg.FileName}`}

                                        />

                                    </video>

                                }



                                {/* AUDIO */}

                                {

                                    msg.MessageType === "audio"

                                    &&

                                    <audio controls>

                                        <source

                                            src={`http://localhost:5000/uploads/${msg.FileName}`}

                                        />

                                    </audio>

                                }



                                {/* FILE */}

                                {

                                    msg.MessageType === "file"

                                    &&

                                    <a

                                        href={`http://localhost:5000/uploads/${msg.FileName}`}

                                        target="_blank"

                                        rel="noreferrer"

                                        className={

                                            isMine

                                                ?

                                                "text-white"

                                                :

                                                "text-primary"

                                        }

                                    >

                                        <i className="bi bi-file-earmark me-2"></i>

                                        {msg.FileName}

                                    </a>

                                }



                                <div

                                    className="d-flex justify-content-end align-items-center mt-1"

                                >

                                    <small

                                        className={

                                            isMine

                                                ?

                                                "text-light"

                                                :

                                                "text-muted"

                                        }

                                    >

                                        {

                                            new Date(

                                                msg.CreatedAt

                                            ).toLocaleTimeString(

                                                [],

                                                {

                                                    hour: "2-digit",

                                                    minute: "2-digit"

                                                }

                                            )

                                        }

                                    </small>



                                    {

                                        isMine

                                        &&

                                        <span className="ms-2">

                                            {

                                                msg.IsRead === 1

                                                    ?

                                                    <i

                                                        className="bi bi-check2-all"

                                                        style={{

                                                            color: "#53bdeb"

                                                        }}

                                                    ></i>

                                                    :

                                                    msg.IsDelivered === 1

                                                        ?

                                                        <i

                                                            className="bi bi-check2-all"

                                                        ></i>

                                                        :

                                                        <i

                                                            className="bi bi-check2"

                                                        ></i>

                                            }

                                        </span>

                                    }

                                </div>

                            </div>

                        </div>

                    );

                })
            }



            {typingUser && (

<div className="text-muted small fst-italic mb-2">

{typingUser} is typing...

</div>

)}





        </div>

    );

}

export default MessageArea;     