require("dotenv").config();
const app=require("./src/app.js");
const connectToDb=require("./src/config/database.js");




connectToDb();


app.listen(3000,()=>{
console.log("server is running on port 3000");
});