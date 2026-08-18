const { sql, connectDB } = require("../config/db");


// Create Group
exports.createGroup = async (req, res) => {

    try {

        const {
            groupName,
            members
        } = req.body;


        const adminId = req.user.id;


        if (!groupName || !members || members.length === 0) {

            return res.status(400).json({
                success:false,
                message:"Group name and members required"
            });

        }


        const pool = await connectDB();


        // Create Group Chat
        const chatResult = await pool.request()

            .input(
                "groupName",
                sql.NVarChar(100),
                groupName
            )

            .input(
                "createdBy",
                sql.Int,
                adminId
            )

            .query(`

                INSERT INTO Chats
                (
                    ChatType,
                    ChatName,
                    CreatedBy
                )

                OUTPUT INSERTED.ChatId

                VALUES
                (
                    'Group',
                    @groupName,
                    @createdBy
                )

            `);



        const chatId =
        chatResult.recordset[0].ChatId;



        // Add Admin
        await pool.request()

        .input(
            "chatId",
            sql.Int,
            chatId
        )

        .input(
            "userId",
            sql.Int,
            adminId
        )

        .query(`

            INSERT INTO ChatMembers
            (
                ChatId,
                UserId
            )

            VALUES
            (
                @chatId,
                @userId
            )

        `);




        // Add Members

        for(let userId of members){


            await pool.request()

            .input(
                "chatId",
                sql.Int,
                chatId
            )

            .input(
                "userId",
                sql.Int,
                userId
            )

            .query(`

                INSERT INTO ChatMembers
                (
                    ChatId,
                    UserId
                )

                VALUES
                (
                    @chatId,
                    @userId
                )

            `);


        }



        res.status(201).json({

            success:true,

            message:"Group created",

            chatId

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





// Get Groups
exports.getGroups = async(req,res)=>{


    try{


        const pool = await connectDB();



        const result = await pool.request()

        .input(
            "userId",
            sql.Int,
            req.user.id
        )

        .query(`


            SELECT

            c.ChatId,

            c.ChatName,

            c.CreatedAt


            FROM Chats c


            INNER JOIN ChatMembers cm

            ON c.ChatId=cm.ChatId


            WHERE

            cm.UserId=@userId

            AND c.ChatType='Group'


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







// Add Member
exports.addMember = async(req,res)=>{


    try{


        const {
            userId
        } = req.body;


        const {
            chatId
        } = req.params;



        const pool = await connectDB();


        await pool.request()

        .input(
            "chatId",
            sql.Int,
            chatId
        )

        .input(
            "userId",
            sql.Int,
            userId
        )

        .query(`

            INSERT INTO ChatMembers
            (
                ChatId,
                UserId
            )

            VALUES
            (
                @chatId,
                @userId
            )

        `);



        res.json({

            success:true,

            message:"Member added"

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








// Remove Member
exports.removeMember = async(req,res)=>{


    try{


        const {
            chatId,
            userId
        }=req.params;



        const pool = await connectDB();


        await pool.request()

        .input(
            "chatId",
            sql.Int,
            chatId
        )

        .input(
            "userId",
            sql.Int,
            userId
        )

        .query(`


            DELETE FROM ChatMembers

            WHERE ChatId=@chatId

            AND UserId=@userId


        `);



        res.json({

            success:true,

            message:"Member removed"

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