import express from 'express'; // var express = require('express'); Cú pháp cũ

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
}

module.exports = configViewEngine;