const { sql, connectDB } = require("../config/db");


// Create Notification
exports.createNotification = async(req,res)=>{


    try{


        const {
            userId,
            title,
            message,
            type
        }=req.body;



        const pool=await connectDB();



        const result=await pool.request()

        .input("userId",sql.Int,userId)

        .input("title",sql.NVarChar(100),title)

        .input("message",sql.NVarChar(sql.MAX),message)

        .input(
            "type",
            sql.NVarChar(50),
            type
        )

        .query(`


            INSERT INTO Notifications

            (
                UserId,
                Title,
                Message,
                NotificationType
            )

            OUTPUT INSERTED.*

            VALUES
            (
                @userId,
                @title,
                @message,
                @type
            )


        `);



        res.json({

            success:true,

            data:result.recordset[0]

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







// Get Notifications
exports.getNotifications = async(req,res)=>{


    try{


        const pool=await connectDB();


        const result=await pool.request()

        .input(
            "userId",
            sql.Int,
            req.user.id
        )

        .query(`


            SELECT *

            FROM Notifications

            WHERE UserId=@userId

            ORDER BY CreatedAt DESC


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








// Mark Read
exports.markRead = async(req,res)=>{


    try{


        const pool=await connectDB();


        await pool.request()

        .input(
            "id",
            sql.Int,
            req.params.id
        )

        .query(`


            UPDATE Notifications

            SET IsRead=1

            WHERE NotificationId=@id


        `);



        res.json({

            success:true,

            message:"Notification read"

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