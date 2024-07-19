'use server';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const fetchAllFoldersWithTags = async () => {
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  return await db.folder.findMany({
    where: {userId},
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
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  try {
    const folders = await db.folder.findMany({
      where: {
        userId
      },
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
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  try {
    const bookmarks = await db.bookmark.findMany({
      where: { folderId,userId },
      select: {
        id: true,
        title: true,
        text: true,
        screenshot: true,
        tags: true,
        createdAt: true,
        folderId: true,
        userId: true,
        folder: true,
        aspectRatio: true,
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
      select: { id: true, name: true, createdAt: true,userId: true},
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
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  const folders = await db.folder.findMany({
    where:{userId},
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
