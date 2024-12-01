import React, { useState } from "react";
import { Card, Typography, Button, Upload, Row, Col } from "antd";
import { UploadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

function Home() {
  const [recommendations, setRecommendations] = useState("");
  const handleImageUpload = (options) => {
    const { file, onSuccess, onError } = options;
  
    console.log("Image upload initiated.");
    console.log("File information:", file);
  
    // Create a FormData object
    const formData = new FormData();
    formData.append("image", file);
    console.log("FormData created and file appended.");
  
    // Send the image to the backend
    fetch("http://localhost:5000/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log("Backend responded with status:", response.status);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Upload failed with status ${response.status}`);
        }
      })
      .then((data) => {
        console.log("Backend response data:", data);
        onSuccess(data, file); // Notify Upload component of success
        // Update state with recommendations
        setRecommendations(data.recommendations);
        console.log("Recommendations updated:", data.recommendations);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        onError(error); // Notify Upload component of failure
      });
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
              <Upload
                listType="picture"
                customRequest={handleImageUpload}
                showUploadList={true}
              >
                <Button icon={<UploadOutlined />}>Choose Images</Button>
              </Upload>,

              <Button type="primary" icon={<ArrowRightOutlined />}>
                Suggest Workouts
              </Button>,
            ]}
          >
            <Text>
              Upload an image of your equipment to get personalized workout
              recommendations.
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
          {recommendations && (
            <Card style={{ marginTop: "20px" }}>
              <Title level={3}>Workout Recommendations</Title>
              <Text>{recommendations}</Text>
            </Card>
          )}
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
  );
}

export default Home;
