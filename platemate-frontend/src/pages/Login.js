import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Typography, Layout } from "antd";
import useUserContext from "../contexts/UserContext";

const { Header, Footer } = Layout;
const { Title, Text } = Typography;

/**
 * Login Component
 * Renders the login page where users can enter their email and password to log in.
 * 
 * @component
 */
export default function Login() {
  const { login } = useUserContext(); // Access the login function from the UserContext
  const [email, setEmail] = useState(""); // State for storing the user's email
  const [password, setPassword] = useState(""); // State for storing the user's password
  const [error, setError] = useState(null); // State for storing any login error messages
  const navigate = useNavigate(); // React Router hook for navigation

  /**
   * Handles the login action when the user clicks the "Login" button.
   * Calls the `login` function from UserContext and navigates to the home page if successful.
   * Displays an error message if login fails.
   * 
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const handleLogin = async () => {
    const resp = await login(email, password);
    console.log(resp); // Debugging: logs the response from the login function
    if (resp === "Success") {
      navigate("/"); // Redirect to the home page on successful login
    } else {
      setError(resp); // Display the error message if login fails
    }
  };

  return (
    <div>
      {/* Header Section */}
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

      {/* Login Form Section */}
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          textAlign: "center",
          paddingTop: "80px",
        }}
      >
        <Title level={2}>Login</Title>
        {/* Error Message Display */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* Email Input */}
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        {/* Password Input */}
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        {/* Login Button */}
        <Button
          type="primary"
          onClick={handleLogin}
          style={{ marginBottom: "10px" }}
        >
          Login
        </Button>
        {/* Link to Registration Page */}
        <div>
          <Link to="/register" style={{ color: "#1890ff" }}>
            Don’t have an account? Register here
          </Link>
        </div>
      </div>

      {/* Footer Section */}
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