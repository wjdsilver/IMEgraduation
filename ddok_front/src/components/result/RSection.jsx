import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Typo from '@components/Typography'
import Answer from './Answer';
import Sound from './Sound';
import Sight from './Sight';
import Posture from './Posture';
import { getMyAnalyze } from '../../apis/interview';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { myAnalyzeAtom } from '@store/atom';
import DownloadPDF from './DownloadPDF';

const Feedback = styled.div`
    width: 200px;
    font-size: 20px;
    border: 2px solid white;
    padding: 10px;
    text-align: center;
    border-radius: 35px;
    background-color: ${({ isClick }) => { return isClick ? 'white' : 'rgb(255,255,255,0.3)' }};
    color: ${({ isClick }) => { return isClick ? 'black' : 'white' }};
    cursor: pointer;
`;


function RSection() {
    const [pageType, setPageType] = useState('answer');
    const userId = localStorage.getItem("userId")
    const { interviewId } = useParams();
    const [analyze, setAnalyze] = useRecoilState(myAnalyzeAtom);

    const render = () => {
        if(pageType == 'answer'){
            return <Answer/>
        } else if(pageType == 'sound'){
            return <Sound/>
        } else if(pageType == 'sight'){
            return <Sight/>
        } else if(pageType == 'posture'){
            return <Posture/>
        } else if(pageType == 'pdf'){
            return <DownloadPDF/>
        }
    }
    useEffect(()=>{
        getMyAnalyze(userId, interviewId).then((data)=>{
            setAnalyze(data)
        })
    },[])
    
    return (
        <>
            <div className='text-white flex mt-[50px] flex justify-between'>
                <div className='flex gap-[15px]'>

                    <Feedback 
                        onClick={() => {
                            setPageType('answer')
                        }} 
                        isClick={pageType == 'answer'}
                    >
                        <div className='mx-[20px]'>
                            <Typo title={'답변 분석'} type={'body2'} />
                        </div>
                    </Feedback>
                    <Feedback 
                        onClick={() => {
                            setPageType('sound')
                        }} 
                        isClick={pageType == 'sound'}
                    >
                        <div className='mx-[20px]'>
                            <Typo title={'음성 분석'} type={'body2'} />
                        </div>
                    </Feedback>
                    <Feedback 
                        onClick={() => {
                            setPageType('sight')
                        }} 
                        isClick={pageType == 'sight'}
                    >
                        <div className='mx-[20px]'>
                            <Typo title={'시선 분석'} type={'body2'} />
                        </div>
                    </Feedback>
                    <Feedback 
                        onClick={() => {
                            setPageType('posture')
                        }} 
                        isClick={pageType == 'posture'}
                    >
                        <div className='mx-[20px]'>
                            <Typo title={'자세 분석'} type={'body2'} />
                        </div>
                    </Feedback>
                </div>
                <Feedback 
                    onClick={() => {
                        setPageType('pdf')
                    }} 
                    isClick={pageType == 'pdf'}
                >
                    <div className='mx-[20px]'>
                        <Typo title={'최종 결과지'} type={'body2'} />
                    </div>
                </Feedback>
            </div>
            {
                render()
            }
            
        </>
    )
}

export default RSection