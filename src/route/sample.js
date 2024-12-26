import { Router } from "express";
import { sampleController } from "../controller/sample.js";


const router = Router();


router.get('/sample', sampleController)

export default router;