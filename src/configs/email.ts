import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const htmlTemplate = `
    
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification Code - Community Barter',
        html: htmlTemplate,
        text: `
        
        `,
    };

    await transporter.sendMail(mailOptions);
}
