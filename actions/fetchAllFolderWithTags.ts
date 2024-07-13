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

export async function getFolderById(folderId: number) {
  try {
    const folder = await db.folder.findUnique({
      where: { id: folderId },
      select: { id: true, name: true, createdAt: true },
    });
    return folder;
  } catch (error) {
    console.error("Error fetching folder:", error);
    return null;
  }
}
export async function updateFolderName(folderId: number, newName: string) {
  try {
    const updatedFolder = await db.folder.update({
      where: { id: folderId },
      data: { name: newName },
    });
    return updatedFolder;
  } catch (error) {
    console.error("Error updating folder name:", error);
    throw error;
  }
}

export const getFoldersWithFirstBookmark = async () => {
  const folders = await db.folder.findMany({
    include: {
      bookmarks: {
        take: 1,
      },
    },
  });

  return folders.map(folder => ({
    id: folder.id,
    name: folder.name,
    createdAt: folder.createdAt,
    firstBookmark: folder.bookmarks[0] || null,
  }));
};
