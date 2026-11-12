import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const token = authorization.slice(7).trim();

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token",
    });
  }

  try {
    // algorithms: ["HS256"] கட்டாயமாக்குவதன் மூலம் Algorithm Confusion தாக்குதலைத் தடுக்கலாம்
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (decoded.role !== "admin" || decoded.username !== process.env.ADMIN_USERNAME) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.admin = {
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}