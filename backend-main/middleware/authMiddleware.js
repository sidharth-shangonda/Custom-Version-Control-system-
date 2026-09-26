const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"] || req.headers["token"];

  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied!" });
  }

  try {
    const bearerToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
}

module.exports = authMiddleware;
