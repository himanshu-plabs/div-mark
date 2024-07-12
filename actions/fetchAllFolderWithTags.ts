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
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return folders;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
}
