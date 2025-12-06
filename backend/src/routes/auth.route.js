import express from "express";
import { checkAuth, logIn, logOut, signUp, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", logIn);

router.post("/logout", logOut);

router.put("/update-profile", protectedRoute, updateProfile);

router.get("/check-auth", protectedRoute, checkAuth);

export default router;
