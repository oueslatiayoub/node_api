import { Request, Response } from "express";
import Todo from "../Models/conf";
import { validationResult } from "express-validator";

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.getTodos();
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

  const { titre, image, description,prix, tel, date, location } = req.body;

  try {
    const todo = new Todo(titre, image, description,prix, tel, date, location);
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

  const { conferenceId } = req.params;
  const { titre, image, description,tel, prix, date, location } = req.body;
  const todo = new Todo(titre, image, description,tel, prix, date, location,conferenceId)
  try {
    const todos = await todo.updateTodo();
    res.status(200).json({ message: "Successfully updated", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to edit" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { conferenceId } = req.params;
  try {
    const todos = await Todo.deleteTodo(conferenceId);
    res.status(200).json({ message: "Successfully deleted", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to delete" });
  }
};


