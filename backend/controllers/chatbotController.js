const { generateDescriptionWithOpenAI } = require("../utils/openAIConfig");

exports.sendMessage = async (req, res) => {
  try {
    const { userText } = req.body;

    if (!userText) {
      return res.status(400).json({ error: "User text is required" });
    }

    const response = await generateDescriptionWithOpenAI(userText);
    res.json(response);
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};
