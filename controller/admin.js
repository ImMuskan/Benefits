const { Router } = require("express");

const isAuth = require("../middleware/is-admin");
const adminServices = require("../services/admin");

const router = Router({ strict: true });

router.post("/login", adminServices.login);
router.get("/auth-admin", isAuth, adminServices.getAuthAdmin);
router.get("/users", isAuth, adminServices.getUsers);

module.exports = router;
