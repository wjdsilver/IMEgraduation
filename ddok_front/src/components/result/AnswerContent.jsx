import React from 'react'
import styled from 'styled-components';
import Typo from '@components/Typography'
import { useRecoilState } from 'recoil';
import { myAnalyzeAtom } from '@store/atom';
import reactStringReplace from 'react-string-replace';

const RectBorder = styled.div`
    border: 2px solid black;
    margin: 20px 0;
    width: 150px;
    padding-left: 5px;
`;

const RedSpan = styled.span`
    color: #FF5A5A;
`;

const BlueSpan = styled.span`
    color: #5A8EFF;
`;

const RectBorder2 = styled.div`
margin-bottom: 30px;
padding-left: 10px;
background-color: white;
color: black;
text-align: center;
`;
const FeedbackDetailBoxs = styled.div`
    font-size: 22px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    `;
const FeedbackBox = styled.div`
    padding: 60px ;
    border-radius: 40px;
    border: 2px solid white;
    color: white;
    margin-top: 50px;
`;
const FeedbackDetailBox = styled.div`
    box-shadow: 0 0 10px white;
    border-radius: 10px;
    padding: 30px;
    white-space: pre-wrap;
`;

function AnswerContent({ answerIndex }) {
    const [analyze, setAnalyze] = useRecoilState(myAnalyzeAtom);

    const renderAnswer = () => {
        const answer = analyze.responses[answerIndex] ? analyze.responses[answerIndex].response : ''
        const inappropriate = analyze.responses[answerIndex] ? analyze.responses[answerIndex].inappropriateness.split(',').map(item => ({ type: 'inappropriate', value: item })) : [];
        const redundancies = analyze.responses[answerIndex] ? analyze.responses[answerIndex].redundancies.split(',').map(item => ({ type: 'redundancies', value: item })) : [];
        const merged = inappropriate.concat(redundancies);

        let replacedAnswer = answer;
        merged.map(item => {
            replacedAnswer = reactStringReplace(replacedAnswer, item.value, (match, i) => item.type == 'inappropriate' ? (
                <RedSpan>{match}</RedSpan>)
                : (<BlueSpan>{match}</BlueSpan>))
        })

        return replacedAnswer
    }
    return (
        <di className='mt-[30px]'>
            <div className='w-[1214px] px-[90px] py-[50px] bg-white rounded-[40px] mt-[20px]'>
                <div className='flex items-center gap-[5%]'>
                    <Typo title={`Q. ${answerIndex + 1}번 질문 내용`} type={'body7'} />
                    <div className='text-[#FF5A5A] text-[20px]'>● 지양해야 할 표현</div>
                    <div className='text-[#5A8EFF] text-[20px]'>● 음성적 잉여 표현</div>
                </div>
                <RectBorder>
                    <Typo title={'답변 내용'} type={'body8'} />
                </RectBorder>
                <div className='text-[24px] font-light text-left'>
                    {renderAnswer()}
                </div>
            </div>
            { 
              analyze.responses[answerIndex].corrections != '{}' 
              && 
              <FeedbackBox>
                <RectBorder2>
                    <Typo title={'이런 표현은 어때요?'} type={'body8'} />
                </RectBorder2>

                <FeedbackDetailBoxs>
                    {analyze.responses[answerIndex] && analyze.responses[answerIndex].corrections.slice(1, -1).split(',').map((item) => {
                        return (
                            <FeedbackDetailBox>
                                {item.replace(':', '\n⇒')}
                            </FeedbackDetailBox>
                        )
                    })}
                </FeedbackDetailBoxs>
                </FeedbackBox>
            }
            
        </di>
    )
}

export default AnswerContent