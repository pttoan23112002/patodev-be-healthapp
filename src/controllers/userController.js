import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // Check email exist
    // compare password
    // return userInfo
    // access_token: JWT

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!',
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    console.log(userData);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // ALL, Id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters',
        });
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        users
    });
};

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
    let message = await userService.updateUser(req.body);
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters!'
        });
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let getAllCode = async (req, res) => {
    try {
        setTimeout(async () => {
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json(data);
        }, 1000)
    } catch (error) {
        console.log('Get all code:', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode
};