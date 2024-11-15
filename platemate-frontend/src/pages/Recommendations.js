import React from "react";
import { Card, Button, Typography, List, Row, Col } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function Recommendations() {
  // Placeholder workout recommendations data
  const recommendations = [
    {
      id: 1,
      title: "Full Body Workout",
      description:
        "A balanced workout routine targeting all major muscle groups.",
      exercises: ["Push-Ups", "Squats", "Burpees", "Plank"],
    },
    {
      id: 2,
      title: "Upper Body Strength",
      description:
        "Focus on building upper body strength with these exercises.",
      exercises: ["Pull-Ups", "Bench Press", "Bicep Curls", "Tricep Dips"],
    },
    {
      id: 3,
      title: "Core Workout",
      description: "A routine designed to strengthen your core muscles.",
      exercises: [
        "Sit-Ups",
        "Leg Raises",
        "Mountain Climbers",
        "Russian Twists",
      ],
    },
  ];

  const handleFetchRecommendations = () => {
    // Placeholder for fetching new recommendations
    alert("Fetching new recommendations...");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Personalized Workout Recommendations
      </Title>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleFetchRecommendations}
        >
          Fetch New Recommendations
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {recommendations.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card
              hoverable
              title={item.title}
              bordered={true}
              style={{ height: "100%" }}
            >
              <Text>{item.description}</Text>
              <List
                size="small"
                dataSource={item.exercises}
                renderItem={(exercise) => <List.Item>{exercise}</List.Item>}
                style={{ marginTop: "10px" }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Recommendations;
