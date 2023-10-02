import React, { useEffect, useRef, useState } from 'react';

const useSponsorBlock = (videoId) => {
  const [skipSegments, setSkipSegments] = useState([]);
  useEffect(() => {
    fetch(`https://sponsor.ajay.app/api/skipSegments?videoID=${videoId}`)
      .then((res) => res.json())
      .then(setSkipSegments);
  }, [videoId]);
  return skipSegments;
};

function App() {
  const videoRef = useRef(null);
  const params = new URLSearchParams(window.location.search);
  const v = params.get("v") ? params.get("v") : 'dQw4w9WgXcQ';
  const instance = params.get('inst') ? new URL(params.get('inst').startsWith('http://') || params.get('inst').startsWith('https://') ? params.get('inst') : 'http://' + params.get('inst')).host : 'yewtu.be';
  const skipSegments = useSponsorBlock(v);

  useEffect(() => {
    const video = videoRef.current;
    const checkTimeAndUpdate = () => {
      const currentTime = video.currentTime;
      const segment = skipSegments.find(({ segment: [start, end] }) => currentTime >= start && currentTime < end);
      if (segment) video.currentTime = segment.segment[1];
    };
    video.addEventListener('timeupdate', checkTimeAndUpdate);
    return () => video.removeEventListener('timeupdate', checkTimeAndUpdate);
  }, [skipSegments]);

  return (
    <video
      ref={videoRef}
      src={`https://${instance}/embed/${v}?raw=1`}
      poster={`https://${instance}/vi/${v}/maxresdefault.jpg`}
      controls
    ></video>
  );
}

export default App;
