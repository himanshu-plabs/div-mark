"use client";

import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import BookmarkForm from "@/components/EverythingComponents/BookmarkForm";
import BookmarkSearch from "@/components/EverythingComponents/BookmarkSearch";
import Navbar from "@/components/EverythingComponents/Navbar";
import { getAllBookmarks } from "@/actions/getAllBookmarks";
import { Decimal } from "@prisma/client/runtime/library";
import BookmarkCard from "@/components/EverythingComponents/BookmarkCard";
import BookmarkModal from "@/components/EverythingComponents/BookmarkModal";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [random, setRandom] = useState<number>(1);
  const [bookmarkHeights, setBookmarkHeights] = useState<{
    [key: number]: number;
  }>({});
  const [modal, setModal] = useState<boolean>(true);
  useEffect(() => {
    const newHeights = bookmarks.reduce((acc, bookmark) => {
      acc[bookmark.id] = getRandomHeightMultiplier();
      return acc;
    }, {} as { [key: number]: number });

    setBookmarkHeights(newHeights);
  }, [bookmarks]); // This effect runs only when bookmarks change

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
  }, [getAllBookmarks]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  return (
    <div className="bg-[#14161e] min-h-screen px-[80px]">
      <Navbar />
      <BookmarkSearch />

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <BookmarkForm setBookmarks={setBookmarks} />
        {bookmarks.map((bookmark) => {
          const heightMultiplier = getRandomHeightMultiplier();
          return (
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
              />
            </div>
          );
        })}
      </Masonry>

      {/* <ScreenshotComponent />
      <CreateFolderForm /> */}
    </div>
  );
};

export default EveryBookmark;
