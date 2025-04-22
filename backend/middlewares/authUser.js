import jwt from "jsonwebtoken";

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    // Check if token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized! Please log in again.",
      });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);


    req.userId = tokenDecode.id;

    next(); 
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default authUser;