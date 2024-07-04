// app/actions/screenshot.ts
'use server'

import puppeteer from 'puppeteer';

export async function TakeScreenshot(url: string): Promise<{ screenshot: string } | { error: string }> {
  if (!url) {
    return { error: 'URL is required' };
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshot = await page.screenshot({ encoding: 'base64' });
    await browser.close();
    return { screenshot: screenshot as string };
  } catch (error) {
    return { error: (error as Error).message };
  }
}