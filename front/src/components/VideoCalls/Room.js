import { Box, Tooltip, CircularProgress, IconButton, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Participant from "./Participant";
import CallEndIcon from '@material-ui/icons/CallEnd';

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [isLoggedIn, isLoadingEmployee] = useSelector((state) => 
    [state.user?.authenticated, state.call?.loading]
  );
  const { error } = useSelector((state) => state.call);
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [shareScreen, setShareScreen] = useState(false);

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const stopAudio = () => {
    setAudio(false);
    room.localParticipant.audioTracks.forEach(track => {
      track.track.disable();
    });
  }

  const onAudio = () => {
    setAudio(true);
    room.localParticipant.audioTracks.forEach(track => {
      track.track.enable();
    });
  }

  const stopVideo = () => {
    setVideo(false);
    room.localParticipant.videoTracks.forEach(track => {
      track.track.disable();
    });
  }

  const onVideo = () => {
    setVideo(true);
    room.localParticipant.videoTracks.forEach(track => {
      track.track.enable();
    });
  }

  const toggleScreen = () => {
    setShareScreen(!shareScreen);
  }

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} shareScreen={false}/>
  ));


  return (
    <div className="room">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <div className="local-participant">
          {room ? (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              shareScreen={shareScreen}
            />
          ) : (
            ""
          )}
        </div>
        <div>
          {error?.hours && (
            <Box style={{ backgroundColor: "whitesmoke", borderRadius: "2%", padding: "2%", textAlign: "center" }}>
              <Typography>{error.hours}</Typography>
            </Box>
          )}
          {!isLoggedIn && isLoadingEmployee ? <CircularProgress /> : 
            <div className="remote-participants">{remoteParticipants}</div>
          }
        </div>
      </Box>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Tooltip title="End call" placement="top">
          <IconButton
            color="secondary"
            style={{ marginTop: "3%" }}
            onClick={handleLogout} 
          >
            <CallEndIcon />
          </IconButton>
        </Tooltip>
        {audio && (
          <Tooltip title="Mute" placement="top">
            <IconButton onClick={stopAudio} style={{ marginTop: "3%" }}>
              <i className="fas fa-volume-up" />
            </IconButton>
          </Tooltip>
        )}
        {!audio && (
          <Tooltip title="Unmute" placement="top">
            <IconButton onClick={onAudio} style={{ marginTop: "3%" }}>
              <i className='fas fa-volume-mute'></i>
            </IconButton>
          </Tooltip>
        )}
        {video && (
          <Tooltip title="Hide video" placement="top">
            <IconButton onClick={stopVideo} style={{ marginTop: "3%" }}>
              <i className='fas fa-video'></i>
            </IconButton>
          </Tooltip>
        )}
        {!video && (
          <Tooltip title="Show video" placement="top" style={{ marginTop: "3%" }}>
            <IconButton onClick={onVideo}>
              <i className='fas fa-video-slash'></i>
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Toggle screen" placement="top" style={{ marginTop: "3%" }}>
          <IconButton onClick={toggleScreen}>
          <i className="material-icons">screen_share</i>
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Room;
