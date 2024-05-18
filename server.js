const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
require("colors");

const db = require("./config/db");
const app = express();
const cors = require('cors');
app.use(cors());
dotenv.config({ path: "./config/.env" });

if (process.env.NODE_ENV === "production") console.log = function () { };

if (process.env.NODE_ENV === "development") app.use(logger("dev"));

db(app);

const { User, Benefits } = require("./models/User");
const { Admin, RequestBenefitSchema} = require("./models/admin");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/user", require("./controller/user"));
app.use("/api/v1/admin", require("./controller/admin"));


User.createCollection().then(() => {
    console.log("User model created!");
}).catch(err => {
    console.error("Error creating User model:", err);
});
Benefits.createCollection().then(() => {
    console.log("Benefits model created!");
}).catch(err => {
    console.error("Error creating User model:", err);
})
Admin.createCollection().then(() => {
    console.log("Admin model created!");
}).catch(err => {
    console.error("Error creating User model:", err);
})
RequestBenefitSchema.createCollection().then(() => {
    console.log("Requestbenefit model created!");
}).catch(err => {
    console.error("Error creating User model:", err);
})
module.exports = app;
