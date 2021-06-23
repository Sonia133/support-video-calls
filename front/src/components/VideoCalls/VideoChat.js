import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Lobby from "./Lobby.js";
import Room from "./Room";
import axios from "../../redux/axios";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router";
import socket from "../../socket/index.js";
import { useDispatch, useSelector } from "react-redux";
import { endCall, findEmployee } from "../../redux/actions/callActions.js";
import { CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const VideoChat = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { companyName } = useParams();
  const [isEmployee, email] = useSelector((state) => [
    state.user?.role === "employee",
    state.user?.email,
  ]);
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [uniqueError, setUniqueError] = useState(false);

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
    const roomNameUuid = uuidv4();

    setRoomName(roomNameUuid);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setConnecting(true); 

      let error = false;

      await socket.ref(`calls/${username}`)
      .once("value", (data) => {
        if (!!data.val()) {
          console.log(data.val())
          setUniqueError(true);
          setConnecting(false);
          error = true;
        }
      })

      if (!error) {        
        const data = await axios
          .post("/video/token", { identity: username, room: roomName })
          .then((res) => res.data);
        
        Video.connect(data.token, {
          name: roomName,
        })
          .then((room) => {
            setConnecting(false);
            setRoom(room);
          })
          .then(() => {
            socket.ref(`calls/${username.replace(".", "-")}`).remove();
            socket.ref(`calls/${username.replace(".", "-")}`).set({
              roomId: roomName,
              joinedAt: new Date().toISOString(),
              companyName: companyName,
              isClient: true,
              inCall: false,
              hasEnded: false
            });

            socket
            .ref(`calls/${username.replace(".", "-")}/hasEnded`)
            .on("value", (snapshot) => {
              if (snapshot.val() === true || snapshot.val() === null) {
                if(!isEmployee) {
                  history.push(`/endcall/${companyName}/${roomName}`);
                }
              }
            });

            dispatch(findEmployee(roomName, companyName));
          })
          .catch((err) => {
            console.error(err);
            setConnecting(false);
          });
      }
    },
    [roomName, username, uniqueError]
  );

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        const localParticipant = prevRoom.localParticipant.identity;

        let hasRemoteParticipant = false;
        prevRoom.participants.forEach((entry) => {
          hasRemoteParticipant = true;
        })

        let remoteParticipant;
        if (hasRemoteParticipant) {
          var iterator_obj = prevRoom.participants.entries();
          remoteParticipant = iterator_obj.next().value[1].identity;
        }
    
        if (isEmployee) {
          socket.ref(`calls/${remoteParticipant.replace(".", "-")}`).update({
            hasEnded: true
          });
          socket.ref(`calls/${remoteParticipant.replace(".", "-")}`).remove();
          dispatch(endCall(companyName, email, localParticipant, remoteParticipant));
        }
    
        if (!isEmployee) {
            socket.ref(`calls/${username.replace(".", "-")}`).update({
              hasEnded: true
            });
            socket.ref(`calls/${username.replace(".", "-")}`).remove();
            
            if (remoteParticipant) {
              dispatch(endCall(companyName, remoteParticipant, localParticipant, remoteParticipant));
            } else {
              return null;
            }
        }
      }
      return null;
    })  
  }, []);

  useEffect(() => {
    if (isEmployee) {
      socket
        .ref(`calls/${email.replace(".", "-")}/roomId`)
        .once("value", async (snapshot) => {
          setRoomName(snapshot.val());
          setConnecting(true);

          const data = await axios
            .post("/video/token", { identity: email, room: snapshot.val() })
            .then((res) => res.data);
         
          Video.connect(data.token, {
            name: snapshot.val(),
          })
            .then((room) => {
              setConnecting(false);
              setRoom(room);
              
              var iterator_obj = room.participants.entries();
              const remoteParticipant = iterator_obj.next().value[1].identity;

              socket.ref(`calls/${remoteParticipant.replace(".", "-")}`).update({
                inCall: true
              });
            })
            .catch((err) => {
              console.error(err);
              setConnecting(false);
            });
        });
    }
  }, [isEmployee]);

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogout]);

  let render;
  if (room) {
    render = (
      <Room roomName={roomName} room={room} handleLogout={handleLogout} />
    );
  } else {
    if (isEmployee) {
      render = <CircularProgress />
    } else {
      render = (
        <Lobby
          username={username}
          handleUsernameChange={handleUsernameChange}
          handleSubmit={handleSubmit}
          connecting={connecting}
          error={uniqueError}
        />
      );
    }
  }
  return render;
};

export default VideoChat;
