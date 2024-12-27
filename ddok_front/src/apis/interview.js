import axios from "axios";
import { getCookie } from "../utils/cookieUtil";

//const url = 'https://django-app-1093993747989.asia-northeast3.run.app';
const url = 'http://127.0.0.1:8000';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.headers.common['X-CSRFToken'] = getCookie("csrftoken");

console.log(getCookie("csrftoken"))

export const postMyJob = async (input_field, input_job) => {
  const response = await axios.post(`${url}/interview_questions/`, {
    input_field: input_field,
    input_job: input_job
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Authorization")}`
    }
  })
  return response.data;
};

export const postMyAnswer = async (formData, userId, interviewId) => {
  const response = await axios.post(`${url}/interview/voice/${userId}/${interviewId}/?action=upload`, formData
    , {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        'Content-Type': 'multipart/form-data',
      }
    })
  return response.data;
};

export const postMyAnswerVoice = async (results, userId, questionId) => {
  const response = await axios.post(`${url}/interview/voice/${userId}/${questionId}/?action=merge`, results
    , {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      }
    })
  return response.data;
};

export const getMyAnalyze = async (userId, interviewId) => {
  const response = await axios.get(`${url}/mylog/${userId}/${interviewId}/scripts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        'Content-Type': 'multipart/form-data',
      }
    })
  return response.data;
}

export const postMyAnswerText = async (results, userId, questionId = 0) => {
  const reqData = {}
  results.forEach((item, index) => {
    reqData[`script_${index + 1}`] = item;
  })
  const response = await axios.post(`${url}/interview/responses/${userId}/${questionId}/`, reqData
    , {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      }
    })
  return response.data;
};

export const postMyAnswerVideo = async (formData, userId, interviewId) => {
  const response = await axios.post(`${url}/eyetrack/upload-video/${userId}/${interviewId}/`, formData
    , {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        'Content-Type': 'multipart/form-data',
      }
    })
  return response.data;
};

export const getSignedUrl = async (userId, interviewId, fileName, contentType) => {
  const response = await axios.post(`${url}/eyetrack/generate-signed-url/${userId}/${interviewId}/`, {file_name: fileName, content_type: contentType}
  ,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      }
    })
  return response.data;
}

export const putInterviewVideo = async (signedUrl, file) => {
  const response = await axios.put(signedUrl, file,{
      headers: {
        'Content-Type': ''
      }
    })
  return response.data;
}

export const postEyeTrackingStart = async (userId, interviewId) => {
  const response = await axios.post(`${url}/eyetrack/start/${userId}/${interviewId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      }
    })
  return response.data;
}

export const postEyeTrackingStop = async (userId, interviewId) => {
  const response = await axios.post(`${url}/eyetrack/stop/${userId}/${interviewId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      }
    })
  return response.data;
}

export const getMySoundLog = async (userId, interviewId) => {
  const response = await axios.get(`${url}/mylog/${userId}/${interviewId}/voice/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      }
    })
  return response.data;
}

