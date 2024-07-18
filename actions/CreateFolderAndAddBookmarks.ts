"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function CreateFolderAndAddBookmarks(
  folderName: string,
  bookmarkIds: number[]
): Promise<any> {
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  try {
    const folder = await db.folder.create({
      data: {
        name: folderName,
        userId,
      },
    });

    await db.bookmark.updateMany({
      where: {
        id: { in: bookmarkIds },
      },
      data: {
        folderId: folder.id,
      },
    });

    return folder;
  } catch (error) {
    console.error("Error creating folder and adding bookmarks:", error);
    throw error;
  }
}
