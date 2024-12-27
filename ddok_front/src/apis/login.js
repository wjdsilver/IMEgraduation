import axios from "axios";
import { getCookie } from "../utils/cookieUtil";

//const url = 'https://django-app-1093993747989.asia-northeast3.run.app';
const url = 'http://127.0.0.1:8000';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.headers.common['X-CSRFToken'] = getCookie("csrftoken");

export const postSignUP = async (username, password, password2) => {
    const response = await axios.post(`${url}/users/signUp/`, {
        username: username,
        password: password,
        password2: password2
    })
    return response.data;
};

export const postLogIn = async (username, password) => {
    const response = await axios.post(`${url}/users/logIn/`, {
        username: username,
        password: password
    })
    return response.data;
};

export const postLogOut = async () => {
    const response = await axios.post(`${url}/users/logOut/`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("Authorization")}`
        }
    })
    return response.data;
};
