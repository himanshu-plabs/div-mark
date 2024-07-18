"use server";
import { db } from "@/lib/db";
import { TakeScreenshot } from "./Screenshot";
import { analyzeContentAndURL } from "@/app/Tags/actions";
import { fetchAllFoldersWithTags } from "./fetchAllFolderWithTags";
import { findSuitableFolder } from "./findSuitableFolder";
import { findSuitableFolderForText } from "./findSuitableFolderForText";
import { auth, currentUser } from "@clerk/nextjs/server";

type CreateBookmarkProps = {
  url?: string;
  Text?: string;
};
type ScreenshotResponse = {
  screenshot?: string;
  html?: string;
  error?: string | undefined;
  aspectRatio?: number;
  ogImageBase64?: string | undefined
};
type ErrorResponse = { error: string };

const CreateBookmark = async ({ url, Text }: CreateBookmarkProps) => {
  const { userId } = auth();
  if (!userId) { 
    return { error:"Invalid user"}
  }
  try {
    if (Text) {
      const folders = await fetchAllFoldersWithTags();
      if ('error' in folders) {
        console.error("Error fetching folders:", folders.error);
        return { error: "Failed to fetch folders" };
      }
  
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
            userId
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
          userId
        },
      });

      return { message: "Bookmark created and added to the suitable folder." };
    }
    if (!url) {
    return { message: "url not found" }; 
  }
    const screenshotRes: ScreenshotResponse = await TakeScreenshot(url);
    
      const screenshot = screenshotRes.ogImageBase64 ? screenshotRes.ogImageBase64: screenshotRes.screenshot
    
    
    const html = screenshotRes.html;
    const aspectRatio = screenshotRes.aspectRatio;
    const screenshoterror = screenshotRes.error;
    if (screenshoterror) {
      return screenshoterror;
    }
    if (!html) {
      return { message: "html is required" };
    }
    const tagsRes = await analyzeContentAndURL(url, html);
    const tags = tagsRes.tags;
    const title = tagsRes.title;
    if (!tags) {
  console.log('no tags')
}
    const folders = await fetchAllFoldersWithTags();
    if ('error' in folders) {
      console.error("Error fetching folders:", folders.error);
      return { error: "Failed to fetch folders" };
    }

    const suitableFolderName = await findSuitableFolder(folders, tags,url);

    let Folder;
    if (suitableFolderName) {
      // Use the suitable folder
      Folder = await db.folder.findFirst({
        where: { name: suitableFolderName,userId },
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
          userId
        },
      });
      console.log('folder not found so bookmark created successfully without connecting to any folder')
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
        folderId: Folder.id,
        aspectRatio,
        userId
      },
    });
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};

export default CreateBookmark;
