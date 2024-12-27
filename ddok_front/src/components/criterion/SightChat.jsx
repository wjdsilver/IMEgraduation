import React from 'react'
import styled from 'styled-components';
import Typo from '@components/Typography'

const CriterionBtn = styled.button`
width: 100%;
height: 45px;
background-color: #e3e3e3;
border-radius: 10px;

`;

function SightChat({setChatList}) {
  return (
    <div className='w-[1214px] m-auto flex flex-row-reverse'>
    <div className='flex flex-col items-end'>
        <div className='bg-[white] w-fit px-[25px]  py-[15px]  rounded-[25px] my-[15px]'>
            <Typo title={'똑똑의 시선 평가 기준에 대해 말씀드릴게요!'} type={'small3'} />
        </div>
        <div className='bg-[white] w-fit p-[25px] rounded-[25px] my-[5px] flex gap-[15px] flex-col'>
            
            <div>
                <Typo title={'화면 응시 빈도 분석'} type={'small2'} />
                <Typo title={'면접 화면을 6분할 하여 각 구역을 얼마나 응시하였는지, '} type={'small3'} />
                <Typo title={'빈도에 따라 많이 응시한 곳 부터 적게 응시한 곳 까지 나타냅니다. '} type={'small3'} />
            </div>
            <div>
                <Typo title={'이를 통해 면접 중 META HUMAN 가상 면접관을 '} type={'small2'} />
                <Typo title={'얼마나 잘 응시하였는지를 알 수 있습니다.'} type={'small2'} />
            </div>
        </div>
        <div className='flex gap-[10px] my-[15px]'>
            <button className='px-[20px] py-[10px] rounded-[50px] bg-[#15CDCA] text-[white]' onClick={() => setChatList(org => [...org, 'computer'])}>평가 기준 더보기</button>
        </div>
    </div>
</div>
  )
}

export default SightChat