import axios from "axios";
import { getCookie } from "../utils/cookieUtil";

//const url = 'https://django-app-1093993747989.asia-northeast3.run.app';
const url = 'http://127.0.0.1:8000';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.headers.common['X-CSRFToken'] = getCookie("csrftoken");

console.log(getCookie("csrftoken"))

export const getMyLogList = async (userId) => {
    const response = await axios.get(`${url}/mylog/${userId}/interviews/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        }
      })
    return response.data;
  }
  