require('dotenv').config();
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const OAuth2 = google.auth.OAuth2;

// Gunakan nama environment variable yang konsisten
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // Redirect URI wajib
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    // Dapatkan access token
    const { token: accessToken } = await oauth2Client.getAccessToken();

    if (!accessToken) {
      throw new Error('Failed to get access token');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_SENDER_EMAIL, // Gunakan env var
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    await transporter.sendMail({
      from: `"E-Commerce" <${process.env.GOOGLE_SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email error:', error);
    throw new Error(
      `Email failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};
