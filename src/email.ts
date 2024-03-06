import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { WorkoutReminderEmail } from "./template/reminder";
import { AddReminderRequest } from "./generated/proto/gigachad/v1/reminder";

async function sendWorkoutReminder(payload: AddReminderRequest) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailHtml = render(WorkoutReminderEmail(payload));
  const emailtext = render(WorkoutReminderEmail(payload), { plainText: true });

  const options = {
    from: "reminder@gigachad.buzz",
    to: payload.email,
    subject: "Your Daily Workout Reminder",
    html: emailHtml,
    text: emailtext,
  };

  return await transporter.sendMail(options);
}

export { sendWorkoutReminder };
