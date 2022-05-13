import React, { useState } from "react";
import { callApi } from "../api/index";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleAdminSubmitRegister = async (event) => {
    event.preventDefault();
    const loginInfo = {
      username: username,
      password: password,
    };
    console.log(username);
    console.log(password);
    if (password !== passwordConfirm) {
      alert("Passwords don't match!");
    } else {
      const results = await callApi({
        url: "/admin/register",
        method: "POST",
        body: loginInfo,
      });
      console.log(results);
      setPassword("");
      setPasswordConfirm("");
      if (!results.token) {
        console.log(results);
      } else if (results.token) {
        localStorage.removeItem("adminToken");
        localStorage.setItem("adminToken", results.token);
        alert("You have successfully Registered. Welcome!");
        setUsername("");
      }
    }
  };

  return (
    <div className="navbar-container" id="container">
      <div className="navbar-register" id="navbar">
        <h2>Register New Admin</h2>
      </div>
      <form onSubmit={handleAdminSubmitRegister}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          required
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          required
          minLength="8"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <label htmlFor="password-confirm">Confirm Password:</label>
        <input
          type="password"
          required
          minLength="4"
          name="password-confirm"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Admin;
