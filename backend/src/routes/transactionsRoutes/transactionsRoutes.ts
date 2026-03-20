import express from "express"
import verifyToken from "../../middlewares/auth.js";
import { createTransaction, readTransaction, deleteTransaction, updateTransaction } from "../../controllers/transactionsController/transactionsController.js";


const router = express.Router();

router.post("/createTransaction", verifyToken, createTransaction);
router.get("/readTransaction", verifyToken, readTransaction);
router.put("/updateTransaction/:id", verifyToken, updateTransaction);
router.delete("/deleteTransaction/:id", verifyToken, deleteTransaction);

export default router