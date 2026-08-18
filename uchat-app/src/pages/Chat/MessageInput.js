import React,{
useState,
useRef
} from "react";

import api from "../../api/api";

import EmojiPicker from "emoji-picker-react";

import {
FaPaperPlane,
FaPaperclip,
FaSmile,
FaMicrophone
} from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function MessageInput({

selectedChat,

socket,

currentUser,

onMessageSent

}){

const [message,setMessage]=useState("");

const [showEmoji,setShowEmoji]=useState(false);

const [selectedFile,setSelectedFile]=useState(null);

const [recording,setRecording]=useState(false);

const [uploading,setUploading]=useState(false);

const fileInput=useRef(null);

const mediaRecorder=useRef(null);

const audioChunks=useRef([]);





const handleTyping=(value)=>{

setMessage(value);

if(!socket || !selectedChat) return;

socket.emit(

"typing",

{

chatId:selectedChat.Id,

userId:currentUser.Id,

userName:currentUser.Name

}

);

clearTimeout(window.typingTimer);

window.typingTimer=setTimeout(()=>{

socket.emit(

"stopTyping",

{

chatId:selectedChat.Id,

userId:currentUser.Id

}

);

},1000);

};





const chooseFile=()=>{

fileInput.current.click();

};





const fileChanged=(e)=>{

if(e.target.files.length>0){

setSelectedFile(

e.target.files[0]

);

}

};





const addEmoji = (emojiData) => {

    setMessage(prev => prev + emojiData.emoji);

    setShowEmoji(false);

};

const sendMessage = async () => {

    if (
        message.trim() === "" &&
        !selectedFile
    ) {
        return;
    }

    try {

        setUploading(true);

        const formData = new FormData();

        formData.append(
            "chatId",
            selectedChat.Id
        );

        formData.append(
            "senderId",
            currentUser.Id
        );

        formData.append(
            "message",
            message
        );



        if (selectedFile) {

            formData.append(
                "file",
                selectedFile
            );

            if (
                selectedFile.type.startsWith("image/")
            ) {

                formData.append(
                    "messageType",
                    "image"
                );

            }

            else if (
                selectedFile.type.startsWith("video/")
            ) {

                formData.append(
                    "messageType",
                    "video"
                );

            }

            else if (
                selectedFile.type.startsWith("audio/")
            ) {

                formData.append(
                    "messageType",
                    "audio"
                );

            }

            else {

                formData.append(
                    "messageType",
                    "file"
                );

            }

        }

        else {

            formData.append(
                "messageType",
                "text"
            );

        }



        const res = await api.post(

            "/messages",

            formData,

            {

                headers: {

                    "Content-Type":
                    "multipart/form-data"

                }

            }

        );



        if (res.data.success) {

            socket?.emit(

                "sendMessage",

                res.data.data

            );



            if (onMessageSent) {

                onMessageSent(
                    res.data.data
                );

            }



            setMessage("");

            setSelectedFile(null);

            fileInput.current.value = "";

        }

    }

    catch (err) {

        console.log(err);

    }

    finally {

        setUploading(false);

    }

};





const handleKeyDown = (e) => {

    if (
        e.key === "Enter" &&
        !e.shiftKey
    ) {

        e.preventDefault();

        sendMessage();

    }

};
return (

<div

className="border-top bg-white p-3 position-relative"

>

{
showEmoji &&

<div

className="position-absolute"

style={{

bottom:"75px",

left:"15px",

zIndex:1000

}}

>

<EmojiPicker

onEmojiClick={addEmoji}

width={350}

height={420}

/>

</div>

}



{

selectedFile &&

<div

className="alert alert-success py-2 px-3 mb-2 d-flex justify-content-between align-items-center"

>

<div>

<i className="bi bi-paperclip me-2"></i>

{selectedFile.name}

</div>

<button

className="btn btn-sm btn-danger"

onClick={()=>{

setSelectedFile(null);

fileInput.current.value="";

}}

>

<i className="bi bi-x"></i>

</button>

</div>

}



<div className="d-flex align-items-center">

<button

className="btn btn-light rounded-circle me-2"

onClick={()=>{

setShowEmoji(!showEmoji);

}}

>

<FaSmile/>

</button>



<button

className="btn btn-light rounded-circle me-2"

onClick={chooseFile}

>

<FaPaperclip/>

</button>



<input

type="file"

ref={fileInput}

className="d-none"

accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.zip"

onChange={fileChanged}

/>



<textarea

className="form-control rounded-pill px-3"

rows="1"

placeholder="Type a message..."

value={message}

onChange={(e)=>{

handleTyping(e.target.value);

}}

onKeyDown={handleKeyDown}

style={{

resize:"none",

maxHeight:"120px"

}}

/>



<button

className={`btn rounded-circle ms-2 ${
uploading
?
"btn-secondary"
:
"btn-success"
}`}

disabled={uploading}

onClick={sendMessage}

>

{

uploading

?

<span

className="spinner-border spinner-border-sm"

></span>

:

<FaPaperPlane/>

}

</button>



<button

className={`btn rounded-circle ms-2 ${
recording
?
"btn-danger"
:
"btn-light"
}`}

onClick={()=>{

// Voice recording logic will be added later

setRecording(!recording);

}}

>

<FaMicrophone/>

</button>

</div>

</div>

);

}

export default MessageInput;