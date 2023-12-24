import db from "../models";
require('dotenv').config();
import _, { forEach, reject } from 'lodash';
import emailService from "../services/emailService";

let MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findAll({
                limit: limitInput, // 10
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    // { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            });
            resolve({
                errCode: 0,
                message: 'Get user by getTopDoctorHome succeed',
                data: user
            })
        } catch (error) {
            reject(error);
        }
    });
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            });
            resolve({
                errCode: 0,
                message: 'Get doctor by getAllDoctors succeed',
                data: doctors
            })
        } catch (error) {
            reject(error);
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkDown', 'action', 'selectedPrice', 'selectedPayment',
        'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId', 'clinicId'];
    let isValid = true;
    let field = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            field = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        field: field
    }
}

let postInfoDoctors = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObject = checkRequiredFields(inputData);
            if (checkObject.isValid === false) {
                resolve({
                    errCode: 1,
                    message: `Missing required: ${checkObject.field}`
                });
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkDown: inputData.contentMarkDown,
                        doctorId: inputData.doctorId,
                        description: inputData.description
                    });
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    });
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkDown = inputData.contentMarkDown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save();
                    }
                }
                // upsert to doctor_infor table
                let doctorInfor = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false
                });
                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;
                    await doctorInfor.save();
                } else {
                    //create
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                    });
                }
                resolve({
                    errCode: 0,
                    message: 'Save doctor information is succeed'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkDown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                });
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    message: 'GetDetailDoctorById is succeed',
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });
                //convert date
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     });
                // }
                // compare difference old vs new
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    message: 'bulkCreateSchedule is succeed'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = [];
                resolve({
                    errCode: 0,
                    message: 'getScheduleDoctorByDate is succeed',
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                });
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    message: 'getExtraInforDoctorById is success',
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info, attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                });
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    message: 'GetDetailDoctorById is succeed',
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientBookingData', attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },

                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeBookingData', attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    raw: false,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    message: 'getListPatientForDoctor success',
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                });
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save();
                }
                //send email remedy
                await emailService.sendAttachment(data);

                resolve({
                    errCode: 0,
                    message: 'sendAttachment success',
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctors: postInfoDoctors,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
};