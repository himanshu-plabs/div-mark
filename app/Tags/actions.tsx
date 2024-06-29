"use server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { ReactNode } from "react";
import { z } from "zod";

export const GenerateTags = async (input: string) => {
  const result = await generateObject({
    model: openai("gpt-4-turbo"),
    prompt: `Generate a comprehensive list of relevant tags for the following content. Ensure the tags include all key elements, themes, and specific details such as setting, time of day, sensory details, mood,any work which user might wants to remember,or a thing which he wants to do in the future, remember do not create too much tags as they are only for search use. Also, consider potential search terms a user might use to find this content in a bookmark manager: ${input}`,
    schema: z.object({
      tags: z.array(z.string()),
    }),
  });
  return result.object;
};
