const jwt = require("jsonwebtoken");
const JWT_SECRET = "GreenMartApp"; // process.env.JWT_SECRET

function createToken(user) {
  const payload = { id: user.userId, role: user.userRole };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.log("token verification failed:", err);
    return null;
  }
}

// JWT authentication middleware -- verify the JWT token
function jwtAuth(req, resp, next) {
  const nonProtectedPaths = [
    "/users/signin",
    "/users/signup",
    "/product/customer/get/by/pid",
    "/product/customer/all/categories",
    "/product/customer/bycategory",
    "/product/customer/byprice/price",
    "/product/customer/between",
    "/product/customer/allProducts/name"
  ];

  const isNonProtected = nonProtectedPaths.some(path =>
    req.path.startsWith(path)
  );

  if (isNonProtected) {
    return next();
  }

  const authHeader = req.headers.authorization;
  // console.log(authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return resp.status(403).send("Unauthorized Access - Invalid authorization header");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return resp.status(403).send("Unauthorized Access - Invalid token");
  }

  req.user = { id: decoded.id, role: decoded.role };
  next();
}


module.exports = {
  createToken,
  jwtAuth,
};
