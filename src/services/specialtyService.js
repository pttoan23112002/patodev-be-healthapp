import db from "../models";

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkDown) {
                resolve({
                    errCode: 1,
                    message: 'Missing required paramters'
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkDown: data.descriptionMarkDown
                });
                resolve({
                    errCode: 0,
                    message: 'Create new specialty is succeed'
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
                resolve({
                    errCode: 0,
                    message: 'Get all specialty is success',
                    data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let getDetailSpecialtyById = (inputId, inputLocation) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !inputLocation) {
                resolve({
                    errCode: -1,
                    message: 'Missing required parameters'
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkDown']
                });
                if (data) {
                    let doctorSpecialty = [];
                    if (inputLocation === 'ALL') {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: inputId
                            },
                            attributes: ['doctorId', 'provinceId']
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: inputLocation
                            },
                            attributes: ['doctorId', 'provinceId']
                        });
                    }
                    data.doctorSpecialty = doctorSpecialty;
                } else {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    message: 'getDetailSpecialtyById',
                    data: data
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}