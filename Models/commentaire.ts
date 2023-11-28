import { deleteTodo } from "../Controllers/commentaire-controller";
import { Database } from "../database";
import { ObjectId, Db } from "mongodb";

class Todo {
  id?: string;
  user: String;
  coment: String;
  date: Date;



  constructor(user: string, coment: string, date: Date, id?: string){
    this.id = id;
    this.user = user;
    this.coment = coment;
    this.date = date;
  }
  


  async createTodo() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("coment").insertOne({ ...this });
    const todos = await Todo.getTodos();
    return todos;
  }

  static async getTodos() {
    const db: Db = Database.getDb();
    const documents = await db.collection("coment").find().toArray();

    const todos: Todo[] = documents.map(
      (doc) => new Todo( doc.coment, doc.user, doc.date , doc._id.toString() )
    );
    return todos;
  }

  async updateTodo() {
    const db: Db = Database.getDb();
    await db
      .collection("coment")
      .updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { user: this.user, coment:this.coment, date:this.date    }}
      );

    const todos = await Todo.getTodos();
    return todos;
  }

  static async deleteTodo(todoId: string) {
    const db: Db = Database.getDb();
    await db.collection("coment").deleteOne({ _id: new ObjectId(todoId) });

    const todos = await Todo.getTodos();
    return todos;
  }
}

export default Todo;
