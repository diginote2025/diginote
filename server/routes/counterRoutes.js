import express from "express";
import { create, increment, decrement } from "../controllers/counterControllers.js";

const router = express.Router();

router.get("/", create);
router.post("/increment", increment);
router.post("/decrement", decrement);

export default router;
