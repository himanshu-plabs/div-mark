import { db } from "@/lib/db";

export const fetchAllFoldersWithTags = async () => {
  return await db.folder.findMany({
    include: {
      bookmarks: {
        select: {
          tags: true,
        },
      },
    },
  });
};
