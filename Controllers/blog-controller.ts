import { Request, Response } from "express";
import Todo from "../Models/blog";
import { validationResult } from "express-validator";
import { request } from "http";


const multer = require('multer');
const path = require('path');


// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any)  {
    cb(null, './src/images/');
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single('image'); // Single file upload with field name 'image'

export const addTodo = async (req: any, res: any) => {
  // Handle JSON and file upload in the same endpoint
  // Multer middleware handles file upload
  upload(req, res, async (err: any) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ message: 'Error uploading file' });
    }
    // Access JSON data from req.body
    const { titre, description, date } = req.body;
    // Access uploaded file details from req.file
    const image = req.file ? req.file.filename : '';

    try {
      const todo = new Todo(titre, description, image, date);
      const todos = await todo.createTodo();
      res.status(200).json({ message: 'Successfully added', todos: todos });
    } catch (error) {
      res.status(400).json({ message: 'Failed to load' });
    }
  });
};



export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.getTodos();
    res.status(200).json(todos );
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
  const { titre,description,image,date } = req.body;
  const todo = new Todo(titre, description, image, date, todoId);
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
    const todos = await Todo.deleteTodo(todoId);
    res.status(200).json({ message: "Successfully deleted", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to delete" });
  }
};
