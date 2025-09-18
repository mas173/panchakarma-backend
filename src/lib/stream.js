const {StreamChat} = require("stream-chat")
const dotenv = require("dotenv").config()

const apiKey = process.env._STEAM_API_KEY
const secretKey =process.env._STEAM_SECRET



if(!apiKey ||!secretKey){
  console.error("stream keys are required")


}

const streamClient = StreamChat.getInstance(apiKey,secretKey)

 const upsertStreamUser = async(userData)=>{

  try {
    
  await streamClient.upsertUsers([userData])
  return userData
  } catch (error) {
    console.log("error upserting stream user !",error)
  }

}

 const generateStreamToken = (userId)=>{
try {
  
    const useridString = userId.toString()
  return streamClient.createToken(useridString)
} catch (error) {
  console.log("error generating stream token !",error)
  return null
}

}

module.exports = {generateStreamToken , upsertStreamUser}