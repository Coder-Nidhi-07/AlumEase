// // middlewares/authMiddleware.js
// import jwt from "jsonwebtoken";
// import Admin from "../models/adminModel.js";

// export const protectAdmin = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Attach decoded ID
//       req.admin = { id: decoded.id };

//       next();
//     } catch (err) {
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }
// };


// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Ensure Authorization header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token email matches the actual admin email in .env
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Attach admin info to request
    req.admin = { email: decoded.email };

    next();

  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
