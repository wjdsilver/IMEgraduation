import React, { useEffect, useRef, useState } from 'react';

function DualWebcam() {
  const [devices, setDevices] = useState([]);
  const [videoStream1, setVideoStream1] = useState(null);
  const [videoStream2, setVideoStream2] = useState(null);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  useEffect(() => {
    async function getDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
    }
    getDevices();
  }, []);

  useEffect(() => {
    async function startStream(deviceId, setStream, videoRef) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined }
      });
      setStream(stream);
      videoRef.current.srcObject = stream;
    }

    if (devices.length > 0) {
      startStream(devices[0].deviceId, setVideoStream1, videoRef1);
      if (devices[1]) {
        startStream(devices[1].deviceId, setVideoStream2, videoRef2);
      }
    }

    return () => {
      if (videoStream1) videoStream1.getTracks().forEach(track => track.stop());
      if (videoStream2) videoStream2.getTracks().forEach(track => track.stop());
    };
  }, [devices]);

  return (
    <div>
      <div>
        <video ref={videoRef1} autoPlay muted width="320" height="240" />
      </div>
      <div>
        <video ref={videoRef2} autoPlay muted width="320" height="240" />
      </div>
    </div>
  );
}

export default DualWebcam;
