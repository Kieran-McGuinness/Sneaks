import React, { useState } from "react";
import { callApi } from "../api/index";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { useHistory } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";

const Register = (props) => {
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const setSignedIn = props.setSignedIn;
  let history = useHistory();
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

  const handleSubmitRegister = async (event) => {
    event.preventDefault();
    const loginInfo = {
      username: username,
      password: password,
    };

    console.log(password);
    if (password === passwordConfirm) {
      setPasswordMatch(false);
      const results = await callApi({
        url: "/users/register",
        method: "POST",
        body: loginInfo,
      });
      console.log(results);
      setPassword("");
      setPasswordConfirm("");
      if (!results.token) {
        setSeverity("error");
        setRegisterMessage(results);
        handleClick();
      } else if (results.token) {
        localStorage.removeItem("token");
        localStorage.setItem("token", results.token);
        setUsername("");
        setSeverity("success");
        setRegisterMessage(results.message + " You will be redirected shortly");
        handleClick();
        setSignedIn(true);
        setTimeout(function () {
          history.push("/items");
        }, 3000);
      }
    } else if (password !== passwordConfirm) {
      setPasswordMatch(true);
      setPassword("");
      setPasswordConfirm("");
      setSeverity("error");
      setRegisterMessage("Passwords Must Match");
      handleClick();
    }
  };

  return (
    <div className="navbar-container" id="container">
      <div className="image">
      <img className="home-image" src="/imgs/sneakerss.jpg"  width="875px" height="665px" alt="current event" />
      </div>
      <Box
        component="form"
        id="register-form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmitRegister}
      >
        <div className="navbar-register" id="navbar">
          <h2 className="page-title">Register</h2>
        </div>
        <div className="register-inputs">
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
          <TextField
            id="outlined-password-input"
            required={true}
            label="Confirm Password"
            type="password"
            error={passwordMatch}
            helperText="Passwords must match"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
          />
          <Button variant="outlined" type="submit">
            Register
          </Button>
        </div>
      </Box>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {registerMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;
