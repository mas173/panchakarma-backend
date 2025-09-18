const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env._GEMINI_API_KEY, 
});

const geminiFeedback=async(doshaData)=> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a friendly Ayurvedic health advisor. 
The patient's dosha scores and result are given below.
Scores are calculated using this algorithm:
- Each symptom marked true adds weight to a dosha (Vata, Pitta, Kapha).
- BMI affects dosha: underweight → Vata, normal → Pitta, overweight/obese → Kapha.
- Age affects dosha: under 16 → Kapha, 16-50 → Pitta, above 50 → Vata.
Using this data, generate a short, simple, patient-friendly explanation of the result.
Explain the relevant doshas in easy language and give 1-2 tips to balance them.
try to make shorter explanation with max of six lines and also try to focus to convince to take therapy if needed in panchakarma, give point-wise ansewr and use simple words that a non mdecial person can understand

Patient's data: ${JSON.stringify(doshaData)}`,
  });

  console.log(response.text);
  return response.text
}

module.exports = geminiFeedback