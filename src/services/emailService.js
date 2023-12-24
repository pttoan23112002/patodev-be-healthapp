require('dotenv').config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, //465
        secure: false, //true
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        },
    });

    let info = await transporter.sendMail({
        from: '"Pato dev 👻" <pttoan2311200221pm@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend)
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = [];
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName},</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online tại Healthy App</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

            <p>Nếu các thông tin trên đúng, vui lòng truy cập vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh!</p>
            <div><a href=${dataSend.redirectLink} target='_blank'>Nhấn vào đây!</a> </div>
            <br/>
            <div>Đội ngũ y tế Healthy App, xin chân thành cảm ơn ✔</div>`;
    }
    if (dataSend.language === 'en') {
        result = `<h3>Hi ${dataSend.patientName},</h3>
            <p>You received this email because you made an online medical appointment at Healthy App</p>
            <p>Information for scheduling medical examination:</p>
            <div><b>At: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>

            <p>If the above information is correct, please visit the link below to confirm and complete the medical appointment procedure!</p>
            <div><a href=${dataSend.redirectLink} target='_blank'>Click here!</a></div>
            <br/>
            <div>Healthy App medical team, thank you very much ✔</div>`
    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = [];
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName},</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online tại Healthy App, thành công!</p>
            <p>Thông tin hoá đơn được gửi trong file đính kèm:</p>
            <div>Đội ngũ y tế Healthy App, xin chân thành cảm ơn ✔</div>`;
    }
    if (dataSend.language === 'en') {
        result = `<h3>Hi ${dataSend.patientName},</h3>
            <p>You received this email because you made an online medical appointment at Healthy App, success!</p>
            <p>Invoice information is sent in the attached file:</p>
            <div>Healthy App medical team, thank you very much ✔</div>`
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, //465
        secure: false, //true
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        },
    });

    let info = await transporter.sendMail({
        from: '"Pato dev 👻" <pttoan2311200221pm@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            { // use URL as an attachment
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.jpg`,
                content: dataSend.imageBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    });
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}