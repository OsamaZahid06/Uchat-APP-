const { sql, connectDB } = require("../config/db");


// Create Status
exports.createStatus = async (req, res) => {

    try {

        const {
            statusType,
            statusText,
            mediaUrl
        } = req.body;


        const userId = req.user.id;


        const pool = await connectDB();


        const result = await pool.request()

            .input(
                "userId",
                sql.Int,
                userId
            )

            .input(
                "statusType",
                sql.NVarChar(20),
                statusType || "Text"
            )

            .input(
                "statusText",
                sql.NVarChar(sql.MAX),
                statusText || null
            )

            .input(
                "mediaUrl",
                sql.NVarChar(500),
                mediaUrl || null
            )

            .query(`

                INSERT INTO Status
                (
                    UserId,
                    StatusType,
                    StatusText,
                    MediaUrl,
                    ExpireAt
                )

                OUTPUT INSERTED.*

                VALUES
                (
                    @userId,
                    @statusType,
                    @statusText,
                    @mediaUrl,
                    DATEADD(HOUR,24,GETDATE())
                )

            `);


        res.status(201).json({

            success:true,

            message:"Status uploaded",

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







// Get All Active Status
exports.getStatus = async(req,res)=>{


    try{


        const pool = await connectDB();


        const result = await pool.request()

        .query(`

            SELECT

            s.StatusId,

            s.StatusType,

            s.StatusText,

            s.MediaUrl,

            s.CreatedAt,

            p.Id AS UserId,

            p.FName,

            p.LName,

            p.ProfileImage


            FROM Status s


            INNER JOIN Profile p

            ON s.UserId=p.Id


            WHERE s.ExpireAt > GETDATE()


            ORDER BY s.CreatedAt DESC


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








// Get My Status
exports.myStatus = async(req,res)=>{


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

            FROM Status

            WHERE UserId=@userId

            AND ExpireAt > GETDATE()


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









// View Status
exports.viewStatus = async(req,res)=>{


    try{


        const viewerId=req.user.id;


        const {
            statusId
        }=req.params;



        const pool=await connectDB();



        await pool.request()

        .input(
            "statusId",
            sql.Int,
            statusId
        )

        .input(
            "viewerId",
            sql.Int,
            viewerId
        )

        .query(`


            INSERT INTO StatusViews

            (
                StatusId,
                ViewerId
            )

            VALUES

            (
                @statusId,
                @viewerId
            )


        `);



        res.json({

            success:true,

            message:"Status viewed"

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








// Delete Status
exports.deleteStatus = async(req,res)=>{


    try{


        const pool=await connectDB();


        await pool.request()

        .input(
            "statusId",
            sql.Int,
            req.params.id
        )

        .input(
            "userId",
            sql.Int,
            req.user.id
        )

        .query(`


            DELETE FROM Status

            WHERE StatusId=@statusId

            AND UserId=@userId


        `);



        res.json({

            success:true,

            message:"Status deleted"

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



module.exports = exports;