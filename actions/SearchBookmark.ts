"use server";
import { db } from "@/lib/db";

async function SearchBookmarks(tagsToSearch: string) {
  // Split the input string into an array of tags

  // const tagsArray = tagsToSearch.split(",").map((tag) => tag.trim());

  // Fetch all bookmarks
  const bookmarks = await db.bookmark.findMany({
    where: {
      OR: [
        {
          tags: {
            contains: tagsToSearch,
            mode: "insensitive"
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
  return bookmarks;
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
}

export default SearchBookmarks;
