import React, { useState } from "react";
import { callApi } from "../api";

const AdminLogin = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    const loginInfo = {
      username: username,
      password: password,
    };
    const results = await callApi({
      url: "/admin/login",
      method: "POST",
      body: loginInfo,
    });
    console.log(results.token);
    setUsername("");
    setPassword("");

    localStorage.removeItem("adminToken");
    localStorage.setItem("adminToken", results.token);
    if (!results.token) {
      alert("You have entered an invalid username or password");
    } else alert("You have successfully Logged in. Welcome!");
  };

  return (
    <div className="login-whole">
      <div className="login-title">
        <h2>Admin Log In</h2>
      </div>
      <form onSubmit={handleAdminLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          minLength="4"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};
export default AdminLogin;
