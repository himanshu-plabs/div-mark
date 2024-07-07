import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const findSuitableFolderForText = async (folders: any[], text: string) => {
  const result = await generateObject({
    model: openai("gpt-4-turbo"),
    prompt: `Here are the existing folders and their tags: ${JSON.stringify(
      folders
    )}. Here is the text for a new bookmark: ${text}. Does this new bookmark fit into any of the existing folders? If yes, return the name of the folder, otherwise return false, check correctly its not like if just one small thing matches and you give save it to that folder you should look at what the text trying to say and does it fit in any of the folder according to folders name and tags in that folder. Also, check if any of the folder names match the text in a way that covers a broader topic, and if so, return that name.`,
    schema: z.object({
      folderName: z.union([z.string(), z.literal(false)]),
    }),
  });

  return result.object.folderName;
};
