import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit); //covert limit from sting to number by '+'
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
};


let getAllDoctors = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctors();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.stattus(200).json({
            errCode: -1,
            message: 'Error from sever...'
        });
    }
}

let postInfoDoctors = async (req, res) => {
    try {
        let response = await doctorService.postInfoDoctors(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleDoctorByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let response = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
}

let sendRemedy = async (req, res) => {
    try {
        let response = await doctorService.sendRemedy(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        });
    }
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