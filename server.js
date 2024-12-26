const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/User");
const profileroute = require("./routes/profile");
const postRoutes = require("./routes/postRoutes");
const searchRoutes = require("./routes/searchRoutes");
const notificationRoutes = require("./routes/notificatioRoute");
const chatRoutes = require("./routes/chatRoutes");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

// Import the Message model
const Message = require('./models/Message');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Setup HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Update with your client URL
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
    maxHttpBufferSize: 1e6, // Limit message size to 1 MB
    pingTimeout: 60000, // Adjust ping timeout
});

// Maintain a mapping of user IDs to socket IDs
const onlineUsers = new Map();

// Socket.IO Logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Store user ID and socket ID when a user connects
    socket.on("register_user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} is online with socket ID: ${socket.id}`);
    });

    // Handle messages
    socket.on("send_message", async (data) => {
        const { sender_id, receiver_id, content } = data;

        try {
            // Save message to the database
            const message = await Message.create({ sender_id, receiver_id, content });

            // Check if the receiver is online
            const receiverSocketId = onlineUsers.get(receiver_id);
            if (receiverSocketId) {
                // Emit message to the receiver
                io.to(receiverSocketId).emit("receive_message", message);
            }

            // Emit message to the sender to confirm delivery
            const senderSocketId = onlineUsers.get(sender_id);
            if (senderSocketId) {
                io.to(senderSocketId).emit("message_delivered", message);
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    // Notify users when they go online
    socket.on("user_online", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("user_status_update", { userId, status: "online" });
    });

    // Notify users when they go offline
    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                io.emit("user_status_update", { userId, status: "offline" });
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/", profileroute);
app.use("/search", searchRoutes);
app.use("/notification", notificationRoutes);
app.use("/chat", chatRoutes);

// Sync database
sequelize.sync({ alter: false, force: false }).then(() => {
    console.log("Database synced");
});

// Start Server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
