import db from "../models";

let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address
                || !data.descriptionMarkDown
                || !data.descriptionHTML
                || !data.imageBase64) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionMarkDown: data.descriptionMarkDown,
                    descriptionHTML: data.descriptionHTML,
                    image: data.imageBase64
                });
                resolve({
                    errCode: 0,
                    message: 'Create new clinic success'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                });
            }
            resolve({
                errCode: 0,
                message: 'Get all clinic success',
                data: data
            });
        } catch (error) {
            reject(error);
        }
    });
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkDown']
                });
                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Info.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId']
                    });

                    data.doctorClinic = doctorClinic;
                } else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    message: 'getDetailClinicById success',
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    createNewClinic: createNewClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById
}