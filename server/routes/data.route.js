import express from "express";
import { getData, postData } from "../controllers/data.controllers.js";

export const dataRouter = async () => {
  const router = express.Router();

  router.get("/get", getData);
  router.post("/post", postData);

  return router;
};