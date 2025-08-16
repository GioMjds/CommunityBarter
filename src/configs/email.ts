import nodemailer from "nodemailer";

export async function sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        }
    })
    
    const htmlTemplate = `
        <h1>Your OTP Code</h1>
        <p>Your OTP code is <strong>${otp}</strong></p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Verification Code - Community Barter",
        html: htmlTemplate,
        text: `
        Your OTP code is ${otp}
        `,
    }

    await transporter.sendMail(mailOptions);
}