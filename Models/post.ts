import { deleteTodo } from "../Controllers/todo-controller";
import { Database } from "../database";
import { ObjectId, Db } from "mongodb";

class Post {
  id?: string;
  nom: string;
  desc: string;

  logo: string;

  constructor( nom: string,desc: string,logo:string, id?: string) {
    this.id = id;
    this.nom = nom;
    this.desc=desc;
    
    this.logo=logo;
  }

  async createTodo() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("Post").insertOne({ ...this });
    const todos = await Post.getTodos();
    return todos;
  }

  static async getTodos() {
    const db: Db = Database.getDb();
    const documents = await db.collection("Post").find().toArray();

    const todos: Post[] = documents.map(
      (doc) => new Post( doc.nom,doc.desc,doc.logo, doc._id.toString())
    );
    return todos;
  }

  async updateTodo() {
    const db: Db = Database.getDb();
    await db
      .collection("Post")
      .updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { nom: this.nom,desc: this.desc,logo: this.logo } }
      );

    const todos = await Post.getTodos();
    return todos;
  }

  static async deleteTodo(todoId: string) {
    const db: Db = Database.getDb();
    await db.collection("Post").deleteOne({ _id: new ObjectId(todoId) });

    const todos = await Post.getTodos();
    return todos;
  }
}

export default Post;
