import express from "express";
import {v4 as uuidv4} from "uuid";

const router = express.Router();

const users = [];

router.get(
  "/", 
  (req, res) => {
    res.send(users);
  }
);

router.get(
  "/:id",
  (req, res) => {
    res.send(users[req.params.id]);
  }
);

router.post(
  "/",
  (req, res) => {
    console.log("Posting user");
    
    const user = {...req.body, id: uuidv4()};
    users.push(user);

    res.send(`User with the name ${user.firstName} added to the database!`);
  }
);

export default router;