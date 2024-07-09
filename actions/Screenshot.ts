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

"use server";

import puppeteer from "puppeteer";

const MAX_HTML_LENGTH = 10000; // Adjust as needed

export const TakeScreenshot = async (
  url: string
): Promise<{ screenshot?: string; html?: string; error?: string }> => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set a timeout for navigation
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const [screenshot, html] = await Promise.all([
      page.screenshot({ encoding: "base64" }),
      page.evaluate(() => document.documentElement.outerHTML)
    ]);

    const limitedHtml = html.length > MAX_HTML_LENGTH 
      ? html.slice(0, MAX_HTML_LENGTH) + '...' 
      : html;

    return { screenshot, html: limitedHtml };
  } catch (error) {
    console.error("Error in TakeScreenshot:", error);
    return { error: error instanceof Error ? error.message : String(error) };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
