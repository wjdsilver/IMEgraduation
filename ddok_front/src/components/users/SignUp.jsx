import React, { useState } from 'react'
import styled from 'styled-components';
import Typo from '@components/Typography'
import Header from '../Header';
import { postSignUP } from '../../apis/login';
import { useNavigate } from 'react-router-dom';

const Background = styled.div`
position: fixed;
width: 100%;
height: 100vh;     
background-image: linear-gradient(#000,#002A84);
background-repeat : no-repeat;
background-size : cover;
z-index: -2;
`;

const SignUPDiv = styled.div`
  width: 714px;
  font-size: 40px;
  margin: 15% auto;
  border: 2px solid white;
  color: white;
  border-radius: 52px;
  padding: 10px 30px;
  background-color: rgb(255,255,255,0.1);
  backdrop-filter: blur(20px);
`;

const Insert = styled.input`
  width: 362px;
  padding: 20px;
  font-size: 20px;
  height: 60px;
  border-bottom: 2px solid white;
  background-color: transparent;
  &::placeholder{
    color:rgb(255,255,255,0.3);
    font-size: 20px;
  }
`;

const SignUpBtn = styled.div`
  text-align: center;
  width: 362px;
  height: 60px;
  margin: 50px auto 70px auto;
  border: 2px solid white;
  color: black;
  border-radius: 35px;
  padding: 10px 30px;
  background-color: rgb(255,255,255);
`;

function SignUp() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <Background />
      <Header />
      <SignUPDiv>
        <div className='text-center my-[50px]'>
          <Typo title={'SIGN UP'} type={'body5'} />
        </div>
        <div className='ml-[145px]'>

          <Insert
            placeholder='ID'
            value={id}
            autoComplete={"one-time-code"}
            onChange={(e) => { setId(e.target.value) }}
          />
          {/* <div className='mx-[20px] mt-[10px] mb-[20px] '>
            <Typo title={'이미 사용중인 아이디입니다.'} type={'passwordError'} />
          </div> */}

          <Insert
            type={'password'}
            placeholder='PASSWORD'
            value={password}
            autoComplete={"one-time-code"}
            onChange={(e) => { setPassword(e.target.value) }}
          />
          {/* <div className='mx-[20px] mt-[10px] mb-[20px]'>
            <Typo title={'숫자, 영어 포함 8자 이상으로 입력해주세요.'} type={'passwordError'} />
          </div> */}

          <Insert
            type={'password'}
            placeholder='PASSWORD'
            value={password2}
            autoComplete={"one-time-code"}
            onChange={(e) => { setPassword2(e.target.value) }}
          />
          {/* <div className='mx-[20px] mt-[10px] mb-[20px]'>
            <Typo title={'비밀번호를 다시 확인해주세요.'} type={'passwordError'} />
          </div> */}
        </div>
        <SignUpBtn onClick={() => {
          postSignUP(id, password, password2).then(data => {
            navigate('/users')
          })
        }}>
          <Typo title={'SIGN UP'} type={'body2'} />
        </SignUpBtn>
      </SignUPDiv>
    </>
  )
}

export default SignUp