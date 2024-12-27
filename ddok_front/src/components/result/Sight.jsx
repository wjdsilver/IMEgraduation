import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { postEyeTrackingStop } from '../../apis/interview';
import SightResult from '/images/sightResultt.png'
import styled from 'styled-components';
import Typo from '@components/Typography';

const RectBorder2 = styled.div`
    width: 270px;
    margin-bottom: 30px;
    padding-left: 5px;
    color: white;
`;
const FeedbackBox = styled.div`
    padding: 60px ;
    border-radius: 40px;
    border: 2px solid white;
    color: white;
`;
function Sight() {
  const { interviewId } = useParams();
  const userId = localStorage.getItem('userId');
  const [sightLog, setSightLog] = useState({
    "message": "",
    "image_data": "",
    "video_url": "",
    "feedback": "",
    "status": ""
  });

  useEffect(() => {
    postEyeTrackingStop(userId, interviewId).then(data => setSightLog(data));
  }, []);

  return (
    <>
      {<img src={SightResult} className='w-[100%] p-[5%]' />}
      
      {/* {sightLog.image_url && (
      <img 
        src={`/eyeresult${sightLog.image_url}`} 
        alt="Gaze Heatmap" 
        className='w-[100%] p-[5%]' 
      />
    )} */}

      <FeedbackBox>
        <RectBorder2>
          <Typo title={'시선 분석 총평'} type={'body8'} />
        </RectBorder2>
        <div className='text-[white] text-[25px]'>
        면접관을 잘 응시하고 있습니다. 면접에서는 면접관을 응시하면서 은은한 미소를 띄는것이 중요합니다.
          {/* {sightLog.feedback} */}
        </div>
      </FeedbackBox>
    </>
  )
}

export default Sight