"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from 'next/navigation'

export async function getAllBookmarks() {
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  try {
    const allBookmarksWithUserAndFolder = await db.bookmark.findMany({
      where: {
        userId
      },
      include: {
        folder: true,
      },
      orderBy: {
        createdAt: 'desc' 
      }
    });
    revalidatePath('/everything')
    return allBookmarksWithUserAndFolder;
    
  } catch (error) {
    console.error("Error fetching bookmarks with user and folder:", error);
    throw error;
  }

  
}
