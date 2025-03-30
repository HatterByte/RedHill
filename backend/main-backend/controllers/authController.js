import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";


export const getUser = async (req, res) => {
    try {
        const loggedIn = req.loggedIn;

        if (loggedIn) {
            // User is logged in, fetch user details
            const user = await User.findOne({ _id: req.user._id });
            return res.status(200).json({
                message: "User fetched successfully",
                user,
                loggedIn,
            });
        } else {
            // User is not logged in
            return res.status(200).json({ message: "Not logged in", loggedIn });
        }
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
};



    export const createUser = async(req,res)=>{
        try {
            const { name,password,phone } = req.body;
            const user = await User.findOne({ phone });
            if(user){
                return res.status(400).json({message:"User already exists"})      
            }
            else{
                const hashPassword = await bcryptjs.hash(password,10);
                const CreatedUser= await User.create({
                    name : name,
                    phone : phone,
                    password : hashPassword,
                    complaintTickets:[]
                })
                const options = {
                    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                     //only manipulate by server not by client/user
                     secure:false,
                     httpOnly:true
                };
                    const token = jwt.sign({_id: CreatedUser._id }, process.env.JWT_SECRET, {
                        expiresIn: "1d",
                    
                    });
                return res.cookie("accessToken", token,options).status(200).json({message:"User Registered sucessfully",CreatedUser})

            }
            
        } catch (error) {
            console.log("Error: " + error.message);
            res.status(500).json({message: "Internal server error"});
        }
    }