import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Typography } from "antd";
import useUserContext from "../contexts/UserContext";

const { Title } = Typography;

export default function Register() {
  const { createAccount } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const resp = await createAccount(email, password);
    if (resp === "Success") {
      navigate("/"); // Redirect to the home page on successful registration
    } else {
      setError(resp); // Display the error message if registration fails
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <Title level={2}>Register</Title>
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
      <Button type="primary" onClick={handleRegister} style={{ marginBottom: "10px" }}>
        Register
      </Button>
      <div>
        <Link to="/login" style={{ color: "#1890ff" }}>
          Already have an account? Login here
        </Link>
      </div>
    </div>
  );
}
