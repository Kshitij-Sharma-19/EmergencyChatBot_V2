const express = require("express");
const bodyParser = require("body-parser");
const chatbotRoutes = require("./routes/chatbot");
const cors = require('cors');
const app = express();
app.use(cors());

app.use(bodyParser.json());

// Routes
app.use("/api/chat", chatbotRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
