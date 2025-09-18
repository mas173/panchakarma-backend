const { doshaPredictor } = require("../algorithm/doshaPredictor")
const geminiFeedback = require("../algorithm/geminiApi")
const geminichatFeedback = require("../algorithm/geminiApicall")

const getdoshas = async(req,res)=>{
 
  try {
     const id = req.params.id
     console.log(id)
const data =await doshaPredictor(id)
const feedback = await geminiFeedback(data)

return res.status(200).json({data,feedback})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"failed to predict"})
    
  }



}
const chatbot = async (req,res)=>{
const {query} = req.body
console.log(req.body)

if(!query){
  return res.status(400).json({
    message:"please provide query question"
  })
}

try {
  const answer = await geminichatFeedback(query)
 return res.status(200).json({
  answer:answer
 })

} catch (error) {
  console.log(error)
  return res.status(500).json({
    message:"chat bot is too busy! try again later"
  })
}

}

module.exports = {getdoshas ,chatbot}