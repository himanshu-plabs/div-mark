// components/EveryBookmark.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import BookmarkForm from "@/components/EverythingComponents/BookmarkForm";
import BookmarkSearch from "@/components/EverythingComponents/BookmarkSearch";
import Navbar from "@/components/EverythingComponents/Navbar";
import { getAllBookmarks } from "@/actions/getAllBookmarks";
import BookmarkModal from "@/components/EverythingComponents/BookmarkModal";
import CreateFolderAndAddBookmarks from "@/actions/CreateFolderAndAddBookmarks";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Bookmark, Folder } from "@/lib/schema";
import { cn } from "@/lib/utils";

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
  const [isBookmarkFormFocused, setIsBookmarkFormFocused] = useState(false);
  const bookmarkFormRef = useRef<HTMLDivElement>(null);

  // ... other useEffect hooks and functions
  const handleBookmarkFormFocus = () => {
    setIsBookmarkFormFocused(true);
  };

  const handleBookmarkFormBlur = () => {
    setIsBookmarkFormFocused(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bookmarkFormRef.current &&
        !bookmarkFormRef.current.contains(event.target as Node)
      ) {
        handleBookmarkFormBlur();
      }
    };

    if (isBookmarkFormFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBookmarkFormFocused]);

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

        if ("error" in fetchedBookmarks) {
          // Handle error case
          setError(fetchedBookmarks.error);
          setBookmarks([]);
        } else {
          // Handle success case
          setBookmarks(fetchedBookmarks);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
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

  const overlayStyle = {
    background: `
      radial-gradient(
        circle at top left,
        rgba(20, 22, 30, 0) 0%,
        rgba(20, 22, 30, 0.3) 25%,
        rgba(20, 22, 30, 0.5) 50%,
        rgba(20, 22, 30, 0.7) 75%,
        rgba(20, 22, 30, 0.9) 100%
      )
    `,
    pointerEvents: "none" as const,
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
        <div
          ref={bookmarkFormRef}
          className={cn(
            "relative z-20 hover:ring-4 ring-[#33384e]   rounded-md mb-5",
            {
              "ring-4 ring-[#33384e]": isBookmarkFormFocused,
            }
          )}
        >
          <BookmarkForm
            setBookmarks={setBookmarks}
            onFocus={handleBookmarkFormFocus}
            onBlur={handleBookmarkFormBlur}
          />
        </div>

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
                  isFolder={false}
                />
              </div>
            ))}
      </Masonry>
      {isBookmarkFormFocused && (
        <>
          {/* Overlay to the right */}

          {/* Overlay to the bottom */}
          <div
            className="absolute top-[138px] left-0 right-0 bottom-0   z-10"
            style={overlayStyle}
          />
          {/* Overlay to the left */}
        </>
      )}

      {/* {isBookmarkFormActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50  z-50">
          <div 
            ref={bookmarkFormRef}
            className="mt-[179px] ml-[80px]"
            style={{
              position: 'absolute',
              top: bookmarkFormRef.current?.offsetTop,
              left: bookmarkFormRef.current?.offsetLeft,
            }}
          >
            <BookmarkForm
              setBookmarks={setBookmarks}
              onFocus={() => setIsBookmarkFormActive(true)}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default EveryBookmark;
