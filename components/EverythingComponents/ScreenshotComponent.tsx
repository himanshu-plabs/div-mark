"use client";

import { useState } from "react";
import { TakeScreenshot } from "@/actions/Screenshot";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { GenerateTags } from "@/app/Tags/actions";

// Define types for the responses
type ScreenshotResponse = { screenshot: string };
type ErrorResponse = { error: string };

export default function ScreenshotComponent() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{
    screenshot?: string;
    tags?: string[];
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Take the screenshot
      const screenshotRes: ScreenshotResponse | ErrorResponse = await TakeScreenshot(url);

      if ("error" in screenshotRes) {
        setResult({ error: screenshotRes.error });
      } else {
        setResult({ screenshot: screenshotRes.screenshot });
      }
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!result?.screenshot) return;

    setTagsLoading(true);

    try {
      // Generate tags
      const tagsRes: { tags: string[] } | ErrorResponse = await GenerateTags(`data:image/png;base64,${result.screenshot}`);

      setResult((prevResult) => ({ ...prevResult, tags: tagsRes.tags }));
    } catch (error) {
      setResult((prevResult) => ({ ...prevResult, error: (error as Error).message }));
    } finally {
      setTagsLoading(false);
    }
  };
    console.log(result)

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
          {loading ? "Loading..." : "Take Screenshot"}
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
          {result.tags && (
            <div>
              <p>Tags:</p>
              {result.tags.map((tag, index) => (
                <div key={index}>{tag}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
