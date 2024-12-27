import React, {useRef} from 'react';
import VideoSpeaking from '@assets/videos/2_2.mp4';
import VideoIdle from '@assets/videos/1_1.mp4';
import VideoNodding from '@assets/videos/4.mp4';
import VideoCalibration from '@assets/videos/calv.mp4';


const InterviewVideo = ({videoStatus, isDisplay}) => {
  const videoRef = useRef();

  const setPlayBackRate = () => {
    videoRef.current.playbackRate = 1;
  };
  
  const renderVideoSource = () => {
    if (videoStatus === 'Idle') {
      return <source src={VideoIdle} type="video/mp4" />
    }

    if (videoStatus === 'Nodding') {
      return <source src={VideoNodding} type="video/mp4" />
    }

    if (videoStatus === 'Speaking') {
      return <source src={VideoSpeaking} type="video/mp4" />
    }

    if (videoStatus === 'Calibration') {
      return <source src={VideoCalibration} type="video/mp4" />
    }
  }
  
  return (

    <video
      muted
      autoPlay
      loop
      ref={videoRef}
      onCanPlay={() => setPlayBackRate()}
      className={'w-[100vw] display-[none]'}
      hidden={!isDisplay}
    >
      {/* <source src={videoSrc} type="video/mp4" /> */}
      {renderVideoSource()}
    </video>
  )
}

export default InterviewVideo;