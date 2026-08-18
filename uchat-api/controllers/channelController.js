const { sql, connectDB } = require("../config/db");


// Create Channel
exports.createChannel = async (req, res) => {

    try {

        const {
            channelName,
            description
        } = req.body;


        const userId = req.user.id;


        const pool = await connectDB();


        const result = await pool.request()

            .input(
                "channelName",
                sql.NVarChar(100),
                channelName
            )

            .input(
                "description",
                sql.NVarChar(500),
                description || null
            )

            .input(
                "createdBy",
                sql.Int,
                userId
            )

            .query(`

                INSERT INTO Channels
                (
                    ChannelName,
                    Description,
                    CreatedBy
                )

                OUTPUT INSERTED.*

                VALUES
                (
                    @channelName,
                    @description,
                    @createdBy
                )

            `);


        res.status(201).json({

            success:true,

            message:"Channel created",

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





// Get All Channels
exports.getChannels = async(req,res)=>{


    try{


        const pool = await connectDB();


        const result = await pool.request()

        .query(`

            SELECT

            c.ChannelId,

            c.ChannelName,

            c.Description,

            p.FName + ' ' + p.LName AS CreatedBy,

            c.CreatedAt


            FROM Channels c


            INNER JOIN Profile p

            ON c.CreatedBy=p.Id


            ORDER BY c.CreatedAt DESC

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







// Subscribe Channel
exports.subscribeChannel = async(req,res)=>{


    try{


        const userId=req.user.id;

        const {
            channelId
        }=req.params;


        const pool=await connectDB();



        await pool.request()

        .input(
            "channelId",
            sql.Int,
            channelId
        )

        .input(
            "userId",
            sql.Int,
            userId
        )

        .query(`

            INSERT INTO ChannelMembers
            (
                ChannelId,
                UserId
            )

            VALUES
            (
                @channelId,
                @userId
            )

        `);



        res.json({

            success:true,

            message:"Subscribed successfully"

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








// Get My Channels
exports.myChannels = async(req,res)=>{


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

            c.*


            FROM Channels c


            INNER JOIN ChannelMembers cm

            ON c.ChannelId=cm.ChannelId


            WHERE cm.UserId=@userId


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








// Post Channel Message
exports.postMessage = async(req,res)=>{


    try{


        const {
            messageText
        }=req.body;


        const {
            channelId
        }=req.params;



        const pool=await connectDB();



        const result=await pool.request()

        .input(
            "channelId",
            sql.Int,
            channelId
        )

        .input(
            "messageText",
            sql.NVarChar(sql.MAX),
            messageText
        )

        .query(`

            INSERT INTO ChannelMessages
            (
                ChannelId,
                MessageText
            )

            OUTPUT INSERTED.*

            VALUES
            (
                @channelId,
                @messageText
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






// Get Channel Messages
exports.getMessages = async(req,res)=>{


    try{


        const pool=await connectDB();



        const result=await pool.request()

        .input(
            "channelId",
            sql.Int,
            req.params.channelId
        )

        .query(`


            SELECT *

            FROM ChannelMessages

            WHERE ChannelId=@channelId

            ORDER BY CreatedAt ASC


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


module.exports = exports;