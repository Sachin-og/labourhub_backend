
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/User"); 
const profileroute = require("./routes/profile");
const postRoutes = require('./routes/postRoutes');
require("dotenv").config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/',profileroute);
// Sync database
sequelize.sync({alter:false, force: false }).then(() => {
  console.log("Database synced");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
