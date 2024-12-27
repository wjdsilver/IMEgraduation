import React from 'react'
import styled from 'styled-components';
import Typo from '@components/Typography'
import Logo from '/images/Logo.png'
import Card3  from '/images/cImg.png'

const CriterionBtn = styled.button`
width: 100%;
height: 45px;
background-color: #e3e3e3;
border-radius: 10px;
&:hover{
  background-color: gray;
  color: white;
}
`;

const BgBox = styled.button`
background: linear-gradient(90deg, #4A92FF 0%, #88FFC6 35%, #CEFF8F 100%);
width: 450px;
`;

function ComputerChat({setChatList}) {
  return (
    <div className='w-[1214px] m-auto flex'>
      <div>
      <img className='item-end mr-[20px]' src={Logo} />
      </div>
      <div className=' w-[450px]'>
        <div className='text-[white] mb-[10px]'><Typo title={'똑똑'} type={'body8'} /></div>
        <BgBox className='rounded-t-[25px]  p-[20px] flex justify-between'>
          <div>
            <Typo title={'똑부러지는 취업,'} type={'body7'} />
            <Typo title={'똑바른 자세부터!'} type={'body7'} />
          </div>
          <div className='w-[20%]'>

          <img className='item-end object-cover' src={Card3} />
          </div>
        </BgBox>
        <div className='flex flex-col rounded-b-[25px] bg-[white] gap-[10px] p-[20px]'>
          <Typo title={'궁금하신 평가 기준을 선택해주세요.'} type={'small3'} />
          <CriterionBtn onClick={() =>  setChatList(org => [...org, 'answer'])}>답변 내용 분석 평가 기준</CriterionBtn>
          <CriterionBtn onClick={() =>  setChatList(org => [...org, 'sound'])}>음성 분석 평가 기준</CriterionBtn>
          <CriterionBtn onClick={() =>  setChatList(org => [...org, 'sight'])}>시선 분석 평가 기준</CriterionBtn>
          <CriterionBtn>자세 분석 평가 기준</CriterionBtn>
        </div>
      </div>

      
    </div>
  )
}

export default ComputerChat