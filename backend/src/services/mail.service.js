import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html, text }) {
    try {
        console.log("USER:", process.env.GOOGLE_USER);
        console.log("PASS:", process.env.GOOGLE_APP_PASSWORD);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GOOGLE_USER,
                pass: process.env.GOOGLE_APP_PASSWORD
            }
        });

        const details = await transporter.sendMail({
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        });

        console.log("Email sent:", details.messageId);

    } catch (err) {
        console.log("EMAIL ERROR:", err);
    }
}