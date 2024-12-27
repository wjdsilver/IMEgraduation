import React from 'react'
import styled from 'styled-components';
import Typo from '@components/Typography'

const CriterionBtn = styled.button`
width: 100%;
height: 45px;
background-color: #e3e3e3;
border-radius: 10px;

`;
function SoundChat({setChatList}) {
    return (
        <div className='w-[1214px] m-auto flex flex-row-reverse'>
            <div className='flex flex-col items-end'>
                <div className='bg-[white] w-fit px-[25px]  py-[15px]  rounded-[25px] my-[15px]'>
                    <Typo title={'똑똑의 음성 분석 평가 기준에 대해 말씀드릴게요!'} type={'small3'} />
                </div>
                <div className='bg-[white] w-fit p-[25px] rounded-[25px] my-[5px] flex gap-[15px] flex-col'>
                    
                    <div>
                        <Typo title={'텍스트 비교 및 유사도 계산'} type={'small2'} />
                        <Typo title={'각각의 텍스트는 문장 단위로 나뉘어 편집 거리를 통해 유사도를 계산합니다. '} type={'small3'} />
                        <Typo title={'편집 거리란 1번 텍스트가 2번 텍스트가 되기 위해 필요한 '} type={'small3'} />
                        <Typo title={'최소 변경(삽입, 삭제, 대체) 횟수를 말합니다.'} type={'small3'} />
                    </div>
                    <div>
                        <Typo title={'속도 및 크기 분석'} type={'small2'} />
                        <Typo title={'피치 분석은 음성의 주파수(frequency), 즉 hz에 해당하며 강도 분석은 '} type={'small3'} />
                        <Typo title={'음성의 데시벨(db)을 의미합니다. 이를 통해 답변의 속도와 크기를 분석합니다. '} type={'small3'} />
                    </div>
                    <div></div>
                    <div>
                        <Typo title={'면접 질문에 대한 답변을 사용자가 말하고자 했던 발음과 가장 가까울 것으로'} type={'small2'} />
                        <Typo title={'가장 원시적인 실제 발음에 기초한 텍스트로 나누어 이를 통해 발음의 정확도를 판별합니다.'} type={'small2'} />
                    </div>
                </div>
                <div className='flex gap-[10px] my-[15px]'>
                    <button className='px-[20px] py-[10px] rounded-[50px] bg-[#15CDCA] text-[white]' onClick={() => setChatList(org => [...org, 'computer'])}> 평가 기준 더보기</button>
                </div>
            </div>
        </div>
    )
}

export default SoundChat