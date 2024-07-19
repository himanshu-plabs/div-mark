// actions/folderActions.ts
"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";


export const CreateFolder = async (folderName: string) => {
  const { userId } = auth();
  if (!userId) {
    return{
      error: "Invalid user"
    }
    
  }
  if (!folderName) {
    return { error: 'Folder name is required' };
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
        error: "Folder already exists",
      }
    } else {
      const folder = await db.folder.create({
        data: {
          name: folderName,
          userId
        },
      });
      return {success:folder};
    }
    
  } catch (error) {
    return { error: "Failed to create folder"}
  }
};
