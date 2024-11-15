import React from "react";
import { Card, Typography, Button, Upload, Row, Col } from "antd";
import { UploadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

function Home() {
  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      alert(`Image uploaded successfully: ${info.file.name}`);
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
              <Upload
                listType="picture"
                onChange={handleImageUpload}
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
