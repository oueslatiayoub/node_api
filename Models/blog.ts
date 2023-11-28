import { deleteTodo } from "../Controllers/blog-controller";
import { Database } from "../database";
import { ObjectId, Db } from "mongodb";

class Blog {
  id?: string;
  titre: string;
  description: string;
  image: string;
  date: Date;



  constructor(titre: string,description: string, image: string,  date: Date, id?: string){
    this.id = id;
    this.titre = titre;
    this.description = description;
    this.image = image;
    this.date = new Date();
  }
  


  async createTodo() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("blog").insertOne({ ...this });
    const todos = await Blog.getTodos();
    return todos;
  }

  static async getTodos() {
    const db: Db = Database.getDb();
    const documents = await db.collection("blog").find().toArray();

    const todos: Blog[] = documents.map(
      (doc) => new Blog(doc.titre,  doc.description, doc.image, doc.date , doc._id.toString())
    );
    return todos;
  }

  async updateTodo() {
    const db: Db = Database.getDb();
    await db
      .collection("blog")
      .updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { titre: this.titre, description:this.description, image:this.image, date:this.date    }}
      );

    const todos = await Blog.getTodos();
    return todos;
  }

  static async deleteTodo(todoId: string) {
    const db: Db = Database.getDb();
    await db.collection("blog").deleteOne({ _id: new ObjectId(todoId) });

    const todos = await Blog.getTodos();
    return todos;
  }
}

export default Blog;
