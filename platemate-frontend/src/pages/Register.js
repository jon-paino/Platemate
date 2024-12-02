import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Typography, Layout } from "antd";
import useUserContext from "../contexts/UserContext";

const { Title, Text } = Typography;
const { Header, Footer } = Layout;

export default function Register() {
  const { createAccount } = useUserContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const resp = await createAccount(name, email, password);
    if (resp === "Success") {
      navigate("/"); // Redirect to the home page on successful registration
    } else {
      setError(resp); // Display the error message if registration fails
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
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center", paddingTop: "80px" }}>
      <Title level={2}>Register</Title>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
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
      <Button type="primary" onClick={handleRegister} style={{ marginBottom: "10px" }}>
        Register
      </Button>
      <div>
        <Link to="/login" style={{ color: "#1890ff" }}>
          Already have an account? Login here
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
