import { Box, Button, TextField } from "@material-ui/core";
import React from "react";

const Lobby = ({
  username,
  handleUsernameChange,
  handleSubmit,
  connecting,
}) => {
  return (
    <div style={{height: "100%", display: "flex"}}>
      <Box
          px={6}
          py={4}
          className="auth-container"
          style={{background: "#fff"}}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
      >
        <h2>Join a room</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div>
            <TextField
              type="text"
              id="field"
              label="Email"
              value={username}
              onChange={handleUsernameChange}
              required
              variant="outlined"
              InputLabelProps={{shrink: true }}
            />
          </div>
          <Button type="submit" disabled={connecting} variant="contained" color="primary">
              {connecting ? "Connecting" : "Join"}
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default Lobby;
