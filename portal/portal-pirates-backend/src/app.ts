import express from "express";
import dotenv from "dotenv";

import { VertexAI } from '@google-cloud/vertexai';

const {GoogleGenAI} = require('@google/genai');


dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'global';

async function generateContent(
  projectId = GOOGLE_CLOUD_PROJECT,
  location = GOOGLE_CLOUD_LOCATION
) {
  const client = new GoogleGenAI({
    vertexai: true,
    project: projectId,
    location: location,
  });

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'How does AI work?',
  });

  console.log(response.text);

  return response.text;
}


app.get("/", async (req, res) => {
  const content = await generateContent();
  console.log(content);
  res.status(200).send({health: 'ok'});
});

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
})