import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';


import { RecoilRoot } from 'recoil';
import Router from './components/main/Router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Router/> 
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);

console.log('App rendered:', import.meta.env.BASE_URL);
