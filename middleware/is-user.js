const { verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("x-user-auth-token");
  if (!token || token === "") {
    req.isAuth = false;
    return res.status(401).send("Authorization failed..1");
  } else {
    let decoded;

    try {
      decoded = verify(token, "482d0829e5856b8340k3945p7487c5485x0940z");
      
    } catch (error) {
      console.log("482d0829e5856b8340k3945p7487c5485x0940z")
      console.log("JWT Verification Error:", error.message);
      req.isAuth = false;
      return res.status(401).send("Authorization failed..2");
    }

    if (!decoded) {
      req.isAuth = false;
      return res.status(401).send("Authorization failed..3");
    }

    if (decoded?.user?.role !== 'user') {
      req.isAuth = false;
      return res.status(401).send("Authorization failed..4");
    }

    req.isAuth = true;
    req.user = decoded.user;
    req.userData = decoded;
    return next();
  }
};