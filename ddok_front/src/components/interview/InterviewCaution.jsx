import React from 'react'
import styled from 'styled-components';
import Typo from '@components/Typography'
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { myJobQuestionAtom, myJobQuestionIdAtom, myJobAtom } from '@store/atom';
import { postMyJob } from '@apis/interview';

const QuitBox = styled.div`
  width: 714px;
  font-size: 40px;
  margin: 15% auto;
  border: 2px solid white;
  color: white;
  border-radius: 52px;
  background-color: rgb(255,255,255,0.1);
  padding: 10px;
  position: fixed;
  top: 50%; left: 50%;
  transform: translateX(-50%) translateY(-100%);
  backdrop-filter: blur(6px);
`;
const QuitBtn = styled.div`
  text-align: center;
  width: 200px;
  height: 60px;
  margin: 30px auto 10px auto;
  border: 2px solid white;
  color: white;
  border-radius: 35px;
  padding: 10px;
  background-color: rgb(255,255,255,0.2);
  cursor: pointer;
`;
function InterviewCaution({ onCloseClick }) {
    const [myJobQuestion, setMyJobQuestion] = useRecoilState(myJobQuestionAtom);
    const [myJobQuestionId, setMyJobQuestionId] = useRecoilState(myJobQuestionIdAtom);
    
    const [myJob, setMyJob] = useRecoilState(myJobAtom);
    const navigate = useNavigate();
    return (
        <>
            <QuitBox >
                <div
                    onClick={onCloseClick}
                    className='text-right pr-[25px]'>×</div>
                <div className='text-center pt-[40px] pb-[60px]'>
                    <Typo title={'정확한 분석을 위해 이어폰 착용을 권고드립니다.'} type={'body7'} />
                    <Typo title={''} type={'body7'} />
                    <Typo title={'준비가 되셨다면 확인 버튼을 눌러주세요.'} type={'body7'} />
                    <QuitBtn onClick={() =>
                        postMyJob(myJob.myPart, myJob.myJob).then(data => {
                            setMyJobQuestion(data.questions)
                            setMyJobQuestionId(data.id)
                            navigate('/interview/start')
                        })
                    }>
                        <Typo title={'확인'} type={'body2'} />
                    </QuitBtn>
                </div>
            </QuitBox>
        </>
    )
}

export default InterviewCaution