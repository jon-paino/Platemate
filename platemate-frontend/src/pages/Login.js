import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Typography, Layout } from "antd";
import useUserContext from "../contexts/UserContext";

const { Header, Footer } = Layout;

const { Title, Text } = Typography;

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
    <div>
      <Header
        style={{
          width: "100%",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="logo"
          style={{
            display: "flex",
            alignItems: "center",
            paddingRight: "30px",
          }}
        >
          <h1 style={{ color: "white", margin: 0 }}>Platemate</h1>
        </div>
      </Header>
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          textAlign: "center",
          paddingTop: "80px",
        }}
      >
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
        <Button
          type="primary"
          onClick={handleLogin}
          style={{ marginBottom: "10px" }}
        >
          Login
        </Button>
        <div>
          <Link to="/register" style={{ color: "#1890ff" }}>
            Don’t have an account? Register here
          </Link>
        </div>
      </div>
      <Footer
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          backgroundColor: "#333",
          color: "#fff",
          padding: "10px",
        }}
      >
        <Text style={{ color: "#fff" }}>© 2024 Platemate.</Text>
      </Footer>
    </div>
  );
}
