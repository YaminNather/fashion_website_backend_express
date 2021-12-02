import { Db, MongoClient } from "mongodb";

// const mongoClient: MongoClient = new MongoClient("mongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000");
const uri = "mongodb+srv://Admin:%23GomaalaPunda06@cluster0.rbh2g.mongodb.net/database?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri);

export async function connectToMongo(): Promise<void> {
  await mongoClient.connect();
}

// const database: Db = mongoClient.db("test");
const database: Db = mongoClient.db("database");

export default database;