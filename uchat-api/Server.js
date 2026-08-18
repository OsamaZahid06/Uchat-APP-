const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

// Connect to SQL Server
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/profile", require("./routes/profile"));
const profileRoute = require("./routes/profile");

console.log("PROFILE ROUTE:", profileRoute);
console.log("TYPE:", typeof profileRoute);

app.use("/api/profile", profileRoute);

app.use("/api/profile", profileRoute);
app.use("/api/chats", require("./routes/chats"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/channels", require("./routes/channels"));
app.use("/api/status", require("./routes/status"));
app.use("/api/calls", require("./routes/calls"));
app.use("/api/notifications", require("./routes/notifications"));
app.use(
"/uploads",
express.static("uploads")
);
// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to UChat API",
        version: "1.0.0"
    });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

const http = require("http");

const server = http.createServer(app);


const initSocket = require("./sockets/socket");

initSocket(server);



server.listen(PORT, () => {

    console.log(
        `🚀 Server running on port ${PORT}`
    );

});