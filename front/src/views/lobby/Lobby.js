import { TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { useParams } from "react-router-dom";
import {
  doOffer,
  doAnswer,
  doLogin,
  doCandidate,
} from "../../modules/FirebaseModule";
import {
  createOffer,
  initiateConnection,
  startCall,
  sendAnswer,
  addCandidate,
  initiateLocalStream,
  listenToConnectionEvents,
} from "../../modules/RTCModule";
import axios from "../../redux/axios";
import LobbyJoined from "./LobbyJoined";

const config = {
  apiKey: "AIzaSyA5kOMfrH7bLnqoRNa2lTr1j0D6rwN5C_M",
  authDomain: "support-video-calls.firebaseapp.com",
  projectId: "support-video-calls",
  storageBucket: "support-video-calls.appspot.com",
  messagingSenderId: "123523405850",
  appId: "1:123523405850:web:d0ad246c2ac0f72b0f59a3",
  measurementId: "G-DNHLB5G69Q",
};

export default function Lobby() {
  const { companyName } = useParams();
  const [database, setDatabase] = useState(null);
  const [connectedUser, setConnectedUser] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [localConnection, setLocalConnection] = useState(null);
  const [localVideoRef, setLocalVideoRef] = useState(React.createRef());
  const [remoteVideoRef, setRemoteVideoRef] = useState(React.createRef());

  useEffect(() => {
    axios
      .get(`/call/start/${companyName}`)
      .then(({ data }) => console.log(data));
  });

  useEffect(async () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    // getting local video stream
    setDatabase(firebase.database());

    initiateLocalStream().then((data) => {
      setLocalStream(data);
      setLocalVideoRef(data);
    });

    initiateConnection().then((data) => setLocalConnection(localConnection));
  }, []);

  const startCall = async (username, userToCall) => {
    listenToConnectionEvents(
      localConnection,
      username,
      userToCall,
      database,
      remoteVideoRef,
      doCandidate
    );
    // create an offer
    createOffer(
      localConnection,
      localStream,
      userToCall,
      doOffer,
      database,
      username
    );
  };

  const handleUpdate = (notif, username) => {
    if (notif) {
      switch (notif.type) {
        case "offer":
          setConnectedUser(notif.from);

          listenToConnectionEvents(
            localConnection,
            username,
            notif.from,
            database,
            remoteVideoRef,
            doCandidate
          );

          sendAnswer(
            localConnection,
            localStream,
            notif,
            doAnswer,
            database,
            username
          );
          break;
        case "answer":
          setConnectedUser(notif.from);
          startCall(localConnection, notif);
          break;
        case "candidate":
          addCandidate(localConnection, notif);
          break;
        default:
          break;
      }
    }
  };

  const onLogin = async (username) => {
    return await doLogin(username, database, handleUpdate);
  };

  return (
    <div>
      <h2>Welcome to {companyName}</h2>
      <LobbyJoined
        startCall={startCall}
        onLogin={onLogin}
        setLocalVideoRef={setLocalVideoRef}
        setRemoteVideoRef={setRemoteVideoRef}
        connectedUser={connectedUser}
      />
    </div>
  );
}
