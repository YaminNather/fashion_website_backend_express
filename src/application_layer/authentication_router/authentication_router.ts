import Express from "express";
import { Document, InsertOneResult } from "mongodb";
import database from "../../mongodb";
import SignupResponse from "./signup_response";

const authenticationRouter: Express.Router = Express.Router();

function validateEmail(email: string): boolean {
  if(email.search(/@/) == -1)
    return false;
    
  return true;
}

function validatePassword(password: string): boolean {
  return password.length >= 6 && password.length <= 20;
}


authenticationRouter.post(
  "/signup",
  async (req, res) => {
    var email: string = req.query["email"] as string;
    email = email.trim();
    var password: string = req.query["password"] as string;    
    password = password.trim();

    if(validateEmail(email) == false) {
      res.status(404).send({error: "Email or password invalid"});
      return;
    }

    if(validatePassword(password) == false) {
      res.status(404).send({error: "Email or password invalid"});
      return;
    }

    if(await database.collection("users").findOne({ "email" : email }) != null) {
      res.status(409).send({error: `User with email ${email} already exists`});
      return;
    }

    const insertResult: InsertOneResult = await database.collection("users").insertOne(
      {
        "email" : email,
        "password" : password
      }
    );    

    const response: SignupResponse = {
      token: { user_id: insertResult.insertedId.toString() },
      user: {
        id: insertResult.insertedId.toString(),
        email: email,
        password: password
      }
    };
    
    res.send(response);
  }
);

authenticationRouter.post(
  "/login",
  async (req, res) => {
    var email: string = req.query["email"] as string;
    email = email.trim();
    var password: string = req.query["password"] as string;    
    password = password.trim();

    if(validateEmail(email) == false) {
      res.status(404).send({error: "Email or password invalid"});
      return;
    }

    if(validatePassword(password) == false) {
      res.status(404).send({error: "Email or password invalid"});
      return;
    }

    const userDocument: Document | null = await database.collection("users").findOne({ "email" : email });
    if(userDocument == null) {
      res.status(404).send({error: `User with email ${email} doesn't exist`});
      return;
    }

    if(userDocument["password"] != password) {
      res.status(404).send({error: `Invalid login information`});
      return;      
    }

    const loginResponse: SignupResponse = {
      token: {
        user_id: userDocument["_id"]
      },
      user: {
        id: userDocument["_id"],
        email: userDocument["email"],
        password: userDocument["password"]
      }
    };
    
    res.send(loginResponse);
  }
);

export default authenticationRouter;