import { deleteTodo } from "../Controllers/hack-controller";
import { Database } from "../database";
import { ObjectId, Db } from "mongodb";

class Todo {
  id?: string;
  titrehack: string;
  imagehack: string;
  descriptionhack: string;
  telhack: number;
  datehack: Date;
  locationhack: string;
  //

  constructor(titrehack: string, imagehack: string, descriptionhack: string,telhack:number,datehack: Date,locationhack: string, id?: string) {
    this.id = id;
    this.titrehack = titrehack;
    this.imagehack = imagehack;
    this.descriptionhack = descriptionhack;
    this.telhack = telhack;
    this.datehack = datehack;
    this.locationhack = locationhack;
    //
  }

  async createHack() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("hackathon").insertOne({ ...this });
    const todos = await Todo.getHacks();
    return todos;
  }

  static async getHacks() {
    const db: Db = Database.getDb();
    const documents = await db.collection("hackathon").find().toArray();

    const todos: Todo[] = documents.map(
      (doc) => new Todo(doc.titrehack, doc.imagehack,doc.descriptionhack,doc.telhack,doc.datehack,doc.locationhack, doc._id.toString())
    );
    return todos;
  }

  async updateHack() {
    const db: Db = Database.getDb();
    await db
      .collection("hackathon")
      .updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { titrehack: this.titrehack, imagehack: this.imagehack, descriptionhack: this.descriptionhack, telhack: this.telhack, datehack:this.datehack, locationhack:this.locationhack } } //
      );

    const todos = await Todo.getHacks();
    return todos;
  }

  static async deleteHack(hackathonId: string) {
    const db: Db = Database.getDb();
    await db.collection("hackathon").deleteOne({ _id: new ObjectId(hackathonId) });

    const todos = await Todo.getHacks();
    return todos;
  }
}

export default Todo;
