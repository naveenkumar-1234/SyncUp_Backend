import { Router } from "express";
import { getRoomsOfUser } from "../service/user.service";



const router = Router();

router.get("/:userId/rooms",getRoomsOfUser);


export default router;