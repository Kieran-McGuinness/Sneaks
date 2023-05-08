import React, { useState } from "react";
import { Link } from "react-router-dom";
import { callApi } from "../api";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Login = (props) => {
  const { setSignedIn, cartChange, setCartChange } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  let history = useHistory();
  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    const loginInfo = {
      username: username,
      password: password,
    };
    const results = await callApi({
      url: "/users/login",
      method: "POST",
      body: loginInfo,
    });

    setLoginMessage(results.data);
    setUsername("");
    setPassword("");
    if (!results.token) {
      setSeverity("error");
      setLoginMessage(results);
      handleClick();
      console.log(results);
    } else if (results) {
      setSeverity("success");
      setLoginMessage(results.message + " You will be redirected shortly");
      handleClick();
      localStorage.removeItem("token");
      localStorage.setItem("token", results.token);
      setCartChange(cartChange + 1);
      setSignedIn(true);
      setTimeout(function () {
        history.push("/items");
      }, 3000);
    }

    // else
    // (alert('You have successfully Logged in. Welcome!'))
  };

  return (
    <div className="login-whole">
      <img
        className="home-image"
        src="/imgs/sneakerss.jpg"
        width="875px"
        height="665px"
        alt="current event"
      />

      {/* <div className="login-title">
        <h2>Sign-In</h2>
      </div> */}
      <Box
        component="form"
        id="login-form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmitLogin}
      >
        <div className="login-title">
          <h2>Sign-In</h2>
        </div>
        <div className="login-inputs">
          <TextField
            required
            id="outlined-required"
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <TextField
            id="outlined-password-input"
            required={true}
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Link to="/register">New User? Click here to register</Link>
          <br></br>
          <Button style={{ fontSize: "14px" }} variant="outlined" type="submit">
            Sign-In
          </Button>
        </div>
      </Box>
      {/* <Link to="/register">Need an account? Click here to register</Link> */}
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {loginMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default Login;
