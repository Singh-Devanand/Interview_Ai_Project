const userModel=require("../models/user.model.js");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const tokenBlacklistModel=require("../models/blacklist.model.js");

const isProduction=process.env.NODE_ENV === "production";
const authCookieOptions={
    httpOnly:true,
    secure:isProduction,
    sameSite:isProduction ? "none" : "lax",
    maxAge:24 * 60 * 60 * 1000,
    path:"/"
};

/**
 * @ route registerUserContoller
 * @ description Register a new user,expects username,email and password in the request body
 * @ access Public
 */

async function registerUserController(req,res){
    const {username,email,password}=req.body;

    if(!username || !email || !password){
        return res.status(400).json({message:"Please provide username,email and password"});
}

const isUserAlreadyExists=await userModel.findOne({
    $or:[
        {username:username},
        {email:email}
    ]
});

if(isUserAlreadyExists){
    return res.status(400).json({message:"Account with this username or email already exists"});
}

const hash=await bcrypt.hash(password,10);
 const user=await userModel.create({
    username,
    email,
    password:hash
});
 
const token=jwt.sign({id:user._id,username:user.username},
process.env.JWT_SECRET,
{expiresIn:"1d"})

res.cookie("token",token,authCookieOptions);

res.status(201).json({
    message:"User registered successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
})

}

/**
 * @ name login
 * @ description Login a user, expects email and password in the request body
 * @ access Public
 */
async function loginController(req,res){
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({message:"Please provide email and password"});
    }

    const user=await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const token=jwt.sign({id:user._id,username:user.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"})

    res.cookie("token",token,authCookieOptions);

    res.status(200).json({
        message:"Login successful",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 * @ name logoutUserController
 * @ description clear token from cookies and add token  to blacklist
 * @ access Public
 */

async function logoutController(req,res){
    const token=req.cookies.token;

    if(!token){
        return res.status(400).json({message:"No token found"});
    }

    await tokenBlacklistModel.create({token});

    res.clearCookie("token",{
        httpOnly:authCookieOptions.httpOnly,
        secure:authCookieOptions.secure,
        sameSite:authCookieOptions.sameSite,
        path:authCookieOptions.path
    });

    res.status(200).json({message:"Logout successful"});
}


/**
 * @name getUserController
 * @description get the current logged in user's details. from the req.user object which is set by the authMiddleware
 * @access Private
 */

async function getUserController(req,res){
    const user=await userModel.findById(req.user.id).select("-password");
    res.status(200).json({
        message:"User details fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
})
}



module.exports={registerUserController,loginController,logoutController,getUserController};