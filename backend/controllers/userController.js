import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary"

//API to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "password should be at least 8 characters",
      });
    }

    //Hasing the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//Api for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User Not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "User Not found",
    });
  }
};

//Api to get User Profile Data

const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the authUser middleware
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the profile",
    });
  }
};

const updateProfile=async (req,res)=>{
  try {
    const userId=req.userId;
    const {name,phone,address,dob,gender}=req.body;
    const imageFile=req.file;

    if(!name || !phone || !dob || !gender){
      return res.json({
        success:false,
        message:"Plese Enter All the Fields"
      })
    }

    await userModel.findByIdAndUpdate(userId,{
      name,
      phone,
      address:JSON.parse(address),
      dob,
      gender,
    })

    if(imageFile){
      //upload image to cloudinary
      const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageUrl=imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId,{
        image:imageUrl
      })

    }

    res.json({
      success:true,
      message:"Profile Updated"
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the profile",
    });
    
  }

}

export { registerUser, loginUser, getProfile, updateProfile };
