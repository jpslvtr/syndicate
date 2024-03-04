// Remove unused imports
// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Adjusting string quotes and fixing indentation
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jktpark1@gmail.com",
        pass: "mguwawtdgbwmhlomi", // secure app password; requires two-step
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
