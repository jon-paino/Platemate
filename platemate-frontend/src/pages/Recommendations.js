import React, { useState, useEffect } from "react";
import { Card, Typography, Row, Col, Button, message, Modal } from "antd";
import {
  fetchEquipment,
  fetchWorkouts,
  deleteEquipment,
  deleteWorkout,
  fetchEquipmentRecommendations,
} from "../services/supabase";

const { Title, Text } = Typography;

function Recommendations() {
  const [equipmentInfo, setEquipmentInfo] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [recommendations, setRecommendations] = useState(null); // Store recommendations
  const [loading, setLoading] = useState(false); // Loading state for recommendations

  useEffect(() => {
    const loadUserData = async () => {
      const equipment = await fetchEquipment();
      const workouts = await fetchWorkouts();
      setEquipmentInfo(equipment);
      setWorkouts(workouts);
    };

    loadUserData();
  }, []);

  const handleGetRecommendations = async () => {
    if (equipmentInfo.length === 0) {
      message.error("You need to upload equipment first.");
      return;
    }

    setLoading(true);
    message.loading({ content: "Fetching recommendations...", key: "recIndicator" });

    try {
      const equipmentNames = equipmentInfo.map((item) => item.equipment_name);
      const recommendations = await fetchEquipmentRecommendations(equipmentNames);
      setRecommendations(recommendations); // Save recommendations
      message.success({ content: "Recommendations fetched successfully!", key: "recIndicator" });
    } catch (error) {
      message.error({ content: "Failed to fetch recommendations.", key: "recIndicator" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Card */}
      <Card style={{ marginBottom: "20px", textAlign: "center" }}>
        <Title level={1}>Personalized Workouts</Title>
        <Text>
          These are the recommendations that you have received based on the equipment you have uploaded.
        </Text>
        <br />
        <Button
          type="primary"
          onClick={handleGetRecommendations}
          loading={loading}
          style={{ marginTop: "20px" }}
        >
          Get Equipment Recommendations
        </Button>
      </Card>

      {/* Equipment Recommendations Modal */}
      {recommendations && (
        <Modal
          title="Equipment Recommendations"
          visible={!!recommendations}
          onCancel={() => setRecommendations(null)}
          footer={[
            <Button key="close" onClick={() => setRecommendations(null)}>
              Close
            </Button>,
          ]}
        >
          <Text>{recommendations}</Text>
        </Modal>
      )}

      {/* Equipment Section */}
      <Card style={{ marginBottom: "20px", textAlign: "left" }}>
        {equipmentInfo.length > 0 ? (
          <div style={{ marginTop: "20px" }}>
            <Title level={2}>Equipment</Title>
            <Row gutter={[16, 16]}>
              {equipmentInfo.map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    extra={
                      <Button
                        type="text"
                        danger
                        onClick={() => deleteEquipment(item.id)}
                      >
                        X
                      </Button>
                    }
                  >
                    <Title level={4}>{item.equipment_name}</Title>
                    <Text>{item.equipment_description}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <Text>No equipment detected. Please upload some images to get recommendations.</Text>
        )}
      </Card>

      {/* Workouts Section */}
      <Card style={{ marginBottom: "20px", textAlign: "left" }}>
        {workouts.length > 0 ? (
          <div style={{ marginTop: "20px" }}>
            <Title level={2}>Workouts</Title>
            <Row gutter={[16, 16]}>
              {workouts.map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    extra={
                      <Button
                        type="text"
                        danger
                        onClick={() => deleteWorkout(item.id)}
                      >
                        X
                      </Button>
                    }
                  >
                    <Title level={4}>{item.workout_name}</Title>
                    <Text>
                      <strong>Muscles Targeted:</strong> {item.muscles_targeted.join(", ")}
                    </Text>
                    <br />
                    <Text>
                      <strong>Equipment Required:</strong> {item.equipment_required.join(", ")}
                    </Text>
                    <br />
                    <Text>
                      <strong>How to Perform:</strong> {item.workout_description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <Text>No workouts detected. Please upload some images to get recommendations.</Text>
        )}
      </Card>
    </div>
  );
}

export default Recommendations;
