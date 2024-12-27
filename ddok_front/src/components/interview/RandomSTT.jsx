import React, { useState } from 'react';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recog = new SpeechRecognition()

function RandomSTT() {
    const [value, setValue] = useState('결과');
    const [isListening, setIsListening] = useState(false);
    
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

    const toggleListen = () => {
        if (isListening) {
            recog.stop()
        } else {
            recog.start()
        }
        setIsListening(!isListening);
    };

    return (
        <div>
            <h2>음성인식</h2>
      
            <div>{value}</div>
      
            <button onClick={toggleListen}>
      			🎤speech
			</button>

            {isListening && <div>음성인식 중</div>}

            {
                console.log(value)
            }
        </div>
    );
}

export default RandomSTT;