import { deleteTodo } from "../Controllers/todo-controller";
import { Database } from "../database";
import { ObjectId, Db } from "mongodb";

class Entrep {
  id?: string;
  poste: string;
  nom: string;
  desc: string;
  salaire: number;
  type:string;
  logo: string;
  date: Date;

  constructor(poste: string, nom: string,desc: string,salaire:number,type:string,logo:string,date:Date, id?: string) {
    this.id = id;
    this.poste = poste;
    this.nom = nom;
    this.desc=desc;
    this.salaire=salaire;
    this.type=type;
    this.logo=logo;
    this.date=date;
  }

  async createTodo() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("entrep").insertOne({ ...this });
    const todos = await Entrep.getTodos();
    return todos;
  }

  static async getTodos() {
    const db: Db = Database.getDb();
    const documents = await db.collection("entrep").find().toArray();

    const todos: Entrep[] = documents.map(
      (doc) => new Entrep(doc.poste, doc.nom,doc.desc,doc.salaire,doc.type,doc.logo, doc.date,doc._id.toString())
    );
    return todos;
  }

  async updateTodo() {
    const db: Db = Database.getDb();
    await db
      .collection("entrep")
      .updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { poste: this.poste, nom: this.nom,desc: this.desc,salaire: this.salaire,type: this.type,logo: this.logo,date:this.date } }
      );

    const todos = await Entrep.getTodos();
    return todos;
  }

  static async deleteTodo(todoId: string) {
    const db: Db = Database.getDb();
    await db.collection("entrep").deleteOne({ _id: new ObjectId(todoId) });

    const todos = await Entrep.getTodos();
    return todos;
  }
}

export default Entrep;
