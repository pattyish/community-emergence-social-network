// server.js
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// MIDDLEWARES
app.use(express.json()); // it is in the middle of the request and the response
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middlewares...
// Routes...

class SingleTon {
    constructor(instance) {
        if (!this.instance) {
            this.instance = instance;
        }
    }
    getInstance() {
        return this.instance;
    }
}

let app_export = new SingleTon(app);

module.exports = app_export.getInstance();
