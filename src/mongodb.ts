import { Db, MongoClient } from "mongodb";

const mongoClient: MongoClient = new MongoClient("mongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000");

export async function connectToMongo(): Promise<void> {
  await mongoClient.connect();
}

const database: Db = mongoClient.db("test");
export default database;