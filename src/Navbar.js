import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Avatar from "@material-ui/core/Avatar";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import { actionTypes } from "./Reducer";

function Navbar() {
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [{ user }, dispatch] = useStateValue();

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        }),

        dispatch({
          type: actionTypes.SET_CLASSES,
          classes: [],
        }),

        dispatch({
          type: actionTypes.UPDATE_FONT,
          font: "",
        }),

        dispatch({
          type: actionTypes.UPDATE_PALLET,
          pallet: 1,
        }),

        dispatch({
          type: actionTypes.UPDATE_URL,
          url: "",
        }),
      )
      .catch((e) => {
        console.log(e);
      });
  };

  const handleClick = () => {
    setNavMenuOpen((prev) => !prev);
  }

  const handleClose = () => {
    setNavMenuOpen(false);
  }

  return (
    <div className="navbar">
      <div className="navbar__container">
        <Link to="/home">
          <img src="./OnTrack-Logo.png" alt="OnTrack Logo" className="navbar__logo"  />
          <img src="./OnTrack-LogoPhone.png" alt="OnTrack Logo" className="navbar__logoPhone" />
        </Link>
      </div>
      <div className="navbar__container">
        <Link to="/new-task">
          <div className="navbar__btn">
            <AddCircleOutlineIcon />
            <h3>Add Class</h3>
          </div>
        </Link>
      </div>
      <div className="navbar__right">
        <div className="navbar__avatar">
          {navMenuOpen ? (
            <div className="navbar__ring" />
          ) : null}

          {/* Desktop avatar */}
          <ClickAwayListener onClickAway={handleClose} >
            <Avatar className="navbar__avatarPhoto" src={user?.photoURL} onClick={handleClick} />
          </ClickAwayListener>

          {/* Phone setup */}
          <Avatar className="navbar__avatarPhotoPhone" src={user?.photoURL} />

          <div className="navbar__signOutPhone">
            <div className="navbar__pointer"></div>
            <div className="navbar__listItem" onClick={signOut}>
              <span>Sign Out</span>
            </div>
          </div>

          {/* Desktop menu */}
          {navMenuOpen ? (
            <div className="navbar__signOut">
              <div className="navbar__pointer"></div>
              <div className="navbar__list">
                <Link to="/home">
                  <div className="navbar__listItem">
                      <span>Home</span>
                      <HomeIcon />
                  </div>
                </Link>
                <Link to="/settings">
                  <div className="navbar__listItem">
                      <span>Settings</span>
                      <SettingsIcon />
                  </div>
                </Link>
                <div className="navbar__listItem" onClick={signOut}>
                  <span>Sign Out</span>
                  <ExitToAppIcon />
                </div>
              </div>
            </div>
          ) : null}
          
        </div>
      </div>
    </div>
  );
}

export default Navbar;
