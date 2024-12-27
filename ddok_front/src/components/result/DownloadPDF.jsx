import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Typo from '@components/Typography'
import { useRecoilState } from 'recoil';
import { myAnalyzeAtom } from '@store/atom';
import AnswerContent from './AnswerContent';
import html2pdf from 'html2pdf.js';
import { useParams } from 'react-router-dom';
import { getMySoundLog } from '../../apis/interview';
import { postEyeTrackingStop } from '../../apis/interview';
import { getMyAnalyze } from '../../apis/interview';
import SoundResult from '/images/soundResultt.png';
import SightResult from '/images/sightResultt.png';

const PdfBtn = styled.div`
    width: 250px;
    font-size: 20px;
    font-weight: 700;
    border: 2px solid white;
    padding: 5px;
    text-align: center;
    border-radius: 35px;
    background-color: #fff;
    cursor: pointer;
    margin: 50px auto;
`;

const DivFlex = styled.div`
    display: flex;
`;

const RectBorder2 = styled.div`
    width: 270px;
    margin-bottom: 30px;
`;

function DownloadPDF() {
    const [analyze, setAnalyze] = useRecoilState(myAnalyzeAtom);
    const { interviewId } = useParams();
    const userId = localStorage.getItem('userId');
    const myJobQuestionAtom = localStorage.getItem('myJobQuestionAtom');
    const [soundLog, setSoundLog] = useState('');
    const [analyzeLog, setAnalyzeLog] = useState('');
    const [sightLog, setSightLog] = useState({
        "message": "",
        "image_data": "",
        "video_url": "",
        "feedback": "",
        "status": ""
    });


    const downloadPDF = () => {
        const element = document.getElementById("pdf-download"); // PDF로 변환할 요소 선택
        // element.style.transform = "scale(0.65)";
        element.style.transformOrigin = "top left";
        html2pdf(element, {
            filename: "file.pdf", // default : file.pdf
            html2canvas: { scale: 2, useCORS: true }, // 캡처한 이미지의 크기를 조절, 값이 클수록 더 선명하다.
            image: { type: 'jpeg', quality: 0.50 },
            jsPDF: {
                format: "a4",  // 종이 크기 형식
                orientation: "portrait", // or landscape : 가로
            },
            callback: () => {
                console.log("PDF 다운로드 완료");
            },
        });
    };


    useEffect(() => {
        getMySoundLog(userId, interviewId).then(data => setSoundLog(data));
        getMyAnalyze(userId, interviewId).then(data => setAnalyzeLog(data));
        postEyeTrackingStop(userId, interviewId).then(data => setSightLog(data));
    }, []);

    useEffect(() => {
        console.log(analyzeLog);
    }, [analyzeLog]);
    return (
        <>
            <div className='h-[40px] bg-[white] mt-[50px]'></div>
            <div id="pdf-download" className=' bg-[white] '>
                <div className='pl-[40px] '>
                    <Typo title={'[ 내 답변 분석 ]'} type={'body8'} />
                </div>
                {analyzeLog && analyzeLog.responses.map((item, i) => {
                    if (item.response) {
                        return (
                            <>
                                <div key={i} className='text-[18px] mt-[30px] mb-[30px] px-[40px]'>
                                    <Typo title={`${i + 1}번째 질문`} type={'small2'} />
                                    <p className='mt-[10px]'>{item.response}</p>
                                </div>
                            </>
                        )
                    }
                })}
                <div className='pl-[40px] pt-[30px]'>
                    <Typo title={'[ 내 음성 분석 ]'} type={'body8'} />
                </div>
                <DivFlex>
                    {soundLog.intensity_graph && (
                        <img
                            src={`${soundLog.intensity_graph}`}
                            className='w-[48%] py-[5%]'
                        />
                    )}
                    {soundLog.pitch_graph && (
                        <img
                            src={`${soundLog.pitch_graph}`}
                            className='w-[48%] py-[5%]'
                        />
                    )}
                </DivFlex>
                <DivFlex>

                    <div className='px-[40px]'>
                        <RectBorder2>
                            <Typo title={'강도 분석 평가'} type={'small2'} />
                        </RectBorder2>
                        <div className='text-[15px] mb-[60px]'>
                            {soundLog.intensity_summary}
                        </div>
                    </div>
                    <div className='pr-[40px]'>
                        <RectBorder2>
                            <Typo title={'피치 분석 평가'} type={'small2'} />
                        </RectBorder2>
                        <div className='text-[15px]'>
                            {soundLog.pitch_summary}
                        </div>
                    </div>
                </DivFlex>


                <div className='pl-[40px] py-[30px]'>
                    <Typo title={'[ 내 시선 분석 ]'} type={'body8'} />
                </div>
                <DivFlex>
                    {/* {<img src={SightResult} className='w-[100%] p-[5%]' />} */}
                    {sightLog.image_url && (
                        <img
                            src={`/eyeresult${sightLog.image_url}`}
                            alt="Gaze Heatmap"
                            className='w-[100%] p-[5%]'
                        />
                    )}
                    <div className='px-[40px] py-[20px]'>
                        <RectBorder2>
                            <Typo title={'시선 분석 평가'} type={'small2'} />
                        </RectBorder2>
                        <div className='text-[15px] mb-[60px]'>
                            {/* 면접관을 잘 응시하고 있습니다. 면접에서는 면접관을 응시하면서 은은한 미소를 띄는것이 중요합니다. */}
                            {sightLog.feedback}
                        </div>

                    </div>
                </DivFlex>

            </div>
            <div className='h-[40px] bg-[white]'></div>
            <PdfBtn onClick={downloadPDF}>결과지 다운로드</PdfBtn>
        </>
    )
}

export default DownloadPDF