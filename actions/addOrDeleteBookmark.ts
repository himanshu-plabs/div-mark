"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
export async function addBookmarkToFolder(
  bookmarkId: number,
  folderId: number
) {
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  try {
    await db.bookmark.update({
      where: { id: bookmarkId },
      data: { folderId: folderId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding bookmark to folder:", error);
    return { success: false, error: "Failed to add bookmark to folder" };
  }
}

export async function deleteBookmark(bookmarkId: number) {
    try {
      await db.bookmark.delete({
        where: { id: bookmarkId },
      })
      return { success: true }
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      return { success: false, error: 'Failed to delete bookmark' }
    }
  }