require("dotenv").config();
const app=require("./src/app.js");
const connectToDb=require("./src/config/database.js");
async function handler(req,res){
	await connectToDb();
	return app(req,res);
}




if(require.main === module){
	connectToDb()
		.then(()=>{
			const port=process.env.PORT || 3000;
			app.listen(port,()=>{
				console.log(`server is running on port ${port}`);
			});
		})
		.catch((error)=>{
			console.error("Failed to connect to the database:",error);
			process.exit(1);
		});
}


module.exports=handler;