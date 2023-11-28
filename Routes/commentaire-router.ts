import { Router } from "express";
import * as todoController from "../Controllers/commentaire-controller";
import { body } from "express-validator";

const comentrouter = Router();
const todoValidator = body("task").trim().notEmpty();

comentrouter.get("/get", todoController.getAllTodos);
comentrouter.post("/add", todoController.addTodo);
comentrouter.patch("/:todoId", todoValidator, todoController.updateTodo);
comentrouter.delete("/:todoId", todoController.deleteTodo);

export default comentrouter;
