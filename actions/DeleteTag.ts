// In @/actions/bookmarkActions.ts
"use server";

import { db } from "@/lib/db";

export async function DeleteTag(bookmarkId: number, tagToDelete: string) {
    try {
      const bookmark = await db.bookmark.findUnique({
        where: { id: bookmarkId },
        select: { tags: true },
      });
  
      if (!bookmark) {
        throw new Error("Bookmark not found");
      }
  
      const updatedTags = bookmark.tags
        .split(',')
        .filter(tag => tag.trim() !== tagToDelete)
        .join(',');
  
      await db.bookmark.update({
        where: { id: bookmarkId },
        data: { tags: updatedTags },
      });
  

      return { success: true };
    } catch (error) {
      console.error("Error deleting tag:", error);
      throw error;
    }
  }