import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true, // true only for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
//   tls: {
//     rejectUnauthorized: false, // ✅ allow self-signed cert
//   },
});

export async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"Domain Sales" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}