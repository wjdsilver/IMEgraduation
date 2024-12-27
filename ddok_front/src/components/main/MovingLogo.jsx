import React from 'react'
import { styled } from 'styled-components';
import DDock from '/images/ddockEng.png';

const Move = styled.button`
animation: moveLeft 15s linear infinite;
@keyframes moveLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
`;
function MovingLogo() {
  return (
    <>
      <div className='mt-[220px]'></div>
      <Move className='h-[130px] flex gap-[40px] pt-[20px]'>
        <img src={DDock} className='w-[60%]'/>
        <img src={DDock} className='w-[60%]'/>
        <img src={DDock} className='w-[60%]'/>
        <img src={DDock} className='w-[60%]'/>
      </Move>
    </>
  )
}

export default MovingLogo