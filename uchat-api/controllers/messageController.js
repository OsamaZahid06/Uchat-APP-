const { sql, connectDB } = require("../config/db");


// Send Message
exports.sendMessage = async (req, res) => {

    try {

        const {
            chatId,
            messageText,
            messageType
        } = req.body;


        const senderId = req.user.id;


        if (!chatId || !messageText) {
            return res.status(400).json({
                success:false,
                message:"ChatId and message are required"
            });
        }


        const pool = await connectDB();


        const result = await pool.request()

            .input("chatId", sql.Int, chatId)

            .input("senderId", sql.Int, senderId)

            .input("messageText", sql.NVarChar(sql.MAX), messageText)

            .input(
                "messageType",
                sql.NVarChar(20),
                messageType || "Text"
            )

            .query(`

                INSERT INTO Messages
                (
                    ChatId,
                    SenderId,
                    MessageText,
                    MessageType
                )

                OUTPUT INSERTED.*

                VALUES
                (
                    @chatId,
                    @senderId,
                    @messageText,
                    @messageType
                )

            `);



        res.status(201).json({

            success:true,

            message:"Message sent",

            data:result.recordset[0]

        });



    } catch(err){

        console.log(err);


        res.status(500).json({

            success:false,

            message:"Server Error"

        });

    }

};





// Get Messages of Chat
exports.getMessages = async(req,res)=>{


    try{


        const pool = await connectDB();



        const result = await pool.request()

        .input(
            "chatId",
            sql.Int,
            req.params.chatId
        )

        .query(`

            SELECT

            m.MessageId,

            m.ChatId,

            m.SenderId,

            p.FName,

            p.LName,

            p.ProfileImage,

            m.MessageText,

            m.MessageType,

            m.SentAt,

            m.IsRead


            FROM Messages m


            INNER JOIN Profile p

            ON m.SenderId = p.Id


            WHERE m.ChatId=@chatId


            ORDER BY m.SentAt ASC

        `);



        res.json({

            success:true,

            data:result.recordset

        });



    }
    catch(err){


        console.log(err);


        res.status(500).json({

            success:false,

            message:"Server Error"

        });


    }


};







// Mark Message Read
exports.readMessage = async(req,res)=>{


    try{


        const pool = await connectDB();


        await pool.request()

        .input(
            "messageId",
            sql.Int,
            req.params.id
        )

        .query(`


            UPDATE Messages

            SET IsRead=1

            WHERE MessageId=@messageId


        `);



        res.json({

            success:true,

            message:"Message marked as read"

        });



    }
    catch(err){


        console.log(err);


        res.status(500).json({

            success:false,

            message:"Server Error"

        });


    }


};






// Delete Message
exports.deleteMessage = async(req,res)=>{


    try{


        const pool = await connectDB();


        await pool.request()

        .input(
            "id",
            sql.Int,
            req.params.id
        )

        .query(`


            DELETE FROM Messages

            WHERE MessageId=@id


        `);



        res.json({

            success:true,

            message:"Message deleted"

        });


    }
    catch(err){


        console.log(err);


        res.status(500).json({

            success:false,

            message:"Server Error"

        });


    }


};