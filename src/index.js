const express = require("express");
const cookieParser = require("cookie-parser");
const cors =require("cors")
const dotenv = require("dotenv").config();
const dbconnect = require("./lib/db");
const patientRoute = require("./routes/patient.route");
const Deprouter = require("./routes/department.route");
const DocRoute = require("./routes/doctor.route");
const clinicRoutes = require("./routes/clinic.route");
const practationerRoute = require("./routes/practationer.route");
const mediaRoutes = require("./routes/media.routes");
const detailsroute = require("./routes/details.route");
const chatRouter = require("./routes/chat.route");
const PORT = process.env.PORT || 8080;



const app = express();

app.use(express.json())
app.use(cors({
   origin: "http://localhost:5173", 

  credentials: true
}))
app.use(cookieParser())


app.use("/api/patient",patientRoute)
// app.use("/api/practitioner",DocRoute)
app.use("/api/department",Deprouter)
app.use("/api/clinic",clinicRoutes)
app.use("/api/practitioner",practationerRoute)
app.use("/api/media",mediaRoutes)
app.use("/api/details",detailsroute)
app.use("/api/chat",chatRouter)

dbconnect().then(() => {
  app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
  });
});
