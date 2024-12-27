import React, { useEffect, useState, useCallback } from 'react'
import { postMyAnswerText } from '@apis/interview'
import { useNavigate } from 'react-router-dom';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recog = new SpeechRecognition()


const useSTT = () => {
  const [value, setValue] = useState('결과');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId")
  
  // const recog = window.SpeechRecognition;
  recog.interimResults = false;
  recog.lang = 'ko-KR';
  recog.continuous = true;

  recog.onresult = (e) => {
      const results = e.results;
      let resultString = '';
      for (let i = 0 ; i < results.length ; i++) {
          resultString += `${results.item(i)[0].transcript} `
      }
      setValue(resultString);
  }

  const onSTTStart = () => {
    recog.start();
  }

  const onSTTEnd = () => {
    recog.stop();
    setResults(org => [...results, value]);
    setValue('');
  }

  const onSubmitResult = async (questionId=0) => {
    const { interview_id } =  await postMyAnswerText(results, userId, questionId)
    return interview_id;
  }

  useEffect(() => {
    console.log(results);
  }, [results]);

  return { onSTTStart, onSTTEnd, onSubmitResult }
}

export default useSTT