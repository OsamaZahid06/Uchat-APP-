import React, {
  useEffect,
  useState
} from "react";

import api from "../../api/api";

import {
  FaPhone,
  FaVideo,
  FaSearch,
  FaEllipsisV
} from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function ChatHeader({

  selectedChat,

  socket

}) {

  const [chat, setChat] = useState(null);

  const [typing, setTyping] = useState(false);

  const [online, setOnline] = useState(false);

  const [loading, setLoading] = useState(false);





  useEffect(() => {

    if (selectedChat) {

      loadChat();

    }

  }, [selectedChat]);





  useEffect(() => {

    if (!socket || !selectedChat) {

      return;

    }

    socket.emit(

      "joinChat",

      selectedChat.Id

    );

    socket.on(

      "userOnline",

      (data) => {

        if (

          data.userId === selectedChat.Id

        ) {

          setOnline(true);

        }

      }

    );

    socket.on(

      "userOffline",

      (data) => {

        if (

          data.userId === selectedChat.Id

        ) {

          setOnline(false);

        }

      }

    );

    socket.on(

      "typing",

      (data) => {

        if (

          data.chatId === selectedChat.Id

        ) {

          setTyping(true);

        }

      }

    );

    socket.on(

      "stopTyping",

      (data) => {

        if (

          data.chatId === selectedChat.Id

        ) {

          setTyping(false);

        }

      }

    );

    return () => {

      socket.off("userOnline");

      socket.off("userOffline");

      socket.off("typing");

      socket.off("stopTyping");

    };

  }, [socket, selectedChat]);







  const loadChat = async () => {

    try {

      setLoading(true);

      const res =

        await api.get(

          `/chats/${selectedChat.Id}`

        );

      if (res.data.success) {

        setChat(

          res.data.data

        );

        setOnline(

          res.data.data.IsOnline === 1

        );

      }

    }

    catch (err) {

      console.log(err);

    }

    setLoading(false);

  };






  const imagePath = (img) => {

    if (!img) {

      return "/default-avatar.png";

    }

    return `http://localhost:5000/uploads/${img}`;

  };

useEffect(() => {

    if (!socket) return;

    const handleTyping = (data) => {

        if (
            selectedChat &&
            data.chatId === selectedChat.Id
        ) {
            setTyping(true);
        }

    };

    const handleStopTyping = (data) => {

        if (
            selectedChat &&
            data.chatId === selectedChat.Id
        ) {
            setTyping(false);
        }

    };

    const handleUserOnline = (data) => {

        if (
            selectedChat &&
            data.userId === selectedChat.Id
        ) {

            setOnline(true);

        }

    };

    const handleUserOffline = (data) => {

        if (
            selectedChat &&
            data.userId === selectedChat.Id
        ) {

            setOnline(false);

        }

    };

    socket.on(
        "typing",
        handleTyping
    );

    socket.on(
        "stopTyping",
        handleStopTyping
    );

    socket.on(
        "userOnline",
        handleUserOnline
    );

    socket.on(
        "userOffline",
        handleUserOffline
    );

    return () => {

        socket.off(
            "typing",
            handleTyping
        );

        socket.off(
            "stopTyping",
            handleStopTyping
        );

        socket.off(
            "userOnline",
            handleUserOnline
        );

        socket.off(
            "userOffline",
            handleUserOffline
        );

    };

}, [socket, selectedChat]);



/* ===========================
   ONLINE STATUS SYNC
=========================== */

useEffect(() => {

    if (!selectedChat) return;

    if (chat) {

        setOnline(
            chat.IsOnline === 1
        );

    }

}, [chat, selectedChat]);



/* ===========================
   TYPING RESET
=========================== */

useEffect(() => {

    if (!typing) return;

    const timer = setTimeout(() => {

        setTyping(false);

    }, 3000);

    return () => clearTimeout(timer);

}, [typing]);







  if (!selectedChat) {

    return (

      <div

        className="border-bottom bg-white p-3 d-flex align-items-center"

        style={{

          height: "75px"

        }}

      >

        <h5 className="text-muted m-0">

          Select a conversation

        </h5>

      </div>

    );

  }



  return (

    <div

      className="border-bottom bg-white px-3 py-2 shadow-sm"

    >

      <div

        className="d-flex align-items-center justify-content-between"

      >

        <div

          className="d-flex align-items-center"

        >

          <img

            src={

              imagePath(

                chat?.ProfileImage

                ||

                chat?.Image

              )

            }

            alt=""

            className="rounded-circle"

            style={{

              width: "52px",

              height: "52px",

              objectFit: "cover"

            }}

          />

          <div className="ms-3">

            <h6 className="mb-0">

              {

                chat?.Name ||

                selectedChat.Name

              }

            </h6>

            <small

              className={

                typing

                  ?

                  "text-success"

                  :

                  online

                    ?

                    "text-success"

                    :

                    "text-muted"

              }

            >

              {

                typing

                  ?

                  "Typing..."

                  :

                  online

                    ?

                    "Online"

                    :

                    "Offline"

              }

            </small>

          </div>

        </div>

        <div

          className="d-flex align-items-center"

        >

          {/* Buttons added in Part 2 */}
          <button
            className="btn btn-light rounded-circle me-2"
            title="Voice Call"
            onClick={() => {

              if (!chat) return;

              socket?.emit("voiceCall", {

                chatId: selectedChat.Id,

                receiverId: chat.Id

              });

            }}

          >

            <FaPhone />

          </button>



          <button

            className="btn btn-light rounded-circle me-2"

            title="Video Call"

            onClick={() => {

              if (!chat) return;

              socket?.emit("videoCall", {

                chatId: selectedChat.Id,

                receiverId: chat.Id

              });

            }}

          >

            <FaVideo />

          </button>



          <button

            className="btn btn-light rounded-circle me-2"

            title="Search"

            data-bs-toggle="collapse"

            data-bs-target="#chatSearch"

          >

            <FaSearch />

          </button>



          <div className="dropdown">

            <button

              className="btn btn-light rounded-circle"

              data-bs-toggle="dropdown"

            >

              <FaEllipsisV />

            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow">

              <li>

                <button

                  className="dropdown-item"

                >

                  <i className="bi bi-person me-2"></i>

                  View Profile

                </button>

              </li>

              <li>

                <button

                  className="dropdown-item"

                >

                  <i className="bi bi-pin-angle me-2"></i>

                  Pin Chat

                </button>

              </li>

              <li>

                <button

                  className="dropdown-item"

                >

                  <i className="bi bi-bell-slash me-2"></i>

                  Mute Notifications

                </button>

              </li>

              <li>

                <button

                  className="dropdown-item"

                >

                  <i className="bi bi-images me-2"></i>

                  Media

                </button>

              </li>

              <li>

                <button

                  className="dropdown-item"

                >

                  <i className="bi bi-search me-2"></i>

                  Search Messages

                </button>

              </li>

              <li>

                <hr className="dropdown-divider" />

              </li>

              <li>

                <button

                  className="dropdown-item text-danger"

                >

                  <i className="bi bi-trash me-2"></i>

                  Delete Chat

                </button>

              </li>

              <li>

                <button

                  className="dropdown-item text-danger"

                >

                  <i className="bi bi-slash-circle me-2"></i>

                  Block User

                </button>

              </li>

            </ul>

          </div>

        </div>

      </div>



      <div

        id="chatSearch"

        className="collapse mt-3"

      >

        <div className="input-group">

          <span className="input-group-text bg-white">

            <FaSearch />

          </span>

          <input

            type="text"

            className="form-control"

            placeholder="Search messages..."

          />

        </div>

      </div>



    </div>
    



        );
        }

 


export default ChatHeader;