import React from "react";
import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

function AppFooter() {
  return (
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
  );
}

export default AppFooter;
