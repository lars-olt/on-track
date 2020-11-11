import React from "react";
import "./Login.css";
import { auth, provider } from "./firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./Reducer";

function Login() {
  const [{ user }, dispatch] = useStateValue();

  const login = () => {
    if (!user) {
      auth
        .signInWithPopup(provider)
        .then((result) => {
          dispatch({
            type: actionTypes.SET_USER,
            user: result.user,
          });
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          className="login__logo"
          src="./OnTrack-Logo.png"
          alt="OnTrack Logo"
        />
        <form action="" onClick={login}>
          <div className="login__google">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1004px-Google_%22G%22_Logo.svg.png"
              alt="google-logo"
            />
            <span>Sign in with Google</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
