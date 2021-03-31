import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Lobby from "./Lobby.js";
import Room from "./Room";
import axios from "../../redux/axios";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router";
import socket from "../../socket/index.js";
import { useDispatch, useSelector } from "react-redux";
import { findEmployee, endCall } from "../../redux/actions/callActions.js";
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

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
    const roomNameUuid = uuidv4();

    setRoomName(roomNameUuid);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setConnecting(true);
      
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
          });

          console.log('here')
          dispatch(findEmployee(roomName, companyName));
        })
        .catch((err) => {
          console.error(err);
          setConnecting(false);
        });
    },
    [roomName, username]
  );

  const handleLogout = useCallback(() => {  
    var employeeEmail;

    setRoom((prevRoom) => {      
      if (prevRoom) {
        if (!isEmployee) {
          var iterator_obj = prevRoom.participants.entries();
          employeeEmail = iterator_obj.next().value[1].identity;
        }
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }

      if (isEmployee) {
        dispatch(endCall(companyName, email));
      }

      if (!isEmployee) {
          socket.ref(`calls/${username.replace(".", "-")}`).remove();
          // console.log(employeeEmail)
          dispatch(endCall(companyName, employeeEmail));

          // socket.ref("calls").orderByChild("isClient").equalTo(true)
          //   .orderByChild("joinedAt").limitToFirst(1).get()
          // .then((data) => {
          //   dispatch(findEmployee(data.val().roomId, data.val().companyName));
          //   return null;
          // })
      }

      return null;
    });
  }, []);

  useEffect(() => {
    if (isEmployee) {
      socket
        .ref(`calls/${email.replace(".", "-")}/roomId`)
        .once("value", async (snapshot) => {
          setRoomName(snapshot.val())
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
        />
      );
    }
  }
  return render;
};

export default VideoChat;
