import React from 'react'
import Header from '@components/Header';
import styled from 'styled-components';
import Typo from '@components/Typography'


const QuitBox = styled.div`
  width: 714px;
  font-size: 40px;
  margin: 15% auto;
  border: 2px solid white;
  color: white;
  border-radius: 52px;
  padding: 10px 30px;
  background-color: rgb(255,255,255,0.1);
  position: absolute;
  top: 50%; left: 50%;
  transform: translateX(-50%) translateY(-90%);
  backdrop-filter: blur(6px);
`;

const QuitBtn = styled.div`
  text-align: center;
  width: 200px;
  height: 60px;
  margin: 50px auto;
  border: 2px solid white;
  color: white;
  border-radius: 35px;
  padding: 10px;
  background-color: rgb(255,255,255,0.2);
`;

function InterviewQuit() {
    return (
        <>

            <QuitBox>
                <div className='text-right pr-[5px]'>×</div>
                <div className='text-center mt-[20px]'>
                    <Typo title={'면접을 종료하시겠습니까?'} type={'body7'} />
                </div>
                <div className='text-center '>
                    <Typo title={'종료하시면 면접 내용은 저장되지 않습니다.'} type={'body7'} />
                </div>
                <div className='flex justify-center gap-[20px]'>
                    
                    <div>
                        <QuitBtn>
                            
                            <Typo title={'종료'} type={'body2'} />
                        </QuitBtn>
                    </div>
                </div>
            </QuitBox>
        </>
    )
}

export default InterviewQuit