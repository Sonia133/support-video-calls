import React, { useState, useRef, useEffect } from "react";
import { 
    Button, 
    IconButton, 
    Dialog, 
    DialogContent, 
    DialogContentText, 
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem,
    Typography,
    Box,
    CircularProgress, 
    Tooltip,
    Divider,
    Link
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logoutUser, uploadImage, changeAvailability, deleteProfilePicture } from "../../redux/actions/userActions";
import { ActionTypes } from "../../redux/types";

const Profile = () => {
    const [open, setOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openSchedule, setOpenSchedule] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [loadPicture, setLoadPicture] = useState("inline-block");
    const anchorRef = useRef(null);
    const history = useHistory();
    const dispatch = useDispatch();

    const { role, available, loading, imageUrl, loadingPicture, loadingAvailability, error, companyName, firstname, lastname } = useSelector((state) => state.user)
    const [ isEmployee, schedule, feedback ] = useSelector((state) => [
        state.user.role === 'employee',
        state.user?.schedule,
        state.user?.feedback
    ]);
    
    const [showError, setShowError] = useState("");

    useEffect(() => {
        if (loadingPicture === false && hasChanged === true) {
            setLoadPicture("none");
            setTimeout(() => {
                setLoadPicture("inline-block");
                setHasChanged(false);
            }, 1000);
        }
    }, [loadingPicture])

    useEffect(() => {
        if (error) {
            for(let key in error) {
                setShowError(error[key]);
                break;
            }
        } else {
            setShowError("");
        }
    }, [error])

    const handleToggleMenu = () => {
        setOpenMenu((prevOpen) => !prevOpen);
    };

    const closeMenu = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpenMenu(false);
    };

    const prevOpen = useRef(openMenu);
    useEffect(() => {
        if (prevOpen.current === true && openMenu === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = openMenu;
    }, [openMenu]);

    const openProfileDialog = () => {
        setOpen(true);
        setOpenMenu(false);
    }

    const closeProfileDialog = () => {
        setOpen(false);
        setOpenSchedule(false);
        dispatch({ type: ActionTypes.USER.CLEAR_ERRORS });
    }

    const onChangePassword = () => {
        history.push('/changepassword');
    }

    const onLogout = () => {
        dispatch(logoutUser(role));
    }

    const onChangeAvailability = () => {
        dispatch(changeAvailability({ available: !available }));
    }

    const onImageChange = (event) => {
        const image = event.target.files[0];
        
        const formData = new FormData();
        formData.append('image', image, image.name);

        setHasChanged(true);
        dispatch(uploadImage(formData));
    };

    const onEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };

    const onDeleteProfilePicture = () => {
        setHasChanged(true);
        dispatch(deleteProfilePicture());

    }

    const openScheduleEmployee = () => {
        setOpenSchedule(!openSchedule);
    }

    return (
        <div>
            <Tooltip title="Profile" placement="top">
                <IconButton
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggleMenu}
                >
                    <AccountCircleIcon fontSize="large" style={{ color: "whitesmoke" }}></AccountCircleIcon>
                </IconButton>
            </Tooltip>
            <Popper open={openMenu} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                <Paper>
                    <ClickAwayListener onClickAway={closeMenu}>
                    <MenuList autoFocusItem={openMenu} id="menu-list-grow">
                        <MenuItem onClick={openProfileDialog}>Profile</MenuItem>
                        <MenuItem onClick={onChangePassword}>Change password</MenuItem>
                        <MenuItem onClick={onLogout}>Logout</MenuItem>
                    </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
            </Popper>
            <Dialog
                open={open}
                keepMounted
                onClose={closeProfileDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    {!loadingPicture && loadPicture !== "none" && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "3%"}}>
                            <div onClick={onEditPicture} style={{ display: "contents" }}>
                                <Tooltip placement="top" title="Update Image">
                                    <img src={imageUrl} alt="profile" className="profile-image" style={{ display: loadPicture }}/>
                                </Tooltip>
                                <input style={{display: 'none'}} type="file" id="imageInput" onChange={onImageChange}></input>
                            </div>
                            <Button onClick={onDeleteProfilePicture} color="secondary" variant="contained">
                                Delete profile picture
                            </Button>
                        </div>
                    )}
                    {(loadingPicture || loadPicture === "none") && (
                        <div style={{ width: "40%", height: "40%", display: "flex", justifyContent: "center", marginBottom: "3%" }}>
                            <CircularProgress/>
                        </div>
                    )}
                    <DialogContentText style={{ width: "100%" }}>
                        <Divider variant="middle"/>
                        <div className="dialog-text">
                            <Typography>{firstname + " " + lastname}</Typography>
                            {role !== 'admin' ?(<Typography>{role + " @ " + companyName}</Typography>)
                                : (<Typography>{"admin @ SupportVideoCalls"}</Typography>)
                            }
                            {role === 'employee' && feedback === 0 && (
                                <Typography>No feedback yet.</Typography>
                            )}
                            {role === 'employee' && feedback !== 0 && (
                                <Typography>Feedback: {feedback.toFixed(2)}</Typography>
                            )}
                        </div>
                    </DialogContentText>
                    {isEmployee && (
                        <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            {!loadingAvailability && (
                                <Tooltip title={available === true? "Go busy" : "Go available"} placement="right">
                                    <IconButton onClick={onChangeAvailability}>
                                        {!available ? (<EventBusyIcon />) : (<EventAvailableIcon />)}
                                    </IconButton>
                                </Tooltip>
                            )}
                            {loadingAvailability && (<CircularProgress/>)}
                            <Link onClick={openScheduleEmployee}>{openSchedule ? "Hide" : "See"} schedule</Link>
                            {openSchedule && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: "0.3"}}>
                                    <p>Monday: {schedule[0]}</p>
                                    <p>Tuesday: {schedule[1]}</p>
                                    <p>Wednesday: {schedule[2]}</p>
                                    <p>Thursday: {schedule[3]}</p>
                                    <p>Friday: {schedule[4]}</p>
                                </div>
                            )}
                        </Box>
                    )}
                    {showError !== "" && (
                        <Typography color="error">{showError}</Typography>
                    )}
                    <Button 
                        style={{ marginBottom: "5%", marginTop: "5%" }} 
                        onClick={closeProfileDialog} 
                        variant="contained" 
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Profile;