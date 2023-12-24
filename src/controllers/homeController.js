import db from '../models/index';
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render("homePage.ejs", {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }
};

let getAboutPage = (req, res) => {
    return res.render("test/aboutPage.ejs");
};

let getCrud = (req, res) => {
    return res.render("crud.ejs");
};

let postCrud = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send("post-crud from homeController");
};

let displayGetCrud = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render("displayCRUD.ejs", {
        dataTable: data
    });
};

let getEditCrud = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render("editCRUD.ejs", {
            user: userData
        });
    }
    else {
        return res.send("Users not found!");
    }
}

let putCrud = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render("displayCRUD.ejs", {
        dataTable: allUsers
    });
};

let deleteCrud = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send("Deleted the user succeed!");
    } else {
        return res.send("User not found!");
    }

};

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCrud: getCrud,
    postCrud: postCrud,
    displayGetCrud: displayGetCrud,
    getEditCrud: getEditCrud,
    putCrud: putCrud,
    deleteCrud: deleteCrud
};
