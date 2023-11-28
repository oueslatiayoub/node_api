import { Router } from "express";
import * as todoController from "../Controllers/hack-controller";
import { body } from "express-validator";

const router = Router();
const todoValidator = body("task").trim().notEmpty();

router.get("/ha", todoController.getAllTodos);
router.post("/hackathon", todoController.addHack);
router.patch("/:hackathonId", todoController.updateHack);
router.delete("/:hackathonId", todoController.deleteTodo);

export default router;
