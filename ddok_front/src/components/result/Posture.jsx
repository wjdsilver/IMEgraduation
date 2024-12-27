import React, { useEffect, useState } from 'react'
import SightResult from '/images/posture.png'
import styled from 'styled-components';
import Typo from '@components/Typography';

const RectBorder2 = styled.div`
    width: 270px;
    margin-bottom: 30px;
    padding-left: 5px;
    color: white;
`;
const FeedbackBox = styled.div`
    padding: 60px ;
    border-radius: 40px;
    border: 2px solid white;
    color: white;
    marign-bottom: 30px;
`;


function Posture() {
  return (
    <>
      <img src={SightResult} className='w-[100%] p-[5%]' />
      <FeedbackBox>
        <RectBorder2>
          <Typo title={'자세 분석 평가'} type={'body8'} />
        </RectBorder2>
        <div className='text-[white] text-[25px]'>
          자세가 바르지 못한 편 입니다. 면접 상황에서 바른 자세란, 다리와 팔은 가지런히 모으고 허리와 가슴을 펴고 등받이에 기대지 않고 기대는 것을 말합니다. 면접 상황에서 몸을 심하게 기울이거나 다리를 꼬지 않도록 노력해 보세요.
        </div>
      </FeedbackBox>
    </>
      )
}

      export default Posture