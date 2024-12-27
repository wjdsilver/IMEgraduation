import { FFmpeg } from '@ffmpeg/ffmpeg';
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import { useEffect, useRef, useCallback } from 'react';
import { getSignedUrl, postMyAnswerVideo, postEyeTrackingStart, putInterviewVideo } from '../apis/interview';

const useVideoRecord = () => {
  const videoRef = useRef(null);
  const mediaRecorder = useRef(null);
  const canvas = useRef(null);
  const videoChunks = useRef([]);

  const getMediaPermission = useCallback(async () => {
    try {
      const audioConstraints = { audio: true };
      const videoConstraints = {
        audio: false,
        video: true,
      };

      // const audioStream = await navigator.mediaDevices.getUserMedia(
      //     audioConstraints
      // );
      const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
      );

      if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
      }
      

      // MediaRecorder 추가
      const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
        // ...audioStream.getAudioTracks(),
      ]);

      const recorder = new MediaRecorder(combinedStream, {
          mimeType: 'video/webm',
      });

      recorder.ondataavailable = (e) => {
          if (typeof e.data === 'undefined') return;
        if (e.data.size === 0) return;
        videoChunks.current.push(e.data);
      };

      mediaRecorder.current = recorder;
    } catch (err) {
      console.log(err);
    }
  }, []);

const convertBlobToMp4 = async (webmBlob) => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({ coreURL, wasmURL });

  const arrayBuffer = await webmBlob.arrayBuffer();
  
  // ArrayBuffer를 Uint8Array로 변환하여 FFmpeg에 전달
  const uint8Array = new Uint8Array(arrayBuffer);

  const fileName = 'input.webm';
  // Unit8Array를 fileName인 파일로 만듬
  await ffmpeg.writeFile(fileName, uint8Array);

  // WebM 파일을 MP4로 변환
  await ffmpeg.exec(['-i', fileName, 'output.mp4']);

  // 변환된 MP4 파일 읽기
  const mp4Data = await ffmpeg.readFile('output.mp4');

  // MP4 파일을 Blob으로 변환
  const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
  
  // 변환된 파일을 다운로드할 수 있게 링크 생성
  const mp4Url = URL.createObjectURL(mp4Blob);
  const a = document.createElement('a');
  a.href = mp4Url;
  a.download = 'output.mp4';
  a.click();

  return mp4Blob;
};

// 파일 변환을 실행하는 코드
// 예: input에서 사용자가 업로드한 webm 파일을 받아서 실행
const handleFileUpload = (event) => {
  const webmFile = event.target.files[0];
  convertWebmToMp4(webmFile);
};


  const startRecording = () => {
      mediaRecorder.current?.start();
  }

  const stopRecording = () => {
      mediaRecorder.current?.stop();
  }

  useEffect(() => {
    getMediaPermission();
  }, []);

  const onSubmitApiCall = async (userId, interviewId, videoBlob) => {
    const data = await getSignedUrl(userId, interviewId, `${interviewId}.webm`, 'video/webm')
    const { signed_url } = data;
    await putInterviewVideo(signed_url, videoBlob);
    await postEyeTrackingStart(userId, interviewId);
  }

  const onSubmitVideo = (questionId, interviewId, userId) => {
    const videoBlob = new Blob(videoChunks.current, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(videoBlob);
    const videoFile = new File([videoUrl], 'input.webm');
    convertBlobToMp4(videoBlob).then(mp4Blob => {
      let formData = new FormData();
      formData.append('file', mp4Blob);
      formData.append('user_id', userId);
      formData.append('question_id', questionId);
      formData.append('interviewId', interviewId);
  
      postMyAnswerVideo(formData, userId, interviewId);
    });
    
    // getSignedUrl(userId, interviewId, `${interviewId}.webm`, 'video/webm')
    // .then(data => {
    //   console.log(data)
    //   const { signed_url } = data;
    //   putInterviewVideo(signed_url, videoBlob);
    //   // putInterviewVideo(signed_url, videoFile);
    // });

    // onSubmitApiCall(userId, interviewId, videoBlob)
    
    // const link = document.createElement('a');
    // link.download = `My video - .webm`;
    // link.href = videoUrl;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return { videoRef, startRecording, stopRecording, onSubmitVideo }
}

export default useVideoRecord