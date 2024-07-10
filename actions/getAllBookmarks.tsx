"use server";

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redirect } from 'next/navigation'

export async function getAllBookmarks() {
  try {
    const allBookmarksWithUserAndFolder = await db.bookmark.findMany({
      include: {
        user: true,
        folder: true,
      },
    });

    return allBookmarksWithUserAndFolder;
  } catch (error) {
    console.error("Error fetching bookmarks with user and folder:", error);
    throw error;
  }

  revalidateTag('posts')
}