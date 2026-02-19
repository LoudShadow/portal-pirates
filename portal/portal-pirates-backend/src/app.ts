import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { generateContent, generateHint } from "./ai/ai";

import cors from "cors";

dotenv.config();

// Generate public/private key pair for JWT
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

const PASSWORD_HASH = "$2b$10$TTddOGbAYpVhSx1Us8RD8enaa/qhlR0aGs9QIT2hiLNP15wQjZ7.e";
const USERNAME = "user-1";

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (
    username === USERNAME &&
    (await bcrypt.compare(password, PASSWORD_HASH))
  ) {
    const token = jwt.sign({ username }, privateKey, {
      algorithm: "RS256",
      expiresIn: "24h",
    });
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.get("/", async (req, res) => {
  const content = await generateContent();
  console.log(content);
  res.status(200).send({ health: "ok" });
});

app.post("/hint", authenticateToken, async (req, res) => {
  const data = req.body;
  const content = await generateHint(undefined, undefined, data);
  console.log(content);
  res.status(200).send({ hint: content });
});

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
})