import express from "express"
import { getCategoryExpenses, getMonthlyFlow, getSummary } from "../../controllers/dashboardController/dashboardController.js";
import verifyToken from "../../middlewares/auth.js";

const router = express.Router();

router.get("/getSummary", verifyToken, getSummary)
router.get("/getCategoryExpenses", verifyToken, getCategoryExpenses)
router.get("/getMonthlyFlow", verifyToken, getMonthlyFlow)


export default router