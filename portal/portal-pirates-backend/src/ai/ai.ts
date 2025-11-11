import { GoogleGenAI } from '@google/genai';
import { readTextFile } from '../utils';

const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'global';

export async function generateContent(
  projectId = GOOGLE_CLOUD_PROJECT,
  location = GOOGLE_CLOUD_LOCATION,
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

type TransactionData = {
  cost: number;
  time: string;
  vendor: string;
};

const generatePrompt = (data: TransactionData) => {
  // const {cost, time, vendor} = data;
  // return `Provide a hint to save money based on the following transaction details:
  // Cost: ${cost}
  // Time: ${time}
  // Vendor: ${vendor}`
  return JSON.stringify(data);
};

export async function generateHint(
  projectId = GOOGLE_CLOUD_PROJECT,
  location = GOOGLE_CLOUD_LOCATION,
  transactionData: TransactionData,
) {
  const client = new GoogleGenAI({
    vertexai: true,
    project: projectId,
    location: location,
  });

  const basePrompt = await readTextFile('./prompts/hint_prompt.txt');

  const content = generatePrompt(transactionData);

  const fullPrompt = `${basePrompt}\n\nTransaction Data:\n${content}`;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
  });

  console.log(response.text);

  return response.text;
}