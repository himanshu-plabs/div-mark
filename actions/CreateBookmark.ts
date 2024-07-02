"use server";
import { db } from "@/lib/db";
import React from "react";

type CreateBookmarkProps = {
  Tags: string[];
  text: string;
};
const CreateBookmark = async ({ Tags, text }: CreateBookmarkProps) => {
  try {
    await db.bookmark.create({
      data: {
        text: text,
        tags: Tags,
      },
    });
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};

export default CreateBookmark;
