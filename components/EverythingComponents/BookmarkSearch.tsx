"use client";
import React, { useState, useEffect } from "react";
import SearchBookmarks from "@/actions/SearchBookmark";
type UserRole = "ADMIN" | "USER";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  password: string | null;
}

interface Folder {
  id: number;
  name: string;
  createdAt: Date;
}

interface Bookmark {
  id: number;
  title: string | null;
  text: string;
  screenshot: string | null;
  createdAt: Date;
  folderId: number | null;
  userId: string | null;
  aspectRatio: number | null;
  folder: Folder | null;
  user: User | null;
  tags: string;
}

interface BookmarkSearchProps {
  setFilteredBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
}

const BookmarkSearch: React.FC<BookmarkSearchProps> = ({ setFilteredBookmarks }) => {
  const [tags, setTags] = useState<string>("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (tags) {
        try {
          const response = await SearchBookmarks(tags);
          setFilteredBookmarks(response);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      } else {
        setFilteredBookmarks([]);
      }
    };

    fetchBookmarks();
  }, [tags, setFilteredBookmarks]);

  return (
    <div className=" mx-auto pt-1 ">
      <div className="relative w-full mb-4">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Search my mind..."
          className="w-full placeholder-[#748297] focus:outline-none bg-transparent font-satisfy text-6xl pl-[6px] hover:placeholder-[#444c5c] text-[#748297] transition duration-300 ease-in-out"
        />
        <div className="w-full h-[1px] bg-[#36373a] mt-[15px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
          <div className="moving-highlight"></div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkSearch;
