const mongoose=require("mongoose");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

let connectionPromise;

async function connectToDb(){
    if(mongoose.connection.readyState === 1){
        return mongoose.connection;
    }

    if(mongoose.connection.readyState === 0){
        connectionPromise=undefined;
    }

    if(!connectionPromise){
        connectionPromise=mongoose.connect(process.env.MONGO_URI).catch((error)=>{
            connectionPromise=undefined;
            throw error;
        });
    }

    try{
        await connectionPromise;
        console.log("Connected to MongoDB");
        return mongoose.connection;
    }
    catch(err){
        console.error("MongoDB connection failed:",err.message);
        throw err;
    }
}

module.exports=connectToDb;