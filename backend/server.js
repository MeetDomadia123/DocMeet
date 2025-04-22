import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRoute from './routes/doctorRoute.js'
import userRouter from './routes/userRoutes.js'




//app Config

const app=express();

const port=process.env.PORT || 4000;
connectDB()
connectCloudinary();

//midlleWares

app.use(express.json())
app.use(cors())

//Api EndPoint

app.use('/api/admin',adminRouter);
//locolhost:4000/api/admin/add-doctor
app.use('/api/doctor',doctorRoute);

app.use('/api/user',userRouter);

app.get('/',(req,res)=>{
    res.send("API WORKING")
})


app.listen(port,()=>{
    console.log("Server Started",port)
});