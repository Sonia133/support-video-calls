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

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
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
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Tooltip title="End call" placement="top">
          <IconButton
            color="secondary"
            style={{ marginTop: "3%" }}
            onClick={handleLogout} 
          >
            <CallEndIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Room;
