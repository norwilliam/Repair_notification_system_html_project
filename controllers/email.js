const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendNotificationEmail = () => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: '652021048@tsu.ac.th',
        subject: 'แจ้งเตือนการส่งคำร้องแจ้งซ่อมใหม่',
        text: 'มีคำร้องแจ้งซ่อมเข้ามาใหม่ สามารถตรวจสอบได้ที่ http://localhost:3000/reportedit.html'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const sendNotificationEmail2 = () => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: '652021048@tsu.ac.th',
        subject: 'แจ้งเตือนการเปลี่ยนแปลงสถานะคำร้องแจ้งซ่อม',
        text: 'คำร้องแจ้งซ่อมของคุณมีปรับเปลี่ยนสถานะ สามารถตรวจสอบได้ที่ http://localhost:3000/dashboard.html'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { sendNotificationEmail, sendNotificationEmail2 };
