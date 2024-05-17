const { Router } = require("express");

const adminServices = require("../services/admin");

const isAuth = require("../middleware/is-admin");
const router = Router({ strict: true });

router.get("/auth-admin", isAuth, adminServices.getAuthAdmin);
router.post("/login", adminServices.login);
router.get("/users", adminServices.getUsers);
router.post("/register", adminServices.register);
router.post("/addbenefits", adminServices.addbenefits);
module.exports = router;
