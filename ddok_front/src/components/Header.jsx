import React, { useEffect, useState } from 'react'
import Typo from '@components/Typography'
import { styled } from 'styled-components';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { postLogOut } from '../apis/login';
import Logo from '/images/main_logo 1.png'

const LoginBtn = styled.button`
  border: 2px solid white;
  color: white;
  border-radius: 15px;
  padding: 2px 15px;
  &:hover{
    background-color: rgb(255,255,255,0.3);
  }
`;
const Container = styled.div`
  position: relative;
  height: 3.125rem;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .inactive {
    opacity: 0.7;
  }
  .active {
    opacity: 1;
  }
`;
function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
 
  useEffect(()=>{
    if (localStorage.getItem("Authorization")) {
      setIsLogin(true)
    } else {
      setIsLogin(false)
    }
  },[])
  return (
    <>
      <Container className='flex fixed flex-row justify-between text-white text-[25px] px-[20px]'>

        <NavLink
          to={`/`}
          className={({ isActive }) =>
            isActive || location.pathname === `/`
          }
        >
          <div> <img src={Logo} className='w-[75px]'/></div>
        </NavLink>
        <ul className='flex flex-row gap-[30px]'>
          <NavLink
            to={`/interview`}
            className={({ isActive }) =>
              isActive || location.pathname === `/interview` || location.pathname === `/` ? 'active' : 'inactive'
            }
          >
            <li><Typo title={'면접 연습'} type={'heading1'} /></li>
          </NavLink>

          <NavLink
            to={`/criterion`}
            className={({ isActive }) =>
              isActive || location.pathname === `/criterion` || location.pathname === `/` ? 'active' : 'inactive'
            }
          >
            <li><Typo title={'평가 기준'} type={'heading1'} /></li>
          </NavLink>

          <NavLink
            to={`/list`}
            className={({ isActive }) =>
              isActive || location.pathname === `/list` || location.pathname === `/` ? 'active' : 'inactive'
            }
          >
            <li><Typo title={'면접 기록'} type={'heading1'} /></li>
          </NavLink>

          <NavLink
            to={`/about`}
            className={({ isActive }) =>
              isActive || location.pathname === `/about` || location.pathname === `/` ? 'active' : 'inactive'
            }
          >
            <li><Typo title={'팀원 소개'} type={'heading1'} /></li>
          </NavLink>
        </ul>
        {
          isLogin
            ?
            <LoginBtn onClick={() => { postLogOut().then(()=>{
              localStorage.removeItem("Authorization")
              setIsLogin(false)
            }) }}>
              <Typo title={'로그아웃'} type={'heading1'} />
            </LoginBtn>
            :
            <LoginBtn onClick={() => navigate('/users')}>
              <Typo title={'로그인'} type={'heading1'} />
            </LoginBtn>

        }
      </Container>
    </>
  )
}

export default Header