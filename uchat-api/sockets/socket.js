const socketIO = require("socket.io");


let onlineUsers = [];


function initSocket(server) {


    const io = socketIO(server, {

        cors:{
            origin:"*",
            methods:["GET","POST"]
        }

    });



    io.on("connection",(socket)=>{


        console.log(
            "🟢 Connected:",
            socket.id
        );





        /*
        USER ONLINE
        */

        socket.on(
            "userOnline",
            (userId)=>{


            const existing =
            onlineUsers.find(
                user=>user.userId===userId
            );



            if(!existing){


                onlineUsers.push({

                    userId,

                    socketId:socket.id

                });


            }
            else{


                existing.socketId =
                socket.id;


            }



            io.emit(
                "onlineUsers",
                onlineUsers
            );



            console.log(
                "Online Users",
                onlineUsers
            );


        });







        /*
        CHECK USER ONLINE
        */


        socket.on(
            "checkOnline",
            (userId)=>{


            const user =
            onlineUsers.find(
                u=>u.userId===userId
            );



            if(user){


                socket.emit(
                    "userOnline",
                    {
                        userId
                    }
                );


            }
            else{


                socket.emit(
                    "userOffline",
                    {
                        userId
                    }
                );


            }


        });







        /*
        JOIN CHAT ROOM
        */


        socket.on(
            "joinChat",
            (chatId)=>{


            socket.join(
                `chat_${chatId}`
            );


            console.log(
                `Joined chat_${chatId}`
            );



            socket.to(
                `chat_${chatId}`
            )
            .emit(
                "userJoined",
                socket.id
            );


        });








        /*
        SEND MESSAGE
        */


        socket.on(
            "sendMessage",
            (data)=>{


            /*
            {
              chatId,
              senderId,
              receiverId,
              message
            }
            */


            io.to(
                `chat_${data.chatId}`
            )
            .emit(
                "receiveMessage",
                data
            );




            // notification

            const receiver =
            onlineUsers.find(
                u=>u.userId===data.receiverId
            );


            if(receiver){


                io.to(
                    receiver.socketId
                )
                .emit(
                    "newMessageNotification",
                    data
                );


            }



        });








        /*
        TYPING START
        */


        socket.on(
            "typing",
            (data)=>{


            socket.to(
                `chat_${data.chatId}`
            )
            .emit(
                "userTyping",
                {

                userId:data.userId,

                typing:true

                }
            );


        });






        /*
        STOP TYPING
        */


        socket.on(
            "stopTyping",
            (data)=>{


            socket.to(
                `chat_${data.chatId}`
            )
            .emit(
                "userTyping",
                {

                userId:data.userId,

                typing:false

                }
            );


        });








        /*
        MESSAGE DELIVERED
        */


        socket.on(
            "messageDelivered",
            (data)=>{


            io.to(
                `chat_${data.chatId}`
            )
            .emit(
                "messageStatus",
                {

                messageId:data.messageId,

                status:"delivered"

                }
            );


        });







        /*
        MESSAGE READ
        */


        socket.on(
            "messageRead",
            (data)=>{


            io.to(
                `chat_${data.chatId}`
            )
            .emit(
                "messageStatus",
                {

                messageId:data.messageId,

                status:"read"

                }
            );


        });










        /*
        AUDIO / VIDEO CALL
        */


        socket.on(
            "callUser",
            (data)=>{


            /*
            {
             from,
             to,
             type:"audio/video"
            }
            */


            const receiver =
            onlineUsers.find(
                u=>u.userId===data.to
            );



            if(receiver){


                io.to(
                    receiver.socketId
                )
                .emit(
                    "incomingCall",
                    data
                );


            }



        });









        /*
        ACCEPT CALL
        */


        socket.on(
            "acceptCall",
            (data)=>{


            const caller =
            onlineUsers.find(
                u=>u.userId===data.to
            );


            if(caller){


                io.to(
                    caller.socketId
                )
                .emit(
                    "callAccepted",
                    data
                );


            }


        });









        /*
        REJECT CALL
        */


        socket.on(
            "rejectCall",
            (data)=>{


            const caller =
            onlineUsers.find(
                u=>u.userId===data.to
            );


            if(caller){


                io.to(
                    caller.socketId
                )
                .emit(
                    "callRejected",
                    data
                );


            }


        });









        /*
        END CALL
        */


        socket.on(
            "endCall",
            (data)=>{


            const user =
            onlineUsers.find(
                u=>u.userId===data.to
            );



            if(user){


                io.to(
                    user.socketId
                )
                .emit(
                    "callEnded"
                );


            }



        });









        /*
        DISCONNECT
        */


        socket.on(
            "disconnect",
            ()=>{


            const user =
            onlineUsers.find(
                u=>u.socketId===socket.id
            );


            onlineUsers =
            onlineUsers.filter(
                u=>u.socketId!==socket.id
            );



            if(user){


                io.emit(
                    "userOffline",
                    {
                        userId:user.userId
                    }
                );


            }



            io.emit(
                "onlineUsers",
                onlineUsers
            );



            console.log(
                "🔴 Disconnected:",
                socket.id
            );


        });




    });



    return io;

}



module.exports = initSocket;