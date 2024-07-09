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

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const findSuitableFolder = async (folders: any[], newTags: string) => {
  const result = await generateObject({
    model: openai("gpt-3.5-turbo"),
    prompt: `Here are the existing folders and their tags: ${JSON.stringify(
      folders
    )}. Here are the tags for a new bookmark: ${newTags}. Does this new bookmark fit into any of the existing folders? If yes, return the name of the folder, otherwise return false, check correctly its not like if just one small thing matches and you give save it to that folder you should look at what the tags are trying to say and does it fit in any of the folder according to folders name and tags in that folder. also check if that folders names matches with any of the tags in this if that tags can be classified as covering a broader topic so save it in that return that name.`,
    schema: z.object({
      folderName: z.union([z.string(), z.literal(false)]),
    }),
  });
  return result.object.folderName;
};
