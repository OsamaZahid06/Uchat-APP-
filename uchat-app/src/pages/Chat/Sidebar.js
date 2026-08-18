import React, { useEffect, useState } from "react";
import api from "../../api/api";

import {
    FaSearch,
    FaComments,
    FaUsers,
    FaBroadcastTower,
    FaBullhorn,
    FaMoon,
    FaSun
} from "react-icons/fa";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Sidebar({

    selectedChat,

    setSelectedChat

}) {

    const [user,setUser]=useState(null);

    const [tab,setTab]=useState("Chats");

    const [search,setSearch]=useState("");

    const [loading,setLoading]=useState(false);

    const [darkMode,setDarkMode]=useState(

JSON.parse(

localStorage.getItem("darkMode")

) || false

);



    const [chats,setChats]=useState([]);

    const [groups,setGroups]=useState([]);

    const [status,setStatus]=useState([]);

    const [channels,setChannels]=useState([]);




    useEffect(()=>{

        const u=JSON.parse(

            localStorage.getItem("user")

        );

        if(u){

            setUser(u);

        }

        loadChats();

        loadGroups();

        loadStatus();

        loadChannels();

    },[]);





    const loadChats=async()=>{

        try{

            setLoading(true);

            const res=await api.get("/chats");

            if(res.data.success){

                setChats(res.data.data);

            }

        }

        catch(err){

            console.log(err);

        }

        setLoading(false);

    };






    const loadGroups=async()=>{

        try{

            const res=await api.get("/groups");

            if(res.data.success){

                setGroups(res.data.data);

            }

        }

        catch(err){

            console.log(err);

        }

    };







    const loadStatus=async()=>{

        try{

            const res=await api.get("/status");

            if(res.data.success){

                setStatus(res.data.data);

            }

        }

        catch(err){

            console.log(err);

        }

    };







    const loadChannels=async()=>{

        try{

            const res=await api.get("/channels");

            if(res.data.success){

                setChannels(res.data.data);

            }

        }

        catch(err){

            console.log(err);

        }

    };






    const filteredChats=chats.filter(chat=>

        chat.Name

        ?.toLowerCase()

        .includes(

            search.toLowerCase()

        )

    );



    const filteredGroups=groups.filter(group=>

        group.Name

        ?.toLowerCase()

        .includes(

            search.toLowerCase()

        )

    );



    const filteredStatus=status.filter(item=>

        item.Name

        ?.toLowerCase()

        .includes(

            search.toLowerCase()

        )

    );



    const filteredChannels=channels.filter(channel=>

        channel.Name

        ?.toLowerCase()

        .includes(

            search.toLowerCase()

        )

    );



    const imagePath=(img)=>{

        if(!img){

            return "/default-avatar.png";

        }

        return `http://localhost:5000/uploads/${img}`;

    };



    return(

<div

className={`h-100 d-flex flex-column ${
darkMode
?
"bg-dark text-white"
:
"bg-white"
}`}

>

{/* ================= PROFILE HEADER ================= */}

<div

className="d-flex justify-content-between align-items-center p-3 border-bottom"

>

<div className="d-flex align-items-center">

<img

src={imagePath(user?.ProfileImage)}

alt=""

className="rounded-circle"

style={{

width:"48px",

height:"48px",

objectFit:"cover"

}}

/>

<div className="ms-3">

<h6 className="mb-0">

{user?.FName} {user?.LName}

</h6>

<small

className={

darkMode

?

"text-light"

:

"text-muted"

}

>

Online

</small>

</div>

</div>

<button

className="btn btn-sm btn-outline-secondary"

onClick={()=>

setDarkMode(!darkMode)

}

>

{

darkMode

?

<FaSun/>

:

<FaMoon/>

}

</button>

</div>



{/* ================= SEARCH ================= */}

<div className="p-3">

<div className="input-group">

<span className="input-group-text">

<FaSearch/>

</span>

<input

type="text"

className="form-control"

placeholder="Search"

value={search}

onChange={e=>

setSearch(e.target.value)

}

/>

</div>

</div>



{/* ================= NAVIGATION ================= */}

<div className="px-2 pb-2">

<div className="d-flex justify-content-between">

<button

className={`btn btn-sm flex-fill me-1 ${
tab==="Chats"
?
"btn-success"
:
"btn-light"
}`}

onClick={()=>setTab("Chats")}

>

<FaComments/>

</button>

<button

className={`btn btn-sm flex-fill me-1 ${
tab==="Groups"
?
"btn-success"
:
"btn-light"
}`}

onClick={()=>setTab("Groups")}

>

<FaUsers/>

</button>

<button

className={`btn btn-sm flex-fill me-1 ${
tab==="Status"
?
"btn-success"
:
"btn-light"
}`}

onClick={()=>setTab("Status")}

>

<FaBroadcastTower/>

</button>

<button

className={`btn btn-sm flex-fill ${
tab==="Channels"
?
"btn-success"
:
"btn-light"
}`}

onClick={()=>setTab("Channels")}

>

<FaBullhorn/>

</button>

</div>

</div>

{/* ================= LIST STARTS HERE ================= */}
<div
className="flex-grow-1 overflow-auto">

{/* Loading */}

{
loading &&
<div className="text-center mt-5">

<div className="spinner-border text-success"></div>

</div>
}



{/* ================= CHATS ================= */}

{

!loading &&

tab==="Chats" &&

filteredChats.map(chat=>(

<div

key={chat.Id}

className={`d-flex align-items-center p-3 border-bottom chat-item ${
selectedChat?.Id===chat.Id
?
"bg-success bg-opacity-10"
:
""
}`}

style={{

cursor:"pointer"

}}

onClick={()=>

setSelectedChat(chat)

}

>

<div className="position-relative">

<img

src={imagePath(chat.ProfileImage)}

alt=""

className="rounded-circle"

style={{

width:"55px",

height:"55px",

objectFit:"cover"

}}

/>

{

chat.IsOnline===1 &&

<span

className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"

style={{

width:"14px",

height:"14px"

}}

></span>

}

</div>

<div className="ms-3 flex-grow-1">

<div className="d-flex justify-content-between">

<h6 className="mb-1">

{chat.Name}

</h6>

<small className="text-muted">

{chat.LastMessageTime}

</small>

</div>

<p

className="text-muted mb-0 text-truncate"

style={{

fontSize:"14px"

}}

>

{chat.LastMessage}

</p>

</div>

{

chat.UnreadCount>0 &&

<div

className="badge bg-success rounded-pill"

>

{chat.UnreadCount}

</div>

}

</div>

))

}




{/* ================= GROUPS ================= */}

{

!loading &&

tab==="Groups" &&

filteredGroups.map(group=>(

<div

key={group.Id}

className={`d-flex align-items-center p-3 border-bottom ${
selectedChat?.Id===group.Id
?
"bg-success bg-opacity-10"
:
""
}`}

style={{

cursor:"pointer"

}}

onClick={()=>

setSelectedChat(group)

}

>

<img

src={imagePath(group.Image)}

alt=""

className="rounded-circle"

style={{

width:"55px",

height:"55px",

objectFit:"cover"

}}

/>

<div className="ms-3 flex-grow-1">

<div className="d-flex justify-content-between">

<h6 className="mb-1">

{group.Name}

</h6>

<small>

{group.LastMessageTime}

</small>

</div>

<p

className="text-muted mb-0 text-truncate"

>

{group.LastMessage}

</p>

</div>

{

group.UnreadCount>0 &&

<span

className="badge bg-success rounded-pill"

>

{group.UnreadCount}

</span>

}

</div>

))

}




{/* ================= STATUS ================= */}

{

!loading &&

tab==="Status" &&

filteredStatus.map(item=>(

<div

key={item.Id}

className="d-flex align-items-center p-3 border-bottom"

style={{

cursor:"pointer"

}}

>

<div
className="rounded-circle p-1 border border-3 border-success">

<img

src={imagePath(item.ProfileImage)}

alt=""

className="rounded-circle"

style={{

width:"52px",

height:"52px",

objectFit:"cover"

}}

/>

</div>

<div className="ms-3">

<h6 className="mb-0">

{item.Name}

</h6>

<small className="text-muted">

{item.CreatedAt}

</small>

</div>

</div>

))

}




{/* ================= CHANNELS ================= */}

{

!loading &&

tab==="Channels" &&

filteredChannels.map(channel=>(

<div

key={channel.Id}

className="d-flex align-items-center p-3 border-bottom"

style={{

cursor:"pointer"

}}

>

<img

src={imagePath(channel.Image)}

alt=""

className="rounded-circle"

style={{

width:"55px",

height:"55px",

objectFit:"cover"

}}

/>

<div className="ms-3 flex-grow-1">

<h6 className="mb-1">

{channel.Name}

</h6>

<p

className="mb-0 text-muted text-truncate"

>

{channel.Description}

</p>

</div>

<button

className="btn btn-success btn-sm rounded-pill"

>

Join

</button>

</div>

))

}




{

!loading &&

tab==="Chats" &&

filteredChats.length===0 &&

<div className="text-center mt-5">

<h6 className="text-muted">

No Chats Found

</h6>

</div>

}



{

!loading &&

tab==="Groups" &&

filteredGroups.length===0 &&

<div className="text-center mt-5">

<h6 className="text-muted">

No Groups Found

</h6>

</div>

}



{

!loading &&

tab==="Status" &&

filteredStatus.length===0 &&

<div className="text-center mt-5">

<h6 className="text-muted">

No Status Available

</h6>

</div>

}



{

!loading &&

tab==="Channels" &&

filteredChannels.length===0 &&

<div className="text-center mt-5">

<h6 className="text-muted">

No Channels Available

</h6>

</div>

}

</div>
{/* ================= FOOTER ================= */}

<div
className={`border-top p-3 ${
darkMode
?
"bg-secondary"
:
"bg-light"
}`}
>

<div className="d-grid gap-2">

{/* Profile */}

<button
className="btn btn-outline-success d-flex align-items-center"
onClick={()=>{
window.location="/profile";
}}
>

<i className="bi bi-person-circle me-2"></i>

My Profile

</button>



{/* Settings */}

<button
className="btn btn-outline-primary d-flex align-items-center"
onClick={()=>{
window.location="/settings";
}}
>

<i className="bi bi-gear me-2"></i>

Settings

</button>



{/* Dark Mode */}

<button
className="btn btn-outline-dark d-flex align-items-center"
onClick={()=>{

const mode=!darkMode;

setDarkMode(mode);

localStorage.setItem(
"darkMode",
mode
);

}}
>

{

darkMode

?

<>

<FaSun className="me-2"/>

Light Mode

</>

:

<>

<FaMoon className="me-2"/>

Dark Mode

</>

}

</button>



{/* Logout */}

<button

className="btn btn-danger d-flex align-items-center"

onClick={()=>{

localStorage.removeItem("token");

localStorage.removeItem("user");

window.location="/";

}}

>

<i className="bi bi-box-arrow-right me-2"></i>

Logout

</button>

</div>

</div>

</div>

);

}

export default Sidebar;