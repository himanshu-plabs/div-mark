"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function addTag(bookmarkId: number, newTag: string): Promise<{ success: boolean }> {
  try {
    const bookmark = await db.bookmark.findUnique({
      where: { id: bookmarkId },
      select: { tags: true },
    });

    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    const updatedTags = bookmark.tags ? `${bookmark.tags},${newTag}` : newTag;

    await db.bookmark.update({
      where: { id: bookmarkId },
      data: { tags: updatedTags },
    });

    revalidateTag('bookmarks');
    return { success: true };
  } catch (error) {
    console.error("Error adding tag:", error);
    throw error;
  }
}


export async function updateBookmark(bookmarkId: number, title?: string, text?: string) {
  try {
    const data: { title?: string; text?: string } = {};
    if (title) data.title = title;
    if (text) data.text = text;

    await db.bookmark.update({
      where: { id: bookmarkId },
      data,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating bookmark:", error);
    throw error;
  }
}
