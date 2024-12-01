import React from "react";
import { useState } from "react";
import { Card, Typography, Button, Upload, Row, Col } from "antd";
import { UploadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { supabase } from "../services/supabase";

const { Title, Text } = Typography;

function Home() {
  const [equipmentInfo, setEquipmentInfo] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      message.error('No file selected');
      return;
    }

    message.loading({ content: 'Uploading...', key: 'uploadIndicator' });

    // Retrieve the JWT token
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    console.log('JWT Token:', token);

    // Prepare the form data
    const formData = new FormData();
    formData.append('image', file);
    console.log('Uploading image:', file);

    try {
      const response = await fetch('http://localhost:5000/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      const data = await response.json();

      message.success({ content: 'Image processed successfully!', key: 'uploadIndicator', duration: 2 });


      console.log('Response from backend:', data);
      setEquipmentInfo(data);
    } catch (error) {
      console.error('Error during backend communication:', error);
      message.error({ content: 'Error uploading image.', key: 'uploadIndicator', duration: 2 });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Card */}
      <Card style={{ marginBottom: "20px", textAlign: "center" }}>
        <Title level={2}>Welcome to Platemate</Title>
        <Text>
          Your ultimate fitness companion for personalized workout plans and
          equipment recommendations.
        </Text>
      </Card>

      {/* Feature Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            title="Upload Equipment Image"
            actions={[
              <div key="upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="upload-input"
                />
                <Button icon={<UploadOutlined />} onClick={() => document.getElementById('upload-input').click()}>
                  Choose Image
                </Button>
              </div>,
              <Button type="primary" icon={<ArrowRightOutlined />}>
                Suggest Workouts
              </Button>,
            ]}
          >
            <Text>
              Upload an image of your equipment to get personalized workout recommendations.
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            title="Retrieve Workout Recommendations"
            actions={[
              <Link to="/recommendations">
                <Button icon={<ArrowRightOutlined />}>Retrieve Workouts</Button>
              </Link>,
            ]}
          >
            <Text>
              Discover workouts tailored to your available equipment and fitness
              goals.
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            title="View Your Profile"
            actions={[
              <Link to="/profile">
                <Button type="default" icon={<ArrowRightOutlined />}>
                  Go to Profile
                </Button>
              </Link>,
            ]}
          >
            <Text>
              Manage your profile, track your workout history, and update your
              preferences.
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
        {equipmentInfo && (
          <Card style={{ marginTop: "20px" }}>
            <Title level={3}>{equipmentInfo.equipment_name}</Title>
            <Text>{equipmentInfo.description}</Text>
            <Text>
              <strong>Muscles Targeted:</strong> {equipmentInfo.muscles_targeted.join(", ")}
            </Text>
            <Text>
              <strong>Exercises:</strong> {equipmentInfo.exercises.join(", ")}
            </Text>
          </Card>
        )}
        </Col>
      </Row>
    </div>
  );
}

export default Home;
