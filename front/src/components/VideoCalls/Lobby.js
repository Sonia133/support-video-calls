import { Box, Button, TextField, Typography } from "@material-ui/core";
import React from "react";

const Lobby = ({
  username,
  handleUsernameChange,
  handleSubmit,
  connecting,
  error
}) => {
  return (
    <div style={{height: "100%", display: "flex"}}>
      <Box
          px={6}
          py={4}
          className="auth-container single"
      >
        <h2>Join a room</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div>
            <TextField
              type="text"
              id="field"
              label="Username"
              value={username}
              onChange={handleUsernameChange}
              required
              variant="outlined"
              InputLabelProps={{shrink: true }}
            />
          </div>
          {error === true && (
              <Typography color="error">Username already taken.</Typography>
          )}
          <Button type="submit" disabled={connecting} variant="contained" color="primary">
              {connecting ? "Connecting" : "Join"}
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default Lobby;
