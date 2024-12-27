import React from 'react'
import styled from 'styled-components';
import Typo from '@components/Typography'
import Logo from '/images/Logo.png'

function AnswerChat({setChatList}) {
    return (
        <>
            <div className='w-[1214px] m-auto flex flex-row-reverse'>
                <div className='flex flex-col items-end'>
                    <div className='bg-[white] w-fit px-[25px]  py-[15px]  rounded-[25px] my-[15px]'>
                        <Typo title={'똑똑의 답변 내용 분석 평가 기준에 대해 말씀드릴게요!'} type={'small3'} />
                    </div>
                    <div className='bg-[white] w-fit p-[25px] rounded-[25px] my-[5px] flex gap-[15px] flex-col'>
                        <div>
                            <Typo title={'언어적 적합성'} type={'small2'} />
                            <Typo title={'답변 내용 내 부적적한 용어의 포함 여부를 검사하고, '} type={'small3'} />
                            <Typo title={'적절한 대체어를 제안합니다. '} type={'small3'} />
                        </div>
                        <div>
                            <Typo title={'간결성'} type={'small2'} />
                            <Typo title={'답변 내용 내 음성적 잉여 표현의 불필요한 반복을 식별합니다.'} type={'small3'} />
                        </div>
                        <div>
                            <Typo title={'적절성'} type={'small2'} />
                            <Typo title={'각 답변 애용을 질문과 비교하여, '} type={'small3'} />
                            <Typo title={'주어진 질문에 적절하게 대응하고 있는지 검토합니다. '} type={'small3'} />
                        </div>
                        <div></div>
                        <div>
                            <Typo title={'전문가의 관점으로 전체적인 답변 내용이 질문 의도에 적함한 지 검토합니다.'} type={'small2'} />
                        </div>
                    </div>
                    <div className='flex gap-[10px] my-[15px]'>
                        <button className='px-[20px] py-[10px] rounded-[50px] bg-[#15CDCA] text-[white]' onClick={() => setChatList(org => [...org, 'computer'])}>평가 기준 더보기</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AnswerChat