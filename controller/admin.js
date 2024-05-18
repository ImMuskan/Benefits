const { Router } = require("express");

const adminServices = require("../services/admin");

const isAuth = require("../middleware/is-admin");
const admin = require("../models/admin");
const router = Router({ strict: true });

router.get("/auth-admin", isAuth, adminServices.getAuthAdmin);
router.post("/login", adminServices.login);
router.get("/users", adminServices.getUsers);
router.get("/getForms", adminServices.getForms);
router.post("/register", adminServices.register);
router.post("/addbenefits", adminServices.addbenefits);
router.delete("/deleteUser",adminServices.deleteUser);
router.delete("/deletebenefit",adminServices.deletebenefit);
router.delete("/deleteform",adminServices.deleteform);
router.put("/deleteben",adminServices.deleteben);
router.put("/addapprove", adminServices.addapprove);

module.exports = router;
