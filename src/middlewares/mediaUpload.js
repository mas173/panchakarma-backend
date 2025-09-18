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
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET
})

const upload = multer({storage:storage})


const fileUpload = (req,res,next)=>{
    if(!req.file){
    next()
  }
upload.single("image")(req,res,function(err){
  if(err){
    return res.status(400).json({message:err.message})
  }


      req.imgData = {
      image: req.file, 
      imageUrl: req.file?.path, 
    };
    next();
})

}

module.exports = fileUpload