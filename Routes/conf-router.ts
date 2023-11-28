import { Router } from "express";
import * as todoController from "../Controllers/conf-controller";
import { body } from "express-validator";

const router = Router();
const todoValidator = body("task").trim().notEmpty();

router.get("/conferences", todoController.getAllTodos);
router.post("/conference", todoController.addTodo);
router.patch("/:conferenceId", todoController.updateTodo);
router.delete("/:conferenceId", todoController.deleteTodo);


export default router;
