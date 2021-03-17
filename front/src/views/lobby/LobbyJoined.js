import React, { useState } from "react";

import classnames from "classnames";

export default function LobbyJoined({
  connectedUser,
  onLogin,
  startCall,
  setLocalVideoRef,
  setRemoteVideoRef,
}) {
  const [userToCall, setUserToCall] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLoginClicked = async () => {
    await onLogin(username);
    setIsLoggedIn(true);
  };

  const onStartCallClicked = () => {
    startCall(username, userToCall);
  };

  const renderVideos = () => {
    return (
      <div className={classnames("videos", { active: isLoggedIn })}>
        <div>
          <label>{username}</label>

          <video ref={setLocalVideoRef} autoPlay playsInline></video>
        </div>
        <div>
          <label>{connectedUser}</label>
          <video ref={setRemoteVideoRef} autoPlay playsInline></video>
        </div>
      </div>
    );
  };

  const renderForms = () => {
    return isLoggedIn ? (
      <div key="a" className="form">
        <label>Call to</label>
        <input
          value={userToCall}
          type="text"
          // HERE WE SHOUL PUT ID AL ANGAJATULUI
          onChange={(e) => setUserToCall(e.target.value)}
        />
        <button
          onClick={onStartCallClicked}
          id="call-btn"
          className="btn btn-primary"
        >
          Call
        </button>
      </div>
    ) : (
      <div key="b" className="form">
        <label>Type a name</label>
        <input
          value={username}
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={onLoginClicked}
          id="login-btn"
          className="btn btn-primary"
        >
          Login
        </button>
      </div>
    );
  };

  return (
    <section id="container">
      {connectedUser ? null : renderForms()}

      {renderVideos()}
    </section>
  );
}
