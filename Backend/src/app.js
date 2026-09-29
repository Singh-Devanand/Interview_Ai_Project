const express=require("express");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const connectToDb=require("./config/database.js");
const app=express();

const allowedOrigins=[
    "https://interview-ai-project-3rrp.vercel.app",
    ...(process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin)=>origin.trim())
    .filter(Boolean)
];

if(process.env.NODE_ENV !== "production"){
    allowedOrigins.push("http://localhost:5173");
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin,callback)=>{
        if(!origin || allowedOrigins.includes(origin)){
            return callback(null,true);
        }
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true
}));

app.use(async (req,res,next)=>{
    try{
        await connectToDb();
        next();
    }
    catch(error){
        console.error("Request could not connect to MongoDB:",error.message);
        res.status(503).json({message:"Database is unavailable"});
    }
});

/*require all the routes here  */
const authRouter=require("./routes/auth.routes.js");
const interviewRouter=require("./routes/interview.routes.js");



/*use all the routes here  */
app.use("/api/auth",authRouter);
app.use("/api/interview",interviewRouter);


module.exports=app; 