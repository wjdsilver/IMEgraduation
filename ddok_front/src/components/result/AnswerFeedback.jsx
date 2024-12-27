import React from 'react'
import styled from 'styled-components';
import Typo from '@components/Typography'
import { useRecoilState } from 'recoil';
import { myAnalyzeAtom } from '@store/atom';

const RectBorder2 = styled.div`
    margin-bottom: 30px;
    padding-left: 10px;
    background-color: white;
    color: black;
    text-align: center;
`;

const FeedbackBox = styled.div`
    padding: 60px ;
    border-radius: 40px;
    border: 2px solid white;
    color: white;
    margin-top: 50px;
`;

const FeedbackDetailBoxs = styled.div`
    font-size: 22px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    `;

const FeedbackDetailBox = styled.div`
    box-shadow: 0 0 10px white;
    border-radius: 10px;
    padding: 30px;
    white-space: pre-wrap;
`;

function AnswerFeedback() {
    const [analyze, setAnalyze] = useRecoilState(myAnalyzeAtom);
    return (
        <>
            <FeedbackBox>
                <RectBorder2>
                    <Typo title={'답변 내용 총평'} type={'body8'} />
                </RectBorder2>
                <div className='text-[24px] font-light'>
                {analyze.overall_feedback}
                </div>
            </FeedbackBox>
        </>
    )
}

export default AnswerFeedback