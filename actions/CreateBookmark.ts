"use server";
import { db } from "@/lib/db";
import { TakeScreenshot } from "./Screenshot";
import { analyzeContentAndURL } from "@/app/Tags/actions";
import { fetchAllFoldersWithTags } from "./fetchAllFolderWithTags";
import { findSuitableFolder } from "./findSuitableFolder";
import { findSuitableFolderForText } from "./findSuitableFolderForText";
import { auth } from "@clerk/nextjs/server";

type CreateBookmarkProps = {
  url?: string;
  Text?: string;
};
type ScreenshotResponse = {
  screenshot?: string;
  html?: string;
  error?: string | undefined;
  aspectRatio?: number;
  ogImageBase64?: string | undefined;
};
type ErrorResponse = { error: string };

const CreateBookmark = async ({ url, Text }: CreateBookmarkProps) => {
  const { userId } = auth();
  if (!userId) {
    return { error: "Invalid user" };
  }
  try {
    if (Text) {
      const folders = await fetchAllFoldersWithTags();
      if ("error" in folders) {
        console.error("Error fetching folders:", folders.error);
        return { error: "Failed to fetch folders" };
      }

      const suitableFolderName = await findSuitableFolderForText(folders, Text);

      let folder;
      if (suitableFolderName) {
        folder = await db.folder.findFirst({
          where: { name: suitableFolderName, userId },
        });
      }
      console.log(suitableFolderName);

      if (!folder) {
        await db.bookmark.create({
          data: {
            text: Text,
            tags: Text,
            userId,
          },
        });

        return {
          message:
            "bookmark created successfully without connecting to any folder",
        };
      }

      await db.bookmark.create({
        data: {
          text: Text,
          tags: Text,
          folderId: folder.id,
          userId,
        },
      });

      return { message: "Bookmark created and added to the suitable folder." };
    }
    if (!url) {
      return { error: "url not found" };
    }
    const screenshotRes: ScreenshotResponse = await TakeScreenshot(url);
    if (screenshotRes.error) {
      return { error: screenshotRes.error };
    }

    const screenshot = screenshotRes.ogImageBase64
      ? screenshotRes.ogImageBase64
      : screenshotRes.screenshot;

    const html = screenshotRes.html;
    const aspectRatio = screenshotRes.aspectRatio;

    if (!html) {
      return { error: "failed to fetch html" };
    }
    const tagsRes = await analyzeContentAndURL(url, html);
    const tags = tagsRes.tags;
    const title = tagsRes.title;
    if (!tags) {
      console.log("no tags");
      return { error: "failed to generate tags" };
    }
    const folders = await fetchAllFoldersWithTags();
    if ("error" in folders) {
      console.error("Error fetching folders:", folders.error);
      return { error: "Failed to fetch folders" };
    }

    const suitableFolderName = await findSuitableFolder(folders, tags, url);

    let Folder;
    if (suitableFolderName) {
      // Use the suitable folder
      Folder = await db.folder.findFirst({
        where: { name: suitableFolderName, userId },
      });
    }

    if (!Folder) {
      await db.bookmark.create({
        data: {
          title,
          text: url,
          tags,
          screenshot,
          aspectRatio,
          userId,
        },
      });
      console.log(
        "folder not found so bookmark created successfully without connecting to any folder"
      );
      return {
        message:
          "bookmark created successfully!!! without connecting to any folder",
      };
    }

    await db.bookmark.create({
      data: {
        title,
        text: url,
        tags,
        screenshot,
        folderId: Folder.id,
        aspectRatio,
        userId,
      },
    });
    console.log("success");
    return {
      message: "bookmark created successfully and added to suitable folder",
    };
  } catch (error) {
    console.log(error);
    return { error: "failed to create bookmark" };
  }
};

export default CreateBookmark;
