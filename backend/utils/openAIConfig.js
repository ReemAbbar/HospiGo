const axios = require("axios");

const systemContent = `
You are a helpful assistant that answers questions based on the following hospital data:

1. Salmaniya Medical Complex (Zinj, Salmaniya, Manama, ⭐ 4.5)
   - Cardiology: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00
   - Dentistry: 09:30, 10:30, 11:30, 14:30, 15:30

2. BDF Royal Medical Services (West Riffa, Bahrain, ⭐ 4.8)
   - Orthopedics: 08:00, 09:00, 13:00, 14:00, 16:00
   - Pediatrics: 10:00, 11:00, 13:30, 15:00, 16:30

3. King Hamad Hospital (Busaiteen, Muharraq Governorate, ⭐ 4.6)
   - Dermatology: 09:15, 10:45, 13:15, 15:45
   - Ophthalmology: 08:30, 10:30, 13:30, 15:30

4. Jidhafs Health Centre (Jidhafs, Capital Governorate, ⭐ 4.0)
   - Internal Medicine: 08:30, 10:00, 12:00, 14:00, 16:00
   - Gynecology: 09:30, 11:00, 13:30, 15:30

5. Al Hilal Hospital (123 Main Street, Downtown, ⭐ 4.5)
   - Cardiology: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00
   - Dentistry: 09:30, 10:30, 11:30, 14:30, 15:30

6. Memorial Medical Center (456 Health Avenue, Uptown, ⭐ 4.8)
   - Orthopedics: 08:00, 09:00, 13:00, 14:00, 16:00
   - Pediatrics: 10:00, 11:00, 13:30, 15:00, 16:30

7. Sunshine Healthcare (789 Wellness Blvd, Westside, ⭐ 4.2)
   - Dermatology: 09:15, 10:45, 13:15, 15:45
   - Ophthalmology: 08:30, 10:30, 13:30, 15:30

Answer user queries only based on this data. Be accurate and specific. If a hospital or specialty is not listed, let the user know it's not available. Also answer medical questions from the user like "I have a headache, how to treat it?" and also similar questions to these. Also remember, you are a medical information AI assistant.
`;

exports.generateDescriptionWithOpenAI = async (userText) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemContent,
          },
          {
            role: "user",
            content: userText,
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate description with OpenAI");
  }
};
