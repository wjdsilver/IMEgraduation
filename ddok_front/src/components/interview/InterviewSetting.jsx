import React, { useState } from 'react'
import Header from '@components/Header';
import styled from 'styled-components';
import Typo from '@components/Typography'
import InterviewQuit from './InterviewQuit';
import InterviewCaution from './InterviewCaution';
import { useRecoilState } from 'recoil';
import { myJobAtom } from '@store/atom';
import { Canvas } from '@react-three/fiber'
import DDock3D from '@components/DDock3D';
import MainBg2 from '/images/InterviewBg.png'

const Background = styled.div`
position: fixed;
width: 100%;
height: 100vh;     
background-image: linear-gradient(#000,#002A84);
background-repeat : no-repeat;
background-size : cover;
z-index: -2;
`;

const Insert = styled.input`
  width: 362px;
  padding: 20px;
  font-size: 24px;
  height: 60px;
  border-bottom: 2px solid white;
  background-color: rgb(255,255,255,0.3);
  color: white;
  &::placeholder{
    color:rgb(255,255,255,0.3);
    font-size: 20px;
  }
`;

const AbilityBtn = styled.button`
  width: [20%];
  text-align: center;
  height: 60px;
  margin: 50px 0;
  border: 2px solid white;
  color: white;
  border-radius: 35px;
  padding: 10px 30px;
  &:hover{
    background-color: rgb(255,255,255,0.3);
  }
`;

const NextBtn = styled.button`
  text-align: center;
  height: 60px;
  border: 2px solid white;
  color: black;
  border-radius: 35px;
  padding: 5px 30px;
  background-color: rgb(255,255,255);
  margin: 50px auto; 
`;

const CheckAlign = styled.div`
  width: 1214px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Char3D = styled.div`
position: absolute;
top: 0;
z-index: -1;
`;

const BackgroundImage = styled.div`
position: absolute;
z-index: -1;
`;
function InterviewSetting() {
    const [openModal, setOpenModal] = useState(false);
    const [myJob, setMyJob] = useRecoilState(myJobAtom);
    return (
        <>
            <Background />
            <Header />
            <Char3D className='w-[100%] h-[100vh]'>
                <Canvas>
                    <DDock3D />
                </Canvas>
            </Char3D>
            <BackgroundImage >
                <img src={MainBg2} className='w-[100vw]' />
            </BackgroundImage>
            <div className='my-[100px] w-[1214px] m-[auto] relative'>
                <div className='flex justify-between'>
                    <div className='text-white flex flex-col gap-[10px]'>
                        <Typo title={'희망 분야를 입력해주세요'} type={'body2'} />
                        <Insert
                            value={myJob.myPart}
                            onChange={(e) => { setMyJob({ ...myJob, myPart: e.target.value }) }}
                            placeholder='예시) IT' />
                    </div>
                    <div className='text-white flex flex-col gap-[10px]'>
                        <Typo title={'지원 직무를 입력해주세요'} type={'body2'} />
                        <Insert
                            value={myJob.myJob}
                            onChange={(e) => { setMyJob({ ...myJob, myJob: e.target.value }) }}
                            placeholder='예시) 프론트엔드 개발자' />
                    </div>
                </div>

                <div className='mt-[314px]'>
                </div>
                <div className='mt-[190px] justify-between flex'>
                    <AbilityBtn>
                        <Typo title={'문제 해결 능력'} type={'body2'} />
                    </AbilityBtn>
                    <AbilityBtn>
                        <Typo title={'의사소통 능력'} type={'body2'} />
                    </AbilityBtn>
                    <AbilityBtn>
                        <Typo title={'성장 가능성 및 개인 발전 의지'} type={'body2'} />
                    </AbilityBtn>
                    <AbilityBtn>
                        <Typo title={'인성'} type={'body2'} />
                    </AbilityBtn>
                </div>
                <CheckAlign>
                    <label className='text-[white] text-[24px] m-[auto]'>
                        <input
                            className='m-[20px] w-[18px] h-[18px]'
                            type="checkbox"
                        // disabled={disabled}
                        // checked={checked}
                        // onChange={({ target: { checked } }) => onChange(checked)}
                        />면접 시간 중 녹화된 영상 제공을 희망하십니까?
                    </label>
                    <div>
                        <NextBtn onClick={() => {
                            setOpenModal(true)
                        }}>
                            <Typo title={'다음'} type={'body2'} />
                        </NextBtn>
                    </div>
                </CheckAlign>
            </div>
            {
                openModal && <InterviewCaution onCloseClick={() => { setOpenModal(false) }} />
            }
            {/* <InterviewQuit /> */}

        </>
    )
}

export default InterviewSetting