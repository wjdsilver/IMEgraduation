import React, { useEffect, useState } from 'react';
import RandomQ from './RandomQ';
import { useRecoilState } from 'recoil';
import { myJobQuestionAtom, myJobQuestionIdAtom } from '@store/atom';
import InterviewVideo from './InterviewVideo';

function InterviewPage() {

  const [myJobQuestion, setMyJobQuestion] = useRecoilState(myJobQuestionAtom);
  const [myJobQuestionId, setMyJobQuestionId] = useRecoilState(myJobQuestionIdAtom);
  const [videoStatus, setVideoStatus] = useState('Idle');

  const onQuestionReaction = (isSpeaking, isRecorded, isCalibration) => {
    if (isCalibration) {
      setVideoStatus('Calibration');
    } else if (isSpeaking) {
      setVideoStatus('Speaking');
    } else if (!isSpeaking && !isRecorded) {
      setVideoStatus('Idle');
    } else if (!isSpeaking && isRecorded) {
      setVideoStatus('Nodding');
    }
  };

  useEffect(() => {
    console.log('videoStatus:', videoStatus);
  }, [videoStatus]);

  return (
    <>
      <div className='w-[100%] relative'>
        <InterviewVideo videoStatus={'Speaking'} isDisplay={videoStatus === 'Speaking'} />
        <InterviewVideo videoStatus={'Idle'} isDisplay={videoStatus === 'Idle'} />
        <InterviewVideo videoStatus={'Nodding'} isDisplay={videoStatus === 'Nodding'} />
        <InterviewVideo videoStatus={'Calibration'} isDisplay={videoStatus === 'Calibration'} />

        {myJobQuestion && <RandomQ myJobQuestion={myJobQuestion} myJobQuestionId={myJobQuestionId} onQuestionReaction={onQuestionReaction} />}

        {/* videoStatus가 'Calibration'이 아닐 때만 RandomQ 렌더링
        {videoStatus !== 'Calibration' && myJobQuestion && (
          <RandomQ
            myJobQuestion={myJobQuestion}
            myJobQuestionId={myJobQuestionId}
            onQuestionReaction={onQuestionReaction}
          />
        )} */}
      </div>
    </>
  );
}

export default InterviewPage;
