import { Request, Response } from "express";
import Post from "../Models/post";
import { validationResult } from "express-validator";

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Post.getTodos();
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

  const { datee, nom,desc,logo } = req.body;

  try {
    const todo = new Post( datee,nom,desc,logo);
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

  const { postId } = req.params;
  const {  datee,nom,desc,logo } = req.body;
  const todo = new Post( nom,desc,logo, postId);
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
    const todos = await Post.deleteTodo(todoId);
    res.status(200).json({ message: "Successfully deleted", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to delete" });
  }
};
