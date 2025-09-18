
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const {CloudinaryStorage} = require("multer-storage-cloudinary")

const storage = new CloudinaryStorage({
  cloudinary:cloudinary,
  params:{
    folder:"panchakarma/profilePic",
    transformation: [{ width: 300, height: 300, crop: "thumb", gravity: "face" }],
    public_id:(req,file)=>{
      const userid = req.user?.id
      return `${userid}_profilePic-${Date.now()}`
    }
  }
})

cloudinary.config({
  cloud_name:process.env._CLOUD_NAME,
  api_key:process.env._API_KEY,
  api_secret:process.env._API_SECRET
})

const upload = multer({storage:storage})


const profileUpload = (req,res)=>{
    if(!req.file){
  
  }
upload.single("profile")(req,res,function(err){
  if(err){
    console.log(err)
    return res.status(400).json({message:"failed to upload profile"})
  }


       const imgData = {
      image: req.file, 
      imageUrl: req.file?.path, 
    };
  
    return res.status(200).json({
      message:"image uploaded",
      imgData:imgData
    })
})

}

module.exports = profileUpload