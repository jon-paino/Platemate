import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import useUserContext from "../contexts/UserContext";

const { Header } = Layout;

function Navbar() {
  const { loggedIn, logout } = useUserContext();
  const location = useLocation();

  // Determine the current selected key based on the current path
  const selectedKey = () => {
    switch (location.pathname) {
      case "/":
        return "1";
      case "/recommendations":
        return "2";
      case "/profile":
        return "3";
      default:
        return "1";
    }
  };

  return (
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
        style={{ display: "flex", alignItems: "center", paddingRight: "30px" }}
      >
        <h1 style={{ color: "white", margin: 0 }}>Platemate</h1>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{ flexGrow: 1 }}
        selectedKeys={[selectedKey()]}
      >
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/recommendations">Recommendations</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Button type="link" onClick={logout} style={{ color: "white" }}>
            Logout
          </Button>
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default Navbar;
