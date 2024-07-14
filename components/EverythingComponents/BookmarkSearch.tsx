"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SearchBookmarks from "@/actions/SearchBookmark";
import CreateFolderAndAddBookmarks from "@/actions/CreateFolderAndAddBookmarks";

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
  setSearchString: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookmarkSearch: React.FC<BookmarkSearchProps> = ({ setFilteredBookmarks, setSearchString }) => {
  const [tags, setTags] = useState<string>("");
  const [filteredBookmarks, setLocalFilteredBookmarks] = useState<Bookmark[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("");

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (tags) {
        try {
          const response = await SearchBookmarks(tags);
          setSearchString(true)
          setFilteredBookmarks(response);
          setLocalFilteredBookmarks(response);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        }
      } else {
        setFilteredBookmarks([]);
        setLocalFilteredBookmarks([]);
        setSearchString(false);
      }
    };

    fetchBookmarks();
  }, [tags, setFilteredBookmarks]);

  const handleCreateFolder = async () => {
    const bookmarkIds = filteredBookmarks.map(bookmark => bookmark.id);
    try {
      await CreateFolderAndAddBookmarks(folderName, bookmarkIds);
      setIsOpen(false);
      setFolderName("");
    } catch (error) {
      console.error("Error creating folder and adding bookmarks:", error);
    }
  };

  return (
    <div className="mx-auto pt-1">
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
        {tags && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white ml-4"
          >
            Add to Folder
          </button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger />
        <DialogContent>
          <div className="p-4">
            <h2 className="text-2xl mb-4">Create New Folder</h2>
            <input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder Name"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleCreateFolder}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Create Folder
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookmarkSearch;
