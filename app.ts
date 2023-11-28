import express, { Application } from "express";
import confRouter from "./Routes/conf-router";
import hackRouter from "./Routes/hack-router";
import todoRouter from "./Routes/todo-router";
import postRouter from "./Routes/post-router"
import comentrouter from "./Routes/commentaire-router";
import todosRouter from "./Routes/blog-router";

import { Database } from "./database";


const multer = require('multer');
const path = require('path');

const app: Application = express();

app.use(express.json());

app.use("/conf", confRouter);
app.use("/hack", hackRouter);
app.use("/todo", todoRouter);
app.use("/post", postRouter);
app.use('/images', express.static(path.join(__dirname, 'src', 'images')));
app.use(express.json());

app.use("/blog", todosRouter);
app.use("/coment", comentrouter  );

databaseInit();

async function databaseInit() {
  await Database.initilize();
  app.listen(8000);
}
