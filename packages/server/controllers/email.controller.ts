import nodemailer from "nodemailer";

type SendInviteEmailParams = {
  to: string;
  link: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true if using 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendInviteEmail = async ({ to, link }: SendInviteEmailParams) => {
  await transporter.sendMail({
    from: `"EMS" <${process.env.SMTP_USER}>`,
    to,
    subject: "You're invited to join",
    html: `
        <div style="font-family: Arial, sans-serif;">
            <h2>You're invited</h2>
            <p>Click the link below to set your password and activate your account.</p>
            <a href="${link}" 
            style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
            Create Password
            </a>
            <p>If you didn’t expect this, you can ignore this email.</p>
        </div>
        `,
  });
};
