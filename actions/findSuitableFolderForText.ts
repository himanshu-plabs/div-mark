'use server';

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Define the schema interface
interface FolderSchema {
  folderName: string | false;
}

// Define the schema
const folderSchema: Record<string, unknown> = {
  properties: {
    folderName: { type: ["string", "boolean"] },
  },
  required: ["folderName"],
  type: "object",
};

// Function to find a suitable folder
export const findSuitableFolderForText = async (folders: any[], text: string): Promise<string | false> => {
  const prompt = `
    Here are the existing folders and their tags: ${JSON.stringify(folders)}.
    Here is the text for a new bookmark: ${text}.
    Task: Determine if the new bookmark fits into any existing folder based on their tags and names.
    Guidelines:
    - Match the new bookmark to folders that broadly cover the relevant tags.
    - Avoid assigning the bookmark to a folder based on a single minor match.
    - Consider the broader topic that the text implies and see if it fits within any folder's scope.
    - Check if the folder names themselves align with the new bookmark's text.
    - Return the name of the matching folder or false if no appropriate folder is found.
    - Ensure to prioritize accurate and relevant folder matching to maintain proper organization.
  `;

  const jsonSchema = JSON.stringify(folderSchema, null, 4);
  
  const chat_completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an intelligent assistant determining the appropriate folder for new bookmarks based on text and folder names. The JSON object must use the schema: ${jsonSchema}`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-70b-8192", // Ensure you have the correct model name here
    temperature: 0,
    stream: false,
    response_format: { type: "json_object" },
  });

  const content = chat_completion.choices[0].message.content;
  if (!content) {
    throw new Error("Received null or undefined content from chat completion");
  }
  
  const result: FolderSchema = JSON.parse(content);
  return result.folderName;
}
