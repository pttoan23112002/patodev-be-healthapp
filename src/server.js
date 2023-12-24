import express from "express";
import bodyParser from "body-parser"; // lấy params số từ client
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
// import cors from "cors";
require('dotenv').config();

let app = express();
// middleware / cors
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// config app
// app.use(cors({ credentials: true, origin: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

viewEngine(app);
initWebRoutes(app);

connectDB.connectDB();

let port = process.env.port || 6969;

app.listen(port, () => {
    console.log("Backend nopdejs is running on the port : " + port);
})
