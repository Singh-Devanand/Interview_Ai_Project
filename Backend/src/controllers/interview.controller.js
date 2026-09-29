const pdfParse=require("pdf-parse");

const generateInterviewReport=require("../services/ai.service");
const interviewReportModel=require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description resume and job description
 */

async function generateInterviewReportController(req,res){

    const resumeFile=req.file
     const resumeContent = await (
        new pdfParse.PDFParse({
            data: new Uint8Array(resumeFile.buffer)
        })
    ).getText();


    const{selfDescription,jobDescription}=req.body;
   
    const interViewReportByAi=await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
    })
    console.log(JSON.stringify(interViewReportByAi, null, 2));

    const interviewReport=await interviewReportModel.create({
        user:req.user.id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message:"Interview report generate successfully",
        interviewReport
    })


      
}

/**
 * @description Controller to get interview report by interviewId
 */
async function getInterviewReportByIdController(req,res){
    const {interviewId}=req.params;

    const interviewReport=await interviewReportModel.findOne({_id:interviewId,user:req.user.id})
    
    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report are not found"
        })
    }

    res.status(200).json({
        message:"Interview report fetched successfully",
        interviewReport
    })
}

/**
 * @description Controller to get all interview report of logged in user
 */

async function getAllInterviewReportController(req,res){
    const interviewReports=await interviewReportModel
        .find({user:req.user.id})
        .select("_id jobDescription matchScore createdAt")
        .sort({createdAt:-1})

  res.status(200).json({
    message:"Interview report fetched successfully",
    interviewReports
  })
} 

module.exports={generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportController};