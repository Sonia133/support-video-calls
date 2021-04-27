import React, { useState, useEffect, useRef } from "react";
import { 
  Drawer,
  IconButton,
  Box,
  InputAdornment,
  OutlinedInput,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import socket from "../../socket/index.js";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const ChatCorner = ({ identity, roomname }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    const list = useRef();

    const addMessage = (newMessage) => {
      if (newMessage !== null) {
        console.log(newMessage)
        let messArray = messages;
        messArray.push(newMessage);

        setMessages(messArray);

        setChatMessages(messArray.map((message, index) =>
          <ListItem key={index}>
            <ListItemText primary={message.content} secondary={message.identity.split('@')[0]} />
            <ListItemSecondaryAction>
              <p style={{ margin: "0", fontSize: "13px" }}>{moment(message.date).format('LT')}</p>
              <p style={{ margin: "0", fontSize: "10px" }}>{moment(message.date).format('LL')}</p>
            </ListItemSecondaryAction>
          </ListItem>
        ));

        // list.current.scrollTop = list.current.scrollHeight;
      }
    }

    useEffect(() => {
      socket.ref(`messages/${roomname}`)
        .on("child_added", (snapshot) => {
          addMessage(snapshot.val());
        })
    }, []);

    const onMessageSent = () => {
      const newMessage = uuidv4();
      socket.ref(`messages/${roomname}/${newMessage}`).set({
        date: new Date(),
        identity,
        content: value
      });
    
      setValue("");
    }

    const handleDrawerOpen = () => {
      setOpen(!open);
    };

    return (
        <Box>
          <Tooltip title="Open chat" placement="top">
            <IconButton onClick={handleDrawerOpen}>
              <MenuIcon style={{ color: "whitesmoke" }}/>
            </IconButton>
          </Tooltip>
          <Drawer
            anchor={'right'}
            open={open}
          >
            <Tooltip title="Close chat" placement="top">
              <IconButton onClick={handleDrawerOpen} style={{ overflowY: "hidden" }}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <div>
              <List style={{ overflowY: "auto", width: "100%" }} ref={list}>
                {chatMessages}
              </List>
              <OutlinedInput
                style={{ marginTop: "2%", width: "100%" }}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={onMessageSent}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          </Drawer>
        </Box>
    );
};

export default ChatCorner;