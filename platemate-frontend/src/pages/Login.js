import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Typography } from "antd";
import useUserContext from "../contexts/UserContext";

const { Title } = Typography;

export default function Login() {
  const { login } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const resp = await login(email, password);
    console.log(resp);
    if (resp === "Success") {
      navigate("/"); // Redirect to the home page on successful login
    } else {
      setError(resp); // Display the error message if login fails
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <Title level={2}>Login</Title>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Button type="primary" onClick={handleLogin} style={{ marginBottom: "10px" }}>
        Login
      </Button>
      <div>
        <Link to="/register" style={{ color: "#1890ff" }}>
          Don’t have an account? Register here
        </Link>
      </div>
    </div>
  );
}
