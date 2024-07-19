"use server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

async function SearchBookmarks(tagsToSearch: string) {
 
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  try {
    const bookmarks = await db.bookmark.findMany({
      include: {
        folder: true,
      },
      where: {
        userId,
        OR: [
          {
            tags: {
              contains: tagsToSearch,
              mode: "insensitive",
            },
          },
          {
            text: {
              contains: tagsToSearch,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    return {success: bookmarks}
  } catch (error) {
    return {
      error:'failed to search'
    }
  }
  
  
}

export default SearchBookmarks;


 // Split the input string into an array of tags

  // const tagsArray = tagsToSearch.split(",").map((tag) => tag.trim());

// Rank the bookmarks based on the number of matching tags
  // const rankedBookmarks = bookmarks
  //   .map((bookmark) => {
  //     const matchingTags = bookmark.tags.filter((tag) =>
  //       tagsArray.includes(tag)
  //     );
  //     return {
  //       ...bookmark,
  //       matchCount: matchingTags.length,
  //     };
  //   })
  //   .filter((bookmark) => bookmark.matchCount > 0)
  //     .sort((a, b) => b.matchCount - a.matchCount);
  //     return rankedBookmarks;