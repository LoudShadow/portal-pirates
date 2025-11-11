import express from "express";
import dotenv from "dotenv";

import { generateContent, generateHint } from "./ai/ai.ts";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;


app.get("/", async (req, res) => {
  const content = await generateContent();
  console.log(content);
  res.status(200).send({health: 'ok'});
});

app.post("/hint", async (req, res) => {
  const data = req.body;
  const content = await generateHint(
    undefined,
    undefined,
    data
  );
  console.log(content);
  res.status(200).send({hint: content});
});

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
})