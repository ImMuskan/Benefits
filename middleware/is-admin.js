const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("x-admin-auth-token");
  if (!token || token === "") {
    req.isAuth = false;
    return res.status(401).send("Authorization failed..");
  } else {
    let decoded;

    try {
      decoded = verify(token, "482d0829e5856b8340k3945p7487c5485x0940z");
    } catch (error) {
      req.isAuth = false;
      return res.status(401).send("Authorization failed..");
    }

    if (!decoded) {
      req.isAuth = false;
      return res.status(401).send("Authorization failed..");
    }

    if (decoded?.admin?.role !== 'admin') {
      req.isAuth = false;
      return res.status(401).send("Authorization failed..");
    }

    req.isAuth = true;
    req.admin = decoded.admin;
    return next();
  }
};
