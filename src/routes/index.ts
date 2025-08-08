import { Router } from "express";
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
const router = Router();


router.use("/api",authRoutes)
router.use("/api/user",userRoutes)

export default router;