"use client";

import { useState } from "react";
import { TakeScreenshot } from "@/actions/Screenshot";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { GenerateTags } from "@/app/Tags/actions";
import CreateBookmark from "@/actions/CreateBookmark";

// Define types for the responses
type ScreenshotResponse = { screenshot?: string | undefined; html?: string | undefined; error?: string | undefined; };
type ErrorResponse = { error: string };

export default function ScreenshotComponent() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{
    screenshot?: string;
    html?: string;
    tags?: string;
    title?: string;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Get HTML content and screenshot
      const screenshotRes: ScreenshotResponse | ErrorResponse = await TakeScreenshot(url);
      

      if ("error" in screenshotRes) {
        setResult({ error: screenshotRes.error });
      } else {
        setResult({ screenshot: screenshotRes.screenshot, html: screenshotRes.html });
      }
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const saveBookmark = async() => {
    setBookmarkLoading(true);
    try {
      await CreateBookmark(url);
      console.log(`Bookmark saved`);
    } catch (error) {
      console.log(error);
    } finally {
      setBookmarkLoading(false);
    }
  }
  
  const handleGenerateTags = async () => {
    if (!result?.html) return;

    setTagsLoading(true);

    try {
      // Generate tags
      const tagsRes: { tags: string; title: string } | ErrorResponse = await GenerateTags(result.html);

      
        setResult((prevResult) => ({ ...prevResult, tags: tagsRes.tags, title: tagsRes.title }));
     
    } catch (error) {
      setResult((prevResult) => ({ ...prevResult, error: (error as Error).message }));
    } finally {
      setTagsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Fetch HTML"}
        </Button>
      </form>
      {result?.error && <p>Error: {result.error}</p>}
      {result?.screenshot && (
        <div>
          <div style={{ position: "relative", width: "100%", height: "300px" }}>
            <Image
              src={`data:image/png;base64,${result.screenshot}`}
              alt="Screenshot"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <Button onClick={handleGenerateTags} disabled={tagsLoading}>
            {tagsLoading ? "Generating Tags..." : "Generate Tags"}
          </Button>
          <Button onClick={saveBookmark} disabled={bookmarkLoading}>{bookmarkLoading ? "Saving Bookmark..." : "Save Bookmark"}</Button>
          {result.tags && (
            <div>
              <p>Title: {result.title}</p>
              <p>Tags:{result.tags}</p>
              
            </div>
          )}
        </div>
      )}
    </div>
  );
}
