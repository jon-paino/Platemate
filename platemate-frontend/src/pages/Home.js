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
  const [uploadedFiles, setUploadedFiles] = useState([]); // To store uploaded files
  const [equipmentInfo, setEquipmentInfo] = useState([]); // Store equipment details
  const [workouts, setWorkouts] = useState([]); 

  // Handle file selection
  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);

    if (files.some(file => !file.type.startsWith("image/"))) {
      message.error("Only image files are allowed.");
      return;
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    message.success(`${files.length} file(s) selected.`);
  };

  const handleSuggestWorkouts = async () => {
    if (uploadedFiles.length === 0) {
      message.error("No images selected. Please upload at least one image.");
      return;
    }

    message.loading({ content: "Processing images...", key: "uploadIndicator" });

    try {
      // Retrieve the JWT token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Prepare FormData with all selected files
      const formData = new FormData();
      uploadedFiles.forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });

      // Send request to backend
      const response = await fetch("http://127.0.0.1:5000/upload-images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      const data = await response.json();
      message.success({ content: "Workouts suggested successfully!", key: "uploadIndicator", duration: 2 });

      console.log("Response from backend:", data);
      // Update the state with the response data
      setEquipmentInfo(data.equipment_details);
      setWorkouts(data.workouts);
    } catch (error) {
      console.error("Error during backend communication:", error);
      message.error({ content: "Error processing images.", key: "uploadIndicator", duration: 2 });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "200px" }}>
      {/* Welcome Card */}
      <Card style={{ marginBottom: "20px", textAlign: "center" }}>
        <Title level={2}>Welcome to Platemate</Title>
        <Text>
          Your ultimate fitness companion for personalized workout plans and
          equipment recommendations.
        </Text>
      </Card>

      <div style={{ paddingBottom: "50px" }}>
      {/* Feature Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            title="Upload Equipment Images"
            actions={[
              <div key="upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelection}
                  style={{ display: "none" }}
                  id="upload-input"
                />
                <Button icon={<UploadOutlined />} onClick={() => document.getElementById("upload-input").click()}>
                  Choose Images
                </Button>
              </div>,
              <Button type="primary" icon={<ArrowRightOutlined />} onClick={handleSuggestWorkouts}>
                Suggest Workouts
              </Button>,
            ]}
          >
            <Text>
              Upload images of your equipment. Once you're ready, click "Suggest Workouts" to process the images and receive personalized workout recommendations.
            </Text>
            <br />
            <br />
            {uploadedFiles.length > 0 && (
              <Text>
                <strong>Uploaded Files:</strong> {uploadedFiles.map((file) => file.name).join(", ")}
              </Text>
            )}
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
      </Row>
      </div>

      {/* Equipment Info Display */}
      {equipmentInfo.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Title level={3}>Detected Equipment</Title>
          <Row gutter={[16, 16]}>
            {equipmentInfo.map((item, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card>
                  {item.error ? (
                    <Text style={{ color: "red" }}>{item.error}</Text>
                  ) : (
                    <>
                      <Title level={4}>{item.equipment_name}</Title>
                      <Text>{item.description}</Text>
                    </>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Balanced Workout Suggestions */}
      {workouts.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Title level={3}>Workout Suggestions</Title>
          <Row gutter={[16, 16]}>
            {workouts.map((workout, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card>
                  <Title level={4}>{workout.workout_name}</Title>
                  <Text>
                    <strong>Muscles Targeted:</strong> {workout.muscles_targeted.join(", ")}
                  </Text>
                  <br />
                  <Text>
                    <strong>Equipment Required:</strong> {workout.equipment_required.join(", ")}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export default Home;
