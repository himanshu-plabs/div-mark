'use server';
import { db } from "@/lib/db";

export const fetchAllFoldersWithTags = async () => {
  return await db.folder.findMany({
    include: {
      bookmarks: {
        select: {
          tags: true,
          title: true,
          text: true,
        },
      },
    },
  });
};

export async function getFolders() {
  try {
    const folders = await db.folder.findMany({
      select: { id: true, name: true,createdAt: true},
      orderBy: { name: "asc" },
    });
    return folders;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
}

export async function getBookmarksByFolderId(folderId: number) {
  try {
    const bookmarks = await db.bookmark.findMany({
      where: { folderId },
      select: {
        id: true,
        title: true,
        text: true,
        screenshot: true,
        tags: true,
        createdAt: true,
        folderId: true,
        userId: true,
      },
    });
    return bookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}