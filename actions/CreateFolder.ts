// actions/folderActions.ts
"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { error } from "console";

export const CreateFolder = async (folderName: string) => {
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  if (!folderName) {
    throw new Error("Folder name is required");
  }

  try {
    const alreadyExists = await db.folder.findFirst({
      where: {
        name: folderName,
        userId
      }
    })
    if (alreadyExists) { 
      return {
        message: "Folder already exists",
      }
    } else {
      const folder = await db.folder.create({
        data: {
          name: folderName,
          userId
        },
      });
      return folder;
    }
    
  } catch (error) {
    throw new Error(`Error creating folder: ${(error as Error).message}`);
  }
};
