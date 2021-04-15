import React, { useState, useRef, useEffect } from "react";
import { 
    Button, 
    IconButton, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle,
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
    Divider
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logoutUser, uploadImage, changeAvailability } from "../../redux/actions/userActions";
import { ActionTypes } from "../../redux/types";

const Profile = () => {
    const [open, setOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const anchorRef = useRef(null);
    const history = useHistory();
    const dispatch = useDispatch();

    const { role, available, loading, imageUrl, loadingPicture, error, companyName, firstname, lastname } = useSelector((state) => state.user)
    const [ isEmployee, schedule ] = useSelector((state) => [state.user.role === 'employee', state.user?.schedule]);
    const { error: errorUi } = useSelector((state) => state.ui);

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
        dispatch({ type: ActionTypes.UI.CLEAR_ERRORS });
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

        dispatch(uploadImage(formData));
    };

    const onEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };

    return (
        <div style={{marginBottom:"20px"}}>
            <IconButton
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggleMenu}
            >
                <AccountCircleIcon></AccountCircleIcon>
            </IconButton>
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
                    {!loadingPicture && (
                        <div onClick={onEditPicture} style={{ display: "contents" }}>
                            <Tooltip placement="top" title="Update Image">
                                <img src={imageUrl} alt="profile" className="profile-image"/>
                            </Tooltip>
                            <input style={{display: 'none'}} type="file" id="imageInput" onChange={onImageChange}></input>
                        </div>
                    )}
                    {loadingPicture && (
                        <div style={{ width: "40%", height: "40%"}}>
                            <CircularProgress/>
                        </div>
                    )}
                    <DialogContentText style={{ width: "100%" }}>
                        <Divider variant="middle"/>
                        <div className="dialog-text">
                            <Typography>{firstname + " " + lastname}</Typography>
                            <Typography>{role + " @ " + companyName}</Typography>
                        </div>
                    </DialogContentText>
                    {isEmployee && (
                        <Box>
                        {!loading && (
                            <Tooltip title={available === true? "Go busy" : "Go available"} placement="bottom">
                                <IconButton onClick={onChangeAvailability}>
                                    {!available ? (<EventBusyIcon />) : (<EventAvailableIcon />)}
                                </IconButton>
                            </Tooltip>
                        )}
                        {loading && (<CircularProgress/>)}
                        </Box>
                    )}
                    {!!error?.error && (
                        <Typography color="error">{error.error}</Typography>
                    )}
                    {!!errorUi?.error && (
                        <Typography color="error">{errorUi.error}</Typography>
                    )}
                    <Button 
                        style={{ marginBottom: "5%", marginTop: "8%" }} 
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