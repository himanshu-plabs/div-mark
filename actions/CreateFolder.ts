// actions/folderActions.ts
"use server";

import { db } from "@/lib/db";

export const CreateFolder = async (folderName: string) => {
  if (!folderName) {
    throw new Error("Folder name is required");
  }

  try {
    const folder = await db.folder.create({
      data: {
        name: folderName,
      },
    });
    return folder;
  } catch (error) {
    throw new Error(`Error creating folder: ${(error as Error).message}`);
  }
};
