import React, { useEffect, useState } from "react";
import { Avatar, Card, Button, Typography, Divider } from "antd";
import { UserOutlined, EditOutlined, LogoutOutlined } from "@ant-design/icons";
import useUserContext from "../contexts/UserContext";
import { fetchEquipment, fetchWorkouts } from "../services/supabase";

const { Title, Text } = Typography;

function Profile() {
  // Get user info from context
  const { userMetadata, logout } = useUserContext();
  console.log(userMetadata);
  
  const [equipmentLength, setEquipmentLength] = useState(0);
  const [workoutsLength, setWorkoutsLength] = useState(0);

  useEffect(() => {
    const loadWorkoutsLength = async () => {
      const workouts = await fetchWorkouts();
      if (workouts) {
        setWorkoutsLength(workouts.length);
      }

      const equipment = await fetchEquipment();
      if (equipment) {
        setEquipmentLength(equipment.length);
      }
    };
  
    loadWorkoutsLength();
  }, []);
  

  // Placeholder user data, will be replaced with actual user data from backend
  const userData = {
    profilePicture: null,
    userName: userMetadata.name,
    email: userMetadata.email
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

        <Text>Email: {userData.email}</Text>
        <Divider />

        <div style={{ marginBottom: "20px" }}>
          <Text><strong>Pieces of Workout Equipment: </strong>{equipmentLength}</Text>
          <br />
          <Text><strong>Workouts Recommended: </strong>{workoutsLength}</Text>
        </div>
        <Divider />

        <Button type="primary" onClick={logout} icon={<LogoutOutlined />}>
          Logout
        </Button>
      </Card>
    </div>
  );
}

export default Profile;
