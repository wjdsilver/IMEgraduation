import React, { useEffect, useState, useCallback } from 'react'
import { postMyAnswer } from '@apis/interview'
import { postMyAnswerVoice } from '../apis/interview';
import MicRecorder from 'mic-recorder-to-mp3';

const useRecord = () => {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const chunks = []; // 오디오 청크 데이터를 저장할 배열
  const userId = localStorage.getItem("userId")
  const [recorder, setRecorder] = useState(new MicRecorder({
    bitRate: 128,
  }));

  function handleClickNext() {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;

      return newIndex;
    });
  }

  const onRecAudio = () => {
    // // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
    // const audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate:44100});

    // // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
    // const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    // setAnalyser(analyser);

    // function makeSound(stream) {
    //   // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
    //   const source = audioCtx.createMediaStreamSource(stream);
    //   setSource(source);

    //   // AudioBufferSourceNode 연결
    //   source.connect(analyser);
    //   analyser.connect(audioCtx.destination);
    // }

    // // 마이크 사용 권한 획득 후 녹음 시작
    // navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    //   const mediaRecorder = new MediaRecorder(stream);


    //   // dataavailable 이벤트 핸들러 등록
    //   mediaRecorder.addEventListener('dataavailable', (e) => {
    //     chunks.push(e.data); // 청크 데이터를 배열에 추가
    //   });

    //   mediaRecorder.start();
    //   setStream(stream);
    //   setMedia(mediaRecorder);
    //   makeSound(stream);
    //   // 음성 녹음이 시작됐을 때 onRec state값을 false로 변경
    //   analyser.onaudioprocess = function (e) {
    //     setOnRec(false);
    //   };
    // }).catch((error) => {
    //   // 마이크 사용 권한을 받지 못했을 때 처리
    //   alert('마이크 사용 권한을 허용해야 녹음을 진행할 수 있습니다.');
    // });


    recorder.start().then();
  };

  const offRecAudio = () => {
    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    // if (media) {
    //   media.ondataavailable = function (e) {
    //     chunks.push(e.data);
    //     let blob = new Blob(chunks, { type: "audio/webm" });
    //     convertToMp3(blob).then(mp3Blob => {
    //       setAudioUrl(org => [...org, mp3Blob]);
    //       setOnRec(true);
    //     })
    //   };

    //   // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
    //   stream.getAudioTracks().forEach(function (track) {
    //     track.stop();
    //   });

    //   // 미디어 캡처 중지
    //   media.stop();
    //   // 메서드가 호출 된 노드 연결 해제
    //   analyser.disconnect();
    //   source.disconnect();
    //   handleClickNext();
    // }


    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        setAudioUrl(org => [...org, blob]);
      })
      .catch((e) => console.error(e));
  };

  const onSubmitAudioFile = useCallback((questionId, interviewId) => {
    let formData = new FormData();
    formData.append('question_list_id', questionId);
    formData.append('interviewId', interviewId);
    const fileData = [];
    if (audioUrl.length > 0) {
      audioUrl.forEach((item, index) => {
        const audio = new Audio(URL.createObjectURL(item));
        const sound = new File([item], `audio_${index + 1}.mp3`, { lastModified: new Date().getTime(), type: "audio/mpeg" });
        // formData.append(`audio_${index+1}`, sound);
        // fileData.push(sound)
        formData.append('files', sound, `audio_${index + 1}.mp3`);
        audio.play();
      })
    }
    // formData.append('files', fileData);

    const link = document.createElement('a');
    link.download = `My audio.mp3`;
    link.href = URL.createObjectURL(audioUrl[0]);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    postMyAnswer(formData, userId, interviewId).then(data => {
      // postMyAnswerVoice(data, userId, questionId);
    });
  }, [audioUrl]);

  return { onRecAudio, offRecAudio, onSubmitAudioFile, }
}

export default useRecord