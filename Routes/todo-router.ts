import { Router } from "express";
import * as todoController from "../Controllers/todo-controller";
import { body } from "express-validator";

const router = Router();
const todoValidator = body("task").trim().notEmpty();

router.get("/todos", todoController.getAllTodos);
router.post("/todo", todoController.addTodo);
router.patch("/:todoId", todoController.updateTodo);
router.delete("/:todoId", todoController.deleteTodo);

export default router;
