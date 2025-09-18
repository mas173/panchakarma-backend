
const {GoogleGenAI} =  require("@google/genai")


const ai = new GoogleGenAI({
  apiKey: process.env._GEMINI_API_KEY,

});



 const geminichatFeedback=async(question)=> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `you are a chatbot in this context for my app panchakarma connect and you have to anser questions only related to panchakarma therapy and its process. if any question goes out of the context , then you have to politely refuse it.example
    User: What is Panchakarma?
Bot: Panchakarma is a detoxification therapy in Ayurveda…

User: Who won the cricket match yesterday?
Bot: I can only answer Panchakarma-related questions.
i hope you understood.

now question is ${question}
`,
  });

  // console.log(response.text);
  return response.text
}

module.exports = geminichatFeedback