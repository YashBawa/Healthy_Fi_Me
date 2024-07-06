// api creation for user login and user registration 

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//login user -- api creation for the user login 
// user ke input se data ko bread krke variables mai daal lia 
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        // finding if a email exist in the usermodel or not (if exist email stored in user)
        const user = await userModel.findOne({email})
        
        // user not present then this block executed 
        if(!user){
            return res.json({success:false,message: "User does not exist"})
        }

        // (user entered password)password === user.password(database stored password) 
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    } 
    catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//register user -- api creation for new register which is being called in the useRoute file :)
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // more the no of rounds more time consumption (kind of defining the hashing technique)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        // creation of a new user (token is a unique id for it)
        const newUser = new userModel({name, email, password: hashedPassword})
        // saving user to the database 
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {loginUser, registerUser}