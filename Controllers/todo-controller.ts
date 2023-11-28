import { Request, Response } from "express";
import Entrep from "../Models/todo";
import { validationResult } from "express-validator";

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Entrep.getTodos();
    res.status(200).json( todos );
  } catch (error) {
    res.status(400).json({ message: "failed to load" });
  }
};

export const addTodo = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "can't add empty todo" });
    return;
  }

  const { poste, nom,desc,salaire,type,logo,date } = req.body;

  try {
    const todo = new Entrep(poste, nom,desc,salaire,type,logo,date);
    const todos = await todo.createTodo();
    res.status(200).json({ message: "Successfully added", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to load" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "can't add empty todo" });
    return;
  }

  const { todoId } = req.params;
  const { poste, nom,desc,salaire,type,logo,date } = req.body;
  const todo = new Entrep(poste, nom,desc,salaire,type,logo,date, todoId);
  try {
    const todos = await todo.updateTodo();
    res.status(200).json({ message: "Successfully updated", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to edit" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { todoId } = req.params;
  try {
    const todos = await Entrep.deleteTodo(todoId);
    res.status(200).json({ message: "Successfully deleted", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to delete" });
  }
};
