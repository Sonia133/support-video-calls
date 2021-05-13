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
import ChatIcon from '@material-ui/icons/Chat';
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

    const getWindowDimensions = () => {
      const { innerWidth: width } = window;
      if (width > 570) {
        return 'right';
      }

      return 'bottom';
    }

    const [anchor, setAnchor] = useState(getWindowDimensions());

    useEffect(() => {
      function handleResize() {
        console.log('here')
        setAnchor(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

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
              <ChatIcon style={{ color: "whitesmoke" }}/>
            </IconButton>
          </Tooltip>
          <Drawer
            anchor={anchor}
            open={open}
          >
            <Tooltip title="Close chat" placement="top">
              <IconButton onClick={handleDrawerOpen}>
                <ChatIcon />
              </IconButton>
            </Tooltip>
            <div style={{ width: "100%" }}>
              <List style={{ width: "100%", overflowY: "auto" }} ref={list} className="chat">
                {chatMessages}
              </List>
              <OutlinedInput
                style={{ marginTop: "2%", width: "100%", overflowY: "hidden" }}
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