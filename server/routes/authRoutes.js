import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected route example
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", userId: req.userId });
});


export default router;
