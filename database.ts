import { MongoClient, Db } from "mongodb";

export class Database {
  private static mongoClient: MongoClient;

  private constructor() {}

  static async initilize() {
    this.mongoClient = await MongoClient.connect(
        "mongodb+srv://khalilmarzouki1:TmEazeZBMpV2udbY@cluster0.fhhzbgn.mongodb.net/"
        
            );
  }

  static getDb() {
    return this.mongoClient.db();
  }
}
//npm run dev:start:both
//        "mongodb+srv://khalilmarzouki1:TmEazeZBMpV2udbY@cluster0.fhhzbgn.mongodb.net/"
