import express from "express"
import verifyToken from "../../middlewares/auth.js";
import { createCategorie, deleteCategories, readCategories, updateCategories } from "../../controllers/categoriesController/categoriesController.js";

const router = express.Router();


router.post("/createCategorie", verifyToken, createCategorie);
router.get("/readCategories", verifyToken, readCategories);
router.put("/updateCategories/:id", verifyToken, updateCategories);
router.delete("/deleteCategories/:id", verifyToken, deleteCategories);

export default router