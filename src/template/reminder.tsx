import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { AddReminderRequest } from "../generated/proto/gigachad/v1/reminder";

function WorkoutReminderEmail({
  userLastName,
  workoutName,
  exercises,
  unit,
}: AddReminderRequest) {
  const weightUnit = unit !== 0 ? "lb" : "kg";
  return (
    <Html>
      <Head />
      <Preview>Log in with this magic link</Preview>
      <Body>
        <Container>
          <Text style={{ ...text }}>Hi {userLastName},</Text>
          <Text style={{ ...text }}>
            We hope you're ready to tackle another fantastic day of workouts and
            make progress towards your fitness goals! This email is to remind
            you about your weekly workout scheduled in our fitness tracking app.
            Get ready to sweat and push yourself to new heights!
          </Text>
          <Text style={{ ...text }}>Workout Details:</Text>
          <Heading as="h1" style={{ ...text }}>
            {workoutName}
          </Heading>
          {exercises.map(({ name, restTime, sets }) => {
            return (
              <Section key={name} style={{ marginTop: "16px" }}>
                <Heading as="h2" style={{ ...text, margin: "0" }}>
                  {name}
                </Heading>
                <Text style={{ ...text, marginTop: "0" }}>
                  Rest Time: {restTime === "" ? "-" : restTime}
                </Text>
                <Row>
                  <Column style={{ width: "25%", fontWeight: "bold" }}>
                    Sets
                  </Column>
                  <Column style={{ width: "25%", fontWeight: "bold" }}>
                    Reps
                  </Column>
                  <Column style={{ width: "25%", fontWeight: "bold" }}>
                    Weight
                  </Column>
                  <Column style={{ width: "25%", fontWeight: "bold" }}>
                    Duration
                  </Column>
                </Row>
                {sets.map(({ reps, weight, duration }, i) => {
                  return (
                    <Row style={{ marginTop: "12px" }} key={i}>
                      <Column style={{ width: "25%" }}>{i + 1}</Column>
                      <Column style={{ width: "25%" }}>
                        {reps === 0 ? "-" : reps}
                      </Column>
                      <Column style={{ width: "25%" }}>
                        {weight === 0 ? "-" : `${weight} ${weightUnit}`}
                      </Column>
                      <Column style={{ width: "25%" }}>
                        {duration === "" ? "-" : duration}
                      </Column>
                    </Row>
                  );
                })}
              </Section>
            );
          })}
          <Text style={{ ...text }}>
            Remember, consistency is key to achieving your fitness goals, and
            your commitment is inspiring. Take this opportunity to challenge
            yourself, improve your fitness level, and have fun during your
            workout session.
          </Text>
          <Text style={{ ...text }}>
            To make the most out of your workout, consider the following tips:
          </Text>
          <ol style={{ ...text }}>
            <li>Hydrate well before, during, and after your workout.</li>

            <li style={{ marginTop: "12px" }}>
              Wear comfortable workout attire and proper footwear.
            </li>

            <li style={{ marginTop: "12px" }}>
              Warm up adequately before starting your exercise routine.
            </li>

            <li style={{ marginTop: "12px" }}>
              Follow proper form and technique for each exercise.
            </li>

            <li style={{ marginTop: "12px" }}>
              Listen to your body and adjust the intensity as needed.
            </li>

            <li style={{ marginTop: "12px" }}>
              Cool down and stretch after your workout to aid in recovery.
            </li>
          </ol>
          <Text style={{ ...text }}>
            Keep up the amazing work, and let's make today's workout count!
          </Text>
          <Text style={{ ...text }}>Best regards, </Text>
          <Text style={{ ...text }}>The Gigachad team</Text>
        </Container>
      </Body>
    </Html>
  );
}

const text = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  lineHeight: "24px",
};

export { WorkoutReminderEmail };
