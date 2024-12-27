import React, { useEffect } from 'react'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes, useNavigate } from 'react-router-dom';
import Result from '@components/result/Result';
import Login from '@components/users/Login';
import SignUp from '@components/users/SignUp';
import InterviewSetting from '@components/interview/InterviewSetting';
import Criterion from '@components/criterion/Criterion';
import About from '@components/about/About';
import InterviewPage from '@components/interview/InterviewPage';
import ResultList from '@components/resultList/ResultList';
import InterviewRecord from '@components/interview/InterviewRecord';
import App from '../../App';
import axios from 'axios';

function Router() {
  const navigate = useNavigate();
  useEffect(() => {
    axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      if (error.response && error.response.status && error.response.status == '401') {
        localStorage.removeItem('Authorization');
        navigate('/users');
      } else {
        return Promise.reject(error);
      }
    });
  }, [])
  
  return (
        <Routes>
          <Route path='/' element={<App/>} />
          <Route path='/criterion' element={<Criterion/>} />
          <Route path='/interview' element={<InterviewSetting />} />
          <Route path='/result/:interviewId' element={<Result />} />
          <Route path='/list' element={<ResultList />} />
          <Route path='/users' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/about' element={<About/>} />
          <Route path='/interview/start' element={<InterviewPage />} />
          <Route path='/interview/record' element={<InterviewRecord />} />
        </Routes>
  )
}

export default Router