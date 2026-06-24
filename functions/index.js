// Remove unused imports
// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Credentials are loaded from functions/.env (see functions/.env.example).
// EMAIL_PASS must be a Gmail app password (requires two-step verification).
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// eslint-disable-next-line max-len
exports.sendEmailToGroup = functions.https.onCall(async (data, context) => {
    const { memberEmails, content, senderEmail } = data;

    const mailOptions = {
        from: senderEmail,
        to: memberEmails.join(","),
        subject: "Newsletter from Bob Ross",
        html: content,
    };

    await transporter.sendMail(mailOptions);
});
