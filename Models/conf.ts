import { deleteTodo } from "../Controllers/conf-controller";
import { Database } from "../database";
import { ObjectId, Db } from "mongodb";

class Todo {
  id?: string;
  titre: string;
  image: string;
  description: string;
  prix: number;
  tel: number;
  date: Date;
  location: string;
  //

  constructor(titre: string, image: string, description: string,prix:number,tel:number,date: Date,location: string, id?: string) {
    this.id = id;
    this.titre = titre;
    this.image = image;
    this.description = description;
    this.prix = prix;
    this.tel=tel;
    this.date=date;
    this.location=location;
    //
  }

  async createTodo() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("conference").insertOne({ ...this });
    const todos = await Todo.getTodos();
    return todos;
  }

  static async getTodos() {
    const db: Db = Database.getDb();
    const documents = await db.collection("conference").find().toArray();

    const todos: Todo[] = documents.map(
      (doc) => new Todo(doc.titre, doc.image,doc.description,doc.prix,doc.tel,doc.date,doc.location, doc._id.toString())
    );
    return todos;
  }

  async updateTodo() {
    const db: Db = Database.getDb();
    await db
      .collection("conference")
      .updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { titre: this.titre, image: this.image, description: this.description, prix: this.prix, tel: this.tel, date:this.date, location:this.location } } //
      );

    const todos = await Todo.getTodos();
    return todos;
  }

  static async deleteTodo(conferenceId: string) {
    const db: Db = Database.getDb();
    await db.collection("conference").deleteOne({ _id: new ObjectId(conferenceId) });

    const todos = await Todo.getTodos();
    return todos;
  }
}

export default Todo;
