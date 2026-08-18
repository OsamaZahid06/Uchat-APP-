const { sql, connectDB } = require("../config/db");


// Create Call
exports.createCall = async(req,res)=>{

    try{

        const {
            receiverId,
            callType
        } = req.body;


        const callerId = req.user.id;


        const pool = await connectDB();


        const result = await pool.request()

        .input("callerId",sql.Int,callerId)

        .input("receiverId",sql.Int,receiverId)

        .input(
            "callType",
            sql.NVarChar(20),
            callType || "Voice"
        )

        .query(`

            INSERT INTO Calls
            (
                CallerId,
                ReceiverId,
                CallType
            )

            OUTPUT INSERTED.*

            VALUES
            (
                @callerId,
                @receiverId,
                @callType
            )

        `);



        res.status(201).json({

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






// Update Call Status
exports.updateCall = async(req,res)=>{


    try{


        const {
            status,
            duration
        } = req.body;



        const pool=await connectDB();



        await pool.request()

        .input(
            "id",
            sql.Int,
            req.params.id
        )

        .input(
            "status",
            sql.NVarChar(20),
            status
        )

        .input(
            "duration",
            sql.Int,
            duration || 0
        )

        .query(`


            UPDATE Calls

            SET
            CallStatus=@status,
            CallDuration=@duration

            WHERE CallId=@id


        `);



        res.json({

            success:true,

            message:"Call updated"

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








// Call History
exports.callHistory = async(req,res)=>{


    try{


        const pool=await connectDB();



        const result=await pool.request()

        .input(
            "userId",
            sql.Int,
            req.user.id
        )

        .query(`


            SELECT

            c.*,

            p.FName,

            p.LName,

            p.ProfileImage


            FROM Calls c


            INNER JOIN Profile p

            ON
            (
                p.Id=c.ReceiverId
                AND c.CallerId=@userId
            )
            OR
            (
                p.Id=c.CallerId
                AND c.ReceiverId=@userId
            )


            WHERE
            c.CallerId=@userId
            OR
            c.ReceiverId=@userId


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