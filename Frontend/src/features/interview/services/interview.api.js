import api from "../../../lib/api.js";

/** 
 * @description services to genertae interview report based on user self description resume and job description
*/
export const generateInterviewReport= async({jobDescription,selfDescription,resumeFile})=>{
    const formData=new FormData();
    formData.append("jobDescription",jobDescription)
    formData.append("selfDescription",selfDescription)
    formData.append("resume",resumeFile)

    const response=await api.post("/api/interview",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
    return response.data 
}

/**
 * @description service to get interview report by interviewId
 */

export const getInterviewReportById= async(interviewId)=>{
    const response=await api.get(`/api/interview/report/${interviewId}`)
    return response.data

}

/**
 * @description services to get all interview report of logged in user 
 */
export const getAllInterviewReport= async()=>{
    const response=await api.get("/api/interview/")
    return response.data

}