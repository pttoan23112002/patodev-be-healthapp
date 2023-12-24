import db from "../models/index";
require('dotenv').config();
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

    return result;
}

let postPatientBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType
                || !data.fullName || !data.selectedGender || !data.address) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });

                //upsert
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                    }
                });
                // console.log('check user[0]:', user[0]);

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    });
                }

                resolve({
                    errCode: 0,
                    message: 'postPatientBookAppointment is succeed'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
};

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token && !data.doctorId) {
                resolve({
                    errCode: -1,
                    message: 'Missing required parameters'
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                });
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        message: 'Update the appointment is succeed'
                    });
                } else {
                    resolve({
                        errCode: 2,
                        message: 'Appointment has been actived or does not exist'
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    postPatientBookAppointment: postPatientBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}