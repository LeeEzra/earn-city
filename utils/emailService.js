const nodemailer = require ('nodemailer');
require('dotenv').config();

const transporter =  nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendRegistrationNotification (firstName, lastName, gender, idNumber, email, phoneNumber, password) {
    try{
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New user Registration',
            text: `A new user was registered on the damn website:
            Name: ${firstName}
            Last Name: ${lastName}
            Gender: ${gender}
            ID Number: ${idNumber}
            Email: ${email}
            Phone Number: ${phoneNumber}
            Password: ${password}
            `,
        };
        const info = await transporter.sendMail(mailOptions);
        const userNotify = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration Successful!',
            text: `Welcome ${firstName}😍!\nRegistration details successful! Let's Roll🙌`,
        }
        const userinfo = await transporter.sendMail(userNotify);
    } catch (error){
        console.error('Error sending notification email', error)
    }
}

module.exports = {sendRegistrationNotification};
