import db from '../models/index';
import bcryptjs from 'bcryptjs';

const salt = bcryptjs.genSaltSync(10);

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    let check = await bcryptjs.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = `OK`;
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = `Wrong password`;
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist in your system. Plz try other email`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (userId === 'ALL') {
                let getAll = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
                resolve(getAll);
            }
            if (userId && userId !== 'ALL') {
                let getId = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
                resolve(getId);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcryptjs.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email first
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already in used, Plz try other email!'
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    positionId: data.positionId,
                    roleId: data.roleId,
                    image: data.image
                });
                resolve({
                    errCode: 0,
                    message: 'OK'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.gender || !data.positionId || !data.roleId) {
                resolve({
                    errCode: 2,
                    message: `Missing required parameters`
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.phoneNumber = data.phoneNumber;
                user.address = data.address;
                user.gender = data.gender;
                user.positionId = data.positionId;
                user.roleId = data.roleId;
                if (data.image) {
                    user.image = data.image;
                }

                await user.save();

                /* 
                await db.User.save({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    gender: data.gender,
                    positionId: data.positionId,
                    roleId: data.roleId,
                    image: data.image
                }, { where: { id: data.id } });
                 */
                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!'
                });
            } else {
                resolve({
                    errCode: 1,
                    message: `User not found!`
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    message: `User not found!`
                });
            }
            await db.User.destroy({
                where: { id: userId }
            });
            resolve({
                errCode: 0,
                message: `OK`
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters!'
                });
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.message = 'Get data from AllCode is completed!'
                res.data = allcode;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService
};