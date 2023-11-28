import { Request, Response } from "express";
import Todo from "../Models/hack";
import { validationResult } from "express-validator";

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.getHacks();
    res.status(200).json( todos );
    console.log("working")
  } catch (error) {
    res.status(400).json({ message: "failed to load" });
  }
};

export const addHack = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "can't add empty todo" });
    return;
  }

  const { titrehack, imagehack, descriptionhack,telhack, datehack, locationhack } = req.body;

  try {
    const todo = new Todo(titrehack, imagehack, descriptionhack,telhack, datehack, locationhack);
    const todos = await todo.createHack();
    res.status(200).json({ message: "Successfully added", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to load" });
  }
};

export const updateHack = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "can't add empty todo" });
    return;
  }

  const { hackathonId } = req.params;
  const { titrehack, imagehack, descriptionhack,telhack, datehack, locationhack } = req.body;
  const todo = new Todo(titrehack, imagehack, descriptionhack,telhack, datehack, locationhack,hackathonId)
  try {
    const todos = await todo.updateHack();
    res.status(200).json({ message: "Successfully updated", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to edit" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { hackathonId } = req.params;
  try {
    const todos = await Todo.deleteHack(hackathonId);
    res.status(200).json({ message: "Successfully deleted", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to delete" });
  }
};
