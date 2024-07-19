// // actions/folderActions.ts
// import { db } from "@/lib/db";
// import { openai } from "@ai-sdk/openai";
// import { generateObject } from "ai";
// import { z } from "zod";

// export const generateFolderNames = async (tags: string) => {
//   const prompt = `Generate a list of possible folder names based on the following tags. Ensure that the suggestions include broader aspects covered by the tags. Also, suggest names directly from the tags which are covering broader aspects:\n\nTags: ${tags}`;
//   const result = await generateObject({
//     model: openai("gpt-4-turbo"),
//     prompt: prompt,
//     schema: z.object({
//       folderNames: z.array(z.string()),
//     }),
//   });
//   return result.object.folderNames;
// };

// export const createOrFindFolder = async (tags: string) => {
//   // Generate folder name suggestions using LLM
//   const suggestedNames = await generateFolderNames(tags);

//   // Check if any of the suggested folder names already exist
//   for (const name of suggestedNames) {
//     const existingFolder = await db.folder.findFirst({
//       where: {
//         name: name,

//       },
//     });

//     if (existingFolder) {
//       return existingFolder;
//     }
//   }

//   // If no existing folder is found, create a new one with the first suggested name
//   const newFolder = await db.folder.create({
//     data: {
//       name: suggestedNames[0],

//     },
//   });

//   return newFolder;
// };

'use server';

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Define the schema interface
interface FolderSchema {
  folderName: string | false;
}


const folderSchema: Record<string, unknown> = {
  properties: {
    folderName: { type: ["string", "boolean"] },
  },
  required: ["folderName"],
  type: "object",
};


export const findSuitableFolder = async (folders: any[], newTags: string,url:string): Promise<string | false> => {
  const prompt = `
    Here are the existing folders and their tags: ${JSON.stringify(folders)}.
    Here are the tags for a new bookmark: ${newTags}.
    Here is the URL for the new bookmark: ${url}
    Task:
    1. Determine if the new bookmark fits into any of the existing folders based on their tags and names.
    2. If it fits, return the name of the folder. If not, return false.
    3. If it doesn't fit return false, it's not necessary to return a folder name

    Guidelines:
    - Match the new bookmark to folders that broadly cover the relevant tags.
    - Avoid assigning the bookmark to a folder based on a single minor match.
    - Consider the broader topic that the tags imply and see if it fits within any folder's scope.
    - Check if the folder names themselves align with the new bookmark's tags.
    - Return the name of the matching folder or false if no appropriate folder is found.
    - Ensure to prioritize accurate and relevant folder matching to maintain proper organization.
    - Check if the URL matches the text in the existing folder or name of the existing folder not word to word but like main The website name and domain, dont consider 'https://www.' while checking (extracted from the ${url})
    - in whichever folder most things match save the bookmark to that folder but remember if not much information matches return false
    - dont match just because both are google search but get the context this was an example
  `;
  
  const jsonSchema = JSON.stringify(folderSchema, null, 4);
  
  const chat_completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an intelligent assistant determining the appropriate folder for new bookmarks based on tags and folder names. The JSON object must use the schema: ${jsonSchema}`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-70b-8192", 
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


