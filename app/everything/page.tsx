// components/EveryBookmark.tsx
"use client";

import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import BookmarkForm from "@/components/EverythingComponents/BookmarkForm";
import BookmarkSearch from "@/components/EverythingComponents/BookmarkSearch";
import Navbar from "@/components/EverythingComponents/Navbar";
import { getAllBookmarks } from "@/actions/getAllBookmarks";
import BookmarkModal from "@/components/EverythingComponents/BookmarkModal";
import CreateFolderAndAddBookmarks from "@/actions/CreateFolderAndAddBookmarks";
import { SkeletonCard } from "@/components/SkeletonCard";

// Define the types based on your Prisma schema
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

const getRandomHeightMultiplier = () => {
  const multipliers = [1, 0.8, 1, 1.1, 1.2, 0.7, 1.3];
  return multipliers[Math.floor(Math.random() * multipliers.length)];
};

const EveryBookmark = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkHeights, setBookmarkHeights] = useState<{
    [key: number]: number;
  }>({});
  const [modal, setModal] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("");
  const [searchString, setSearchString] = useState<boolean>(false);

  useEffect(() => {
    const newHeights = bookmarks.reduce((acc, bookmark) => {
      acc[bookmark.id] = getRandomHeightMultiplier();
      return acc;
    }, {} as { [key: number]: number });

    setBookmarkHeights(newHeights);
  }, [bookmarks]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const fetchedBookmarks = await getAllBookmarks();
        setBookmarks(fetchedBookmarks);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleAddToFolder = () => {
    setModal(true);
  };

  const handleCreateFolder = async () => {
    try {
      await CreateFolderAndAddBookmarks(
        folderName,
        filteredBookmarks.map((bm) => bm.id)
      );
      setFolderName("");
      setModal(false);
      // Refresh bookmarks if needed
    } catch (err) {
      console.error("Failed to create folder and add bookmarks:", err);
    }
  };

  const displayedBookmarks = searchString ? filteredBookmarks : bookmarks;

  const breakpointColumnsObj = {
    default: 6,
    1590: 5,
    1332: 4,
    1092: 3,
    500: 2,
  };

  return (
    <div className="bg-[#14161e] min-h-screen px-[80px]">
      <Navbar />
      <BookmarkSearch
        setFilteredBookmarks={setFilteredBookmarks}
        setSearchString={setSearchString}
      />
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-xl mb-4">Create New Folder</h2>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder Name"
              className="border p-2 rounded-md mb-4 w-full"
            />
            <button
              onClick={handleCreateFolder}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Create Folder
            </button>
          </div>
        </div>
      )}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <BookmarkForm setBookmarks={setBookmarks} />
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : displayedBookmarks.map((bookmark) => (
              <div key={bookmark.id}>
                <BookmarkModal
                  screenshot={bookmark.screenshot}
                  text={bookmark.text}
                  key={bookmark.id}
                  folder={bookmark.folder}
                  modal={modal}
                  bookmarkId={bookmark.id}
                  title={bookmark.title}
                  tags={bookmark.tags}
                  bookmarkHeights={bookmarkHeights[bookmark.id] || 1}
                  setBookmarks={setBookmarks}
                />
              </div>
            ))}
      </Masonry>
    </div>
  );
};

export default EveryBookmark;
