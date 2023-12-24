import patientService from "../services/patientService";

let postPatientBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postPatientBookAppointment(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
};

let postVerifyBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

module.exports = {
    postPatientBookAppointment: postPatientBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}