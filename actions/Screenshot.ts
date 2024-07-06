// app/actions/screenshot.ts
'use server'

import puppeteer from 'puppeteer';

export const TakeScreenshot = async (url: string): Promise<{ screenshot?: string; html?: string; error?: string }> => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot({ encoding: 'base64' });
    const html = await page.content();

    await browser.close();

    return { screenshot, html };
  } catch (error) {
    console.log(error);
    return { error: (error as Error).message  };

  }
};
