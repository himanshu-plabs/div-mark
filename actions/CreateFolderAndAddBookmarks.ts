"use server";

import { db } from "@/lib/db";

export default async function CreateFolderAndAddBookmarks(
  folderName: string,
  bookmarkIds: number[]
): Promise<any> {
  try {
    const folder = await db.folder.create({
      data: {
        name: folderName,
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
