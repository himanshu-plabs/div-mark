// "use server";
// import { openai } from "@ai-sdk/openai";
// import { generateObject } from "ai";
// import { ReactNode } from "react";
// import { z } from "zod";

// export const GenerateTags = async (input: string) => {
//   const result = await generateObject({
//     model: openai("gpt-4-turbo"),
//     prompt: `Generate a comprehensive list of relevant tags for the following content, also generate a title wich should not be more than three words it should mostly define what is inside this bookmark. Ensure the tags include all key elements, themes, and specific details such as setting, time of day, sensory details, mood,any work which user might wants to remember,or a thing which he wants to do in the future, remember do not create too much tags as they are only for search use. Also, consider potential search terms a user might use to find this content in a bookmark manager: ${input}`,
//     schema: z.object({
//       tags: z.array(z.string()),
//       title: z.string(),
//     }),
//   });
//   return result.object;
// };


// "use server";
// import { openai } from "@ai-sdk/openai";
// import { generateObject } from "ai";
// import { z } from "zod";

// export const GenerateTags = async (input: string) => {
//   const result = await generateObject({
//     model: openai("gpt-4o"),
//     prompt: `Analyze the following image based on what websites screenshot it is and what is the content inside the image is generate a comprehensive list of relevant tags, along with a concise title that accurately describes the content. The title should be no more than three words. Ensure the tags cover key elements, themes, and specific details such as setting, time of day, sensory details, mood, any work the user might want to remember, or actions they might want to take in the future. Do not generate too many tags; focus on search usability. Also, consider potential search terms a user might use to find this content in a bookmark manager: ${input}`,
//     schema: z.object({
//       tags: z.array(z.string()),
//       title: z.string(),
//     }),
//   });
//   return result.object;
// };



"use server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const GenerateTags = async (input: string) => {
  const result = await generateObject({
    model: openai("gpt-4o"),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze the following image based on what websites screenshot it is and what is the content inside the image is generate a comprehensive list of relevant tags, along with a concise title that accurately describes the content. The title should be no more than three words. Ensure the tags cover key elements and dont miss the name of the wesite of the title of the website in the tags' },
          {
            type: 'image',
            image: input,
          },
        ],
      },
    ],
    schema: z.object({
      tags: z.array(z.string()),
      title: z.string(),
    }),
  });
  return result.object;
};
