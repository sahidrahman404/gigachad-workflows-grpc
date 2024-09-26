import { render } from "@react-email/render";
import nodemailer, { Transporter } from "nodemailer";
import { WorkoutReminderEmail } from "./template/reminder";
import { AddReminderRequest } from "./generated/proto/gigachad/v1/reminder";
import SMTPTransport from "nodemailer/lib/smtp-transport";

type SendEmailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

class Email {
  transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(options: SendEmailOptions) {
    return await this.transporter.sendMail(options);
  }

  async sendWorkoutReminder(payload: AddReminderRequest) {
    const emailHtml = render(WorkoutReminderEmail(payload));
    const emailtext = render(WorkoutReminderEmail(payload), {
      plainText: true,
    });

    return this.sendEmail({
      from: "Weekly Workout Reminder <reminder@wellup.fyi>",
      to: payload.email,
      subject: "Weekly Workout Reminder",
      html: emailHtml,
      text: emailtext,
    });
  }
}

export { Email };
