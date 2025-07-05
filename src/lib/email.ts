import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  baseUrl: string,
) => {
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

  await resend.emails.send({
    from: 'Simple Workout Tracker <no-reply@resend.dev>',
    to: email,
    subject: 'Password Reset Request',
    html: `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `,
  });
};
