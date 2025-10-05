import express from "express";
import { signUp, login } from "../controllers/userController.ts";

const router = express.Router();

router.post("/api/signup", signUp);
router.post("/api/login", login);

export default router;
