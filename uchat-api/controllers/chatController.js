const { sql, connectDB } = require("../config/db");

// Create Private Chat
exports.createPrivateChat = async (req, res) => {

    try {

        const { userId } = req.body;
        const myId = req.user.id;

        if (myId === userId) {
            return res.status(400).json({
                success: false,
                message: "You cannot chat with yourself."
            });
        }

        const pool = await connectDB();

        // Check if chat already exists
        const existingChat = await pool.request()
            .input("myId", sql.Int, myId)
            .input("userId", sql.Int, userId)
            .query(`
                SELECT cm1.ChatId
                FROM ChatMembers cm1
                INNER JOIN ChatMembers cm2
                    ON cm1.ChatId = cm2.ChatId
                INNER JOIN Chats c
                    ON c.ChatId = cm1.ChatId
                WHERE
                    cm1.UserId = @myId
                    AND cm2.UserId = @userId
                    AND c.ChatType='Private'
            `);

        if (existingChat.recordset.length > 0) {
            return res.json({
                success: true,
                chatId: existingChat.recordset[0].ChatId
            });
        }

        // Create chat
        const chat = await pool.request()
            .query(`
                INSERT INTO Chats(ChatType)
                OUTPUT INSERTED.ChatId
                VALUES('Private')
            `);

        const chatId = chat.recordset[0].ChatId;

        // Add logged in user
        await pool.request()
            .input("chatId", sql.Int, chatId)
            .input("userId", sql.Int, myId)
            .query(`
                INSERT INTO ChatMembers(ChatId,UserId)
                VALUES(@chatId,@userId)
            `);

        // Add friend
        await pool.request()
            .input("chatId", sql.Int, chatId)
            .input("userId", sql.Int, userId)
            .query(`
                INSERT INTO ChatMembers(ChatId,UserId)
                VALUES(@chatId,@userId)
            `);

        res.json({
            success: true,
            chatId
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};


// Get All Chats
exports.getChats = async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request()
            .input("userId", sql.Int, req.user.id)
            .query(`
                SELECT
                    c.ChatId,
                    c.ChatType,
                    c.ChatName,
                    p.Id,
                    p.FName,
                    p.LName,
                    p.ProfileImage,
                    p.IsOnline
                FROM Chats c
                INNER JOIN ChatMembers cm
                    ON c.ChatId = cm.ChatId
                INNER JOIN ChatMembers cm2
                    ON c.ChatId = cm2.ChatId
                INNER JOIN Profile p
                    ON cm2.UserId = p.Id
                WHERE
                    cm.UserId=@userId
                    AND cm2.UserId<>@userId
            `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};


// Chat Details
exports.getChat = async (req, res) => {

    try {

        const pool = await connectDB();

        const result = await pool.request()
            .input("chatId", sql.Int, req.params.chatId)
            .query(`
                SELECT *
                FROM Chats
                WHERE ChatId=@chatId
            `);

        res.json({
            success: true,
            data: result.recordset[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};


// Delete Chat
exports.deleteChat = async (req, res) => {

    try {

        const pool = await connectDB();

        await pool.request()
            .input("chatId", sql.Int, req.params.chatId)
            .query(`
                DELETE FROM ChatMembers
                WHERE ChatId=@chatId
            `);

        await pool.request()
            .input("chatId", sql.Int, req.params.chatId)
            .query(`
                DELETE FROM Chats
                WHERE ChatId=@chatId
            `);

        res.json({
            success: true,
            message: "Chat Deleted"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};