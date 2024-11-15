import React from "react";
import { Avatar, Card, Button, Typography, Divider } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function Profile() {
  // Placeholder user data, will be replaced with actual user data from backend
  const userData = {
    profilePicture: null,
    userName: "John Doe",
    userId: "user123",
    email: "johndoe@example.com",
    workoutCount: 25,
    favoriteExercise: "Push-Ups",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Card style={{ textAlign: "center" }}>
        <Avatar
          size={100}
          icon={<UserOutlined />}
          src={userData.profilePicture}
          style={{ marginBottom: "20px" }}
        />

        <Title level={3}>{userData.userName}</Title>
        <Text type="secondary">User ID: {userData.userId}</Text>
        <Divider />

        <Text>Email: {userData.email}</Text>
        <Divider />

        <div style={{ marginBottom: "20px" }}>
          <Text>Workouts Completed: {userData.workoutCount}</Text>
          <br />
          <Text>Favorite Exercise: {userData.favoriteExercise}</Text>
        </div>

        <Button type="primary" icon={<EditOutlined />}>
          Edit Profile
        </Button>
      </Card>
    </div>
  );
}

export default Profile;
