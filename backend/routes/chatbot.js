const express = require("express");
const axios = require("axios");
const pool = require("../database.js");
const { GoogleGenerativeAI } = require("@google/generative-ai"); 
const router = express.Router();

const genAI = new GoogleGenerativeAI("AIzaSyDkYw6Mal5CEm0pe5Wfx3tBpo3b8Lftwwg"); 
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const prompt = `Respond to the following emergency message with a concise and informative response within 128 words: "${message}"`; 
    const result = await model.generateContent(prompt);
    let botReply = result.response.text();

    // Handle emergencies 
    const emergencyType = identifyEmergency(message);
    if (emergencyType) {
      const twitterHandle = getTwitterHandleForEmergency(emergencyType);
      botReply += ` Contact ${twitterHandle} for assistance.`; 
      // Adjust truncation to accommodate potential handle length
      botReply = botReply.slice(0, 128); 
    }

    // Save chat data to the database
    await pool.query("INSERT INTO chats (message, reply) VALUES ($1, $2)", [message, botReply]);

    res.json({ 
      reply: botReply,
      options: [
        { text: "Tweet this response", value: "tweet" },
        { text: "Ask another query", value: "query" }
      ]
    }); 
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Helper functions remain the same
function identifyEmergency(message) {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("fire")) return "fire";
  return null;
}

function getTwitterHandleForEmergency(emergencyType) {
  const handles = {
    fire: "@firedept",
    police: "@policedept",
    ambulance: "@ambulance",
  };
  return handles[emergencyType] || "@emergencyservices";
}

module.exports = router;