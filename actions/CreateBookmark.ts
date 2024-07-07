"use server";
import { db } from "@/lib/db";
import React from "react";
import { TakeScreenshot } from "./Screenshot";
import { GenerateTags } from "@/app/Tags/actions";
import { fetchAllFoldersWithTags } from "./fetchAllFolderWithTags";
import { findSuitableFolder } from "./findSuitableFolder";
import { findSuitableFolderForText } from "./findSuitableFolderForText";

type CreateBookmarkProps = {
  url?: string;
  Text?: string;
};
type ScreenshotResponse = {
  screenshot?: string;
  html?: string;
  error?: string | undefined;
};
type ErrorResponse = { error: string };

const CreateBookmark = async ({url,Text}: CreateBookmarkProps) => {
  try {
    if (Text) {
      const folders = await fetchAllFoldersWithTags();
      const suitableFolderName = await findSuitableFolderForText(folders, Text);

      let folder;
      if (suitableFolderName) {
        folder = await db.folder.findFirst({
          where: { name: suitableFolderName },
        });
      }

      if (!folder) {
        await db.bookmark.create({
          data: {
            text: Text,
            tags: Text,
          },
        });

        return {
          message: "Folder not found, so bookmark created successfully without connecting to any folder.",
        };
      }

      await db.bookmark.create({
        data: {
          text: Text,
          tags: Text,
          folderId: folder.id,
        },
      });

      return { message: "Bookmark created and added to the suitable folder." };
    }
    if (!url) {
    return { message: "url not found" }; 
  }
    const screenshotRes: ScreenshotResponse = await TakeScreenshot(url);
    const screenshot = screenshotRes.screenshot;
    const html = screenshotRes.html;
    const screenshoterror = screenshotRes.error;
    if (screenshoterror) {
      return screenshoterror;
    }
    if (!html) {
      return { message: "html is required" };
    }
    const tagsRes = await GenerateTags(html);
    const tags = tagsRes.tags;
    const title = tagsRes.title;

    const folders = await fetchAllFoldersWithTags();

    const suitableFolderName = await findSuitableFolder(folders, tags);

    let folder;
    if (suitableFolderName) {
      // Use the suitable folder
      folder = await db.folder.findFirst({
        where: { name: suitableFolderName },
      });
    }

    if (!folder) {
      await db.bookmark.create({
        data: {
          title,
          text: url,
          tags,
          screenshot,
        },
      });

      return {
        message:
          "folder not found so bookmark created successfully without connecting to any folder",
      };
    }

    await db.bookmark.create({
      data: {
        title,
        text: url,
        tags,
        screenshot,
        folderId: folder.id,
      },
    });
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};

export default CreateBookmark;
