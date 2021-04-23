import React, { useState, useEffect, useRef } from "react";
const { LocalVideoTrack } = require('twilio-video');

const Participant = ({ participant, shareScreen }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [screen, setScreen] = useState(null);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
    
  const getStream = async () => {
    const displayMediaOptions = {
      video: { cursor: "always"}, audio: false
    }
    const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    
    const screenTrack = new LocalVideoTrack(stream.getTracks()[0]);
    
    screenTrack.attach(videoRef.current);
    participant.publishTrack(screenTrack);

    participant.tracks.forEach(function(trackPublication) {
      if (trackPublication.kind === screenTrack.kind) {
        trackPublication.track.stop();
        participant.unpublishTrack(trackPublication.track);
      }
    });
    participant.publishTrack(screenTrack);
    setScreen(screenTrack);
  }

  const getUser = async () => {
    const displayMediaOptions = {
      video: true, audio: false
    }
    const stream = await navigator.mediaDevices.getUserMedia(displayMediaOptions);
    
    const videoTrack = new LocalVideoTrack(stream.getTracks()[0]);
    
    videoTrack.attach(videoRef.current);
    participant.publishTrack(videoTrack);

    participant.tracks.forEach(function(trackPublication) {
      if (trackPublication.kind === videoTrack.kind) {
        trackPublication.track.stop();
        participant.unpublishTrack(trackPublication.track);
      }
    });
    participant.publishTrack(videoTrack);
  }

  useEffect(() => {
    if (shareScreen) {
      getStream();
    } else {
      if (screen !== null) {
        getUser();
      }
    }
  }, [shareScreen]);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      <video ref={videoRef} autoPlay={true}/>
      <audio ref={audioRef} autoPlay={true} muted={true} />
    </div>
  );
};

export default Participant;
