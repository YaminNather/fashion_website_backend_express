"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = __importDefault(require("../../mongodb"));
const authenticationRouter = express_1.default.Router();
function validateEmail(email) {
    if (email.search(/@/) == -1)
        return false;
    return true;
}
function validatePassword(password) {
    return password.length >= 6 && password.length <= 20;
}
authenticationRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var email = req.query["email"];
    email = email.trim();
    var password = req.query["password"];
    password = password.trim();
    if (validateEmail(email) == false) {
        res.status(404).send({ error: "Email or password invalid" });
        return;
    }
    if (validatePassword(password) == false) {
        res.status(404).send({ error: "Email or password invalid" });
        return;
    }
    if ((yield mongodb_1.default.collection("users").findOne({ "email": email })) != null) {
        res.status(409).send({ error: `User with email ${email} already exists` });
        return;
    }
    const insertResult = yield mongodb_1.default.collection("users").insertOne({
        "email": email,
        "password": password
    });
    const response = {
        token: { user_id: insertResult.insertedId.toString() },
        user: {
            id: insertResult.insertedId.toString(),
            email: email,
            password: password
        }
    };
    res.send(response);
}));
authenticationRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var email = req.query["email"];
    email = email.trim();
    var password = req.query["password"];
    password = password.trim();
    if (validateEmail(email) == false) {
        res.status(404).send({ error: "Email or password invalid" });
        return;
    }
    if (validatePassword(password) == false) {
        res.status(404).send({ error: "Email or password invalid" });
        return;
    }
    const userDocument = yield mongodb_1.default.collection("users").findOne({ "email": email });
    if (userDocument == null) {
        res.status(404).send({ error: `User with email ${email} doesn't exist` });
        return;
    }
    if (userDocument["password"] != password) {
        res.status(404).send({ error: `Invalid login information` });
        return;
    }
    const loginResponse = {
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
}));
exports.default = authenticationRouter;
