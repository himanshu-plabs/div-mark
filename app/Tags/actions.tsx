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

// "use server";
// import { openai } from "@ai-sdk/openai";
// import { generateObject } from "ai";
// import { z } from "zod";

// export const GenerateTags = async (input: string) => {
//   const result = await generateObject({
//     model: openai("gpt-4o"),
//     messages: [
//       {
//         role: 'user',
//         content: [
//           { type: 'text', text: 'Analyze the following image based on what websites screenshot it is and what is the content inside the image is generate a comprehensive list of relevant tags, along with a concise title that accurately describes the content. The title should be no more than three words. Ensure the tags cover key elements and dont miss the name of the wesite of the title of the website in the tags' },
//           {
//             type: 'image',
//             image: input,
//           },
//         ],
//       },
//     ],
//     schema: z.object({
//       tags: z.array(z.string()),
//       title: z.string(),
//     }),
//   });
//   return result.object;
// };

// "use server";
// import { openai } from "@ai-sdk/openai";
// import { createOpenAI } from '@ai-sdk/openai';
// import { generateObject, generateText } from "ai";
// import { z } from "zod";

// const groq = createOpenAI({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY,
// });

// export const GenerateTags = async (html: string, url: string) => {
//   const result = await generateText({
//     model: groq('llama3-8b-8192'),
//     prompt: `Analyze the following HTML content and URL to generate relevant tags and a concise title. The content may be truncated.
// //     URL: ${url}
// //     HTML: ${html}
// //     Task:
// //     1. Title: Create a concise title (max 3 words) that accurately describes the main content.
// //     2. Tags: Generate a comprehensive list of relevant tags. Consider:
// //      - The website name and domain (extracted from the URL)
// //      - Main topic and key concepts
// //      - Potential user actions or intentions
// //      - Search terms a user might use to find this content
// //      - If it's a web search result, focus on the main answer or content

// //     3. Guidelines:
// //      - Prioritize the main content over HTML structure or irrelevant page elements
// //      - Don't include 'HTML', 'http', 'https', 'www', or generic web terms as tags
// //      - Focus on unique, specific, and searchable terms
// //      - Include both broad categories and specific details
// //      - Aim for a mix of popular and niche terms to improve findability

// //     4. Format:
// //      - Provide the title and tags as a JSON object
// //      - Separate tags with commas in the 'tags' string
// //     Remember, the goal is to create tags that would help a user easily find and identify this bookmark in a large collection.`,
//     // schema: z.object({
//     //   tags: z.string(),
//     //   title: z.string(),
//     // }),
//   });
//   console.log(result.text);
// };

//  "use server";
// import { openai } from "@ai-sdk/openai";
// import { generateObject } from "ai";
// import { z } from "zod";

// export const GenerateTags = async (html: string) => {

//   const result = await generateObject({
//     model: openai("gpt-4-turbo"),
//     prompt: `Analyze the following HTML content (which may be truncated) to generate a comprehensive list of relevant tags, along with a concise title that accurately describes the content. The title should be no more than three words. Ensure the tags cover key elements and actions they might want to take in the future. Focus on search usability. Don't consider 'HTML' or 'html' as tags. Also, consider potential search terms a user might use to find this content in a bookmark manager.\n\nHTML:\n${truncatedHtml}`,
//     schema: z.object({
//       tags: z.string(),
//       title: z.string(),
//     }),
//   });
//   return result.object;
// };

// function truncateHtml(html: string, maxTokens: number): string {
//   // Simple tokenization (this is a rough estimate, you might want to use a more accurate tokenizer)
//   const tokens = html.split(/\s+/);
//   if (tokens.length <= maxTokens) return html;

//   return tokens.slice(0, maxTokens).join(' ') + ' ...';
// }

// "use server";
// import { openai } from "@ai-sdk/openai";
// import { createOpenAI } from "@ai-sdk/openai";
// import { generateObject } from "ai";
// import { z } from "zod";

// const groq = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.GROQ_API_KEY,
// });

// export const GenerateTags = async (html: string, url: string) => {
//   const result = await generateObject({
//     model: openai("gpt-3.5-turbo"),
//     prompt: `Analyze the following HTML content and URL to generate relevant tags and a concise title. The content may be truncated.
//     URL: ${url}
//     HTML: ${html}
//     Task:
//     1. Title: Create a concise title (max 3 words) that accurately describes the main content.
//     2. Tags: Generate a comprehensive list of relevant tags. Consider:
//      - The website name and domain (extracted from the URL)
//      - Main topic and key concepts
//      - Potential user actions or intentions
//      - Search terms a user might use to find this content
//      - If it's a web search result, focus on the main answer or content

//     3. Guidelines:
//      - Prioritize the main content over HTML structure or irrelevant page elements
//      - Don't include 'HTML', 'http', 'https', 'www', or generic web terms as tags
//      - Focus on unique, specific, and searchable terms
//      - Include both broad categories and specific details
//      - Aim for a mix of popular and niche terms to improve findability

//     4. Format:
//      - Provide the title and tags as a JSON object
//      - Separate tags with commas in the 'tags' string
//     Remember, the goal is to create tags that would help a user easily find and identify this bookmark in a large collection.`,
//     schema: z.object({
//       tags: z.string(),
//       title: z.string(),
//     }),
//   });
//   return result.object;
// };


import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface Schema {
  tags: string;
  title: string;
}

const schema: Record<string, unknown> = {
  properties: {
    tags: { type: "string" },
    title: { type: "string" },
  },
  required: ["tags", "title"],
  type: "object",
};

export async function analyzeContentAndURL(url: string, html: string): Promise<Schema> {
  const prompt = `
    URL: ${url}
    HTML: ${html}
    Task:
    1. Title: Create a concise title (max 3 words).
    2. Tags: Generate relevant tags.

    Guidelines:
    - Use the website name, domain, main topics, key concepts, and user intents.
    - Exclude 'HTML', 'http', 'https', 'www', or generic web terms.
    - Prioritize main content over HTML structure.
    - Provide a JSON object with the title and tags.
  `;
  const jsonSchema = JSON.stringify(schema, null, 4);
  const chat_completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an intelligent assistant that generates tags and concise titles based on given HTML content and URL. The JSON object must use the schema: ${jsonSchema}`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0,
    stream: false,
    response_format: { type: "json_object" },
  });
  const content = chat_completion.choices[0].message.content;
  if (!content) {
    throw new Error("Received null or undefined content from chat completion");
  }
  const result: Schema = JSON.parse(content);
  return result;
}

// Example usage
// async function main() {
//   const url = "https://console.groq.com/docs/models";
//   const html = "<html><body>Example content</body></html>";
//   try {
//     const result = await analyzeContentAndURL(url, html);
//     console.log(result); // { title: "Example Title", tags: "example, content, tag" }
//   } catch (e) {
//     console.error(e);
//   }
// }

//  main();
