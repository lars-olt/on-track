import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Classes from "./Classes";
import Login from "./Login";
import NewClass from "./NewClass";
import Settings from "./Settings";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";

function App() {
  const [{ user, font, pallet, url }, dispatch] = useStateValue();

  useEffect(() => {
    const authenticate = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      }
    });

    return () => {
      authenticate();
    };
  }, [url]);

  return (
    <div className="app" style={(font != "" && font != undefined && font != "none") ? { fontFamily: font } : {}}>
      <div className="app__imageOverlay" />
      <img src={(url[0] != "" && url[0] != undefined) ? (url[0]) : "https://source.unsplash.com/collection/311766"} className="app__bgImage"/>
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Switch>
              <Route path="/new-task">
                <Navbar />
                <NewClass />
              </Route>
              <Route path="/settings">
                <Navbar />
                <Settings />
              </Route>
              <Route path="/">
                <Navbar />
                <Classes/>
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
