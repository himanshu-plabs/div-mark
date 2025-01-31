// app/actions/screenshot.ts
// "use server";

// import puppeteer from "puppeteer";

// export const TakeScreenshot = async (
//   url: string
// ): Promise<{ screenshot?: string; html?: string; error?: string }> => {
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: "networkidle2" });

//     const screenshot = await page.screenshot({ encoding: "base64" });
//     const html = await page.content();

//     await browser.close();

//     return { screenshot, html };
//   } catch (error) {
//     console.log(error);
//     return { error: (error as Error).message };
//   }
// };

// "use server";

// import puppeteer from "puppeteer";

// const MAX_HTML_LENGTH = 3000; // Adjust as needed

// export const TakeScreenshot = async (
//   url: string
// ): Promise<{ screenshot?: string; html?: string; error?: string; aspectRatio?: number }> => {
//   let browser;
//   try {
//     browser = await puppeteer.launch();
//     const page = await browser.newPage();
    
//     // Set a timeout for navigation
//     await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

//     const [screenshot, html] = await Promise.all([
//       page.screenshot({ encoding: "base64" }),
//       page.evaluate(() => document.documentElement.outerHTML)
//     ]);

//     const limitedHtml = html.length > MAX_HTML_LENGTH 
//       ? html.slice(0, MAX_HTML_LENGTH) + '...' 
//       : html;
    
//       const { width, height } = await page.evaluate(() => {
//         const { clientWidth, clientHeight } = document.documentElement;
//         return { width: clientWidth, height: clientHeight };
//       });
  
//       const aspectRatio = width / height;
//     return { screenshot, html: limitedHtml,aspectRatio };
//   } catch (error) {
//     console.error("Error in TakeScreenshot:", error);
//     return { error: error instanceof Error ? error.message : String(error) };
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// };


"use server";

import puppeteer from "puppeteer";
import axios from "axios";

const MAX_HTML_LENGTH = 3000; // Adjust as needed

const fetchImageAsBase64 = async (imageUrl: string): Promise<string | undefined> => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'binary');
    return buffer.toString('base64');
  } catch (error) {
    console.error("Error fetching image:", error);
    return undefined;
  }
};

export const TakeScreenshot = async (
  url: string
): Promise<{ screenshot?: string; html?: string; error?: string; aspectRatio?: number; ogImageBase64?: string }> => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set a timeout for navigation
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const [screenshot, html, ogImage] = await Promise.all([
      page.screenshot({ encoding: "base64" }),
      page.evaluate(() => document.documentElement.outerHTML),
      page.evaluate(() => {
        const ogImageTag = document.querySelector("meta[property='og:image']");
        return ogImageTag ? ogImageTag.getAttribute("content") : null;
      })
    ]);

    const ogImageBase64 = ogImage ? await fetchImageAsBase64(ogImage) : undefined;

    const limitedHtml = html.length > MAX_HTML_LENGTH 
      ? html.slice(0, MAX_HTML_LENGTH) + '...' 
      : html;

    const { width, height } = await page.evaluate(() => {
      const { clientWidth, clientHeight } = document.documentElement;
      return { width: clientWidth, height: clientHeight };
    });

    const aspectRatio = width / height;
    return { screenshot, html: limitedHtml, aspectRatio, ogImageBase64 };
  } catch (error) {
    console.error("Error in TakeScreenshot:", error);
    return { error: "failed to take screenshot" };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
