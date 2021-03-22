import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Lobby from "./Lobby.js";
import Room from "./Room";
import axios from "../../redux/axios";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router";
import socket from "../../socket/index.js";
import { useSelector } from "react-redux";

const VideoChat = () => {
  // const isLoggedIn = something
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

    console.log(roomNameUuid);
    setRoomName(roomNameUuid);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      // if auth
      event.preventDefault();
      setConnecting(true);
      // if not auth
      const data = await axios
        .post("/video/token", { identity: username, room: roomName })
        .then((res) => res.data);
      // somewhere here axios.post for find employee -> send in body the roomname

      // else
      // get auth user -> firstname lastname currentcallId
      //const data = await axios.post("/video/token", { identity: firstname + lastname, room: currentCallId })
      //.then((res) => res.data);
      Video.connect(data.token, {
        name: roomName,
      })
        .then((room) => {
          setConnecting(false);
          setRoom(room);
        })
        .then(() => {
          socket.ref(`calls/${username}`).remove();
          socket.ref(`calls/${username}`).set({
            roomId: roomName,
            joinedAt: new Date().toISOString(),
            companyName: companyName,
            isClient: true,
          });
        })
        .catch((err) => {
          console.error(err);
          setConnecting(false);
        });
    },
    [roomName, username]
  );

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
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
          // if not auth
          const data = await axios
            .post("/video/token", { identity: email, room: snapshot.val() })
            .then((res) => res.data);
          // somewhere here axios.post for find employee -> send in body the snapshot.val()

          // else
          // get auth user -> firstname lastname currentcallId
          //const data = await axios.post("/video/token", { identity: firstname + lastname, room: currentCallId })
          //.then((res) => res.data);
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
    // if auth -> handleSubmit()? or create some other function without event param
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
    render = (
      <Lobby
        username={username}
        handleUsernameChange={handleUsernameChange}
        handleSubmit={handleSubmit}
        connecting={connecting}
      />
    );
  }
  return render;
};

export default VideoChat;
