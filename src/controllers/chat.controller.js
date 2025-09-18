const { generateStreamToken } = require("../lib/stream");

const getStreamToken = async (req,res)=>{
  const id =req.user._id
  console.log(id)
try {
    const streamToken = generateStreamToken(id);
     console.log(req.user.id)
  res.status(200).json({streamToken});
} catch (error) {
  console.log(error);
  return res.status(500).json({message:"failed to generate stream token"})
}

}

module.exports = {getStreamToken}