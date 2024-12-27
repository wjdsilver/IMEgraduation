import './App.css'
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Canvas } from '@react-three/fiber'
import DDock3D from './components/DDock3D';
import { useRecoilState } from 'recoil';
import { myJobQuestionAtom } from '../src/store/atom';
import { postMyJob } from './apis/interview';

const SaveButton = styled.button`
font-size: 17px;
border-radius: 50px;
display: flex;
border: 1px solid white;
gap: 10px;
height: 30px;
margin-bottom: 16px;
justify-content: center;
align-items: center;
padding: 20px 20px;
`;


function App() {
  const navigate = useNavigate();

  const [myPart, setMyPart] = useState('');
  const [myJob, setMyJob] = useState('');

  const [myJobQuestion, setMyJobQuestion] = useRecoilState(myJobQuestionAtom);
  return (
    <>
      <div className='h-[75vh]'>
        <Canvas>
          <DDock3D />
        </Canvas>
      </div>
      <div>
        <div className='flex flex-row justify-center gap-[10px] m-[auto] h-[30px] mb-[10px]'>
          <div>희망 분야</div>
          <input value={myPart}
            onChange={(e) => {
              setMyPart(e.target.value);
            }}
            className='h-[30px] outline-none ' />
        </div>
        <div className='flex flex-row justify-center gap-[10px] m-[auto] h-[30px] mb-[30px]'>
          <div>담당 직무</div>
          <input value={myJob}
            onChange={(e) => {
              setMyJob(e.target.value);
            }}
            className='h-[30px] outline-none ' />
        </div>
        <SaveButton
          className='m-[auto]'
          onClick={() =>
            postMyJob(myPart, myJob).then(data => {
              setMyJobQuestion(data.choices[0].message.content)
              navigate('/interview')
            })
          }
        >
          면접 보러 가기</SaveButton>
      </div>
    </>
  )
}

export default App
