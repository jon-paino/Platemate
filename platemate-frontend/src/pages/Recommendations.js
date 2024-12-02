import React, { useState, useEffect } from "react";
import { Card, Typography, Row, Col } from "antd";
import { fetchEquipment, fetchWorkouts } from "../services/supabase";

const { Title, Text } = Typography;

function Recommendations() {
  const [equipmentInfo, setEquipmentInfo] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      const equipment = await fetchEquipment();
      const workouts = await fetchWorkouts();
      setEquipmentInfo(equipment);
      setWorkouts(workouts);
    };
  
    loadUserData();
  }, []);


  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Card */}
      <Card style={{ marginBottom: "20px", textAlign: "center" }}>
        <Title level={1}>Personalized Workouts</Title>
        <Text>
          These are the recommendations that you have received based on the equipment you have uploaded.
        </Text>
      </Card>

      <Card style={{ marginBottom: "20px", textAlign: "left" }}>
        {/* Equipment Info Display */}
        {equipmentInfo.length > 0 ? (
          <div style={{ marginTop: "20px" }}>
            <Title level={2}>Equipment</Title>
            <Row gutter={[16, 16]}>
              {equipmentInfo.map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card>
                    {item.error ? (
                      <Text style={{ color: "red" }}>{item.error}</Text>
                    ) : (
                      <>
                        <Title level={4}>{item.equipment_name}</Title>
                        <Text>{item.equipment_description}</Text>
                      </>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )
        : (
          <div style={{ marginTop: "20px" }}>
            <Title level={2}>Equipment</Title>
            <Text>
              No equipment detected. Please upload an image of your equipment to get recommendations.
            </Text>
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: "20px", textAlign: "left" }}>
      {/* Balanced Workout Suggestions */}
        {workouts.length > 0 ? (
          <div style={{ marginTop: "20px" }}>
            <Title level={2}>Workouts</Title>
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
                    <br />
                    <Text>
                      <strong>How to Perform:</strong> {workout.workout_description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )
        : (
          <div style={{ marginTop: "20px" }}>
            <Title level={2}>Workouts</Title>
            <Text>
              No workouts detected. Please upload an image of your equipment to get recommendations.
            </Text>
          </div>
        )}
      </Card>

    </div>
  );
}

export default Recommendations;
