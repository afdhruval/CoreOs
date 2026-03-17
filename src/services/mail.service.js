import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});

transporter.verify()
    .then(() => {
        console.log("email transporter is rteady to send an email");
    })
    .catch(() => {
        console.log("email transporter verification failed");
    })

export async function sendEmail({ to, subject, html, text }) {
    try {
        console.log("EMAIL START");

        const details = await transporter.sendMail({
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text,
        });

        console.log("EMAIL SUCCESS", details);

    } catch (err) {
        console.log("EMAIL FAILED:", err);
    }
}