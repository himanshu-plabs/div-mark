"use client";
import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import Navbar from "@/components/EverythingComponents/Navbar";

import BookmarkModal from "@/components/EverythingComponents/BookmarkModal";
import {
  getBookmarksByFolderId,
  getFolders,
} from "@/actions/fetchAllFolderWithTags";

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
  tags: string;
  createdAt: Date;
  folderId: number | null;
  userId: string | null;
}
const getRandomHeightMultiplier = () => {
  const multipliers = [1, 0.8, 1, 1.1, 1.2, 0.7, 1.3];
  return multipliers[Math.floor(Math.random() * multipliers.length)];
};
const Spaces = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
  }, [bookmarks]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const fetchedFolders = await getFolders();
        setFolders(fetchedFolders);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolders();
  }, []);

  const handleFolderClick = async (folder: Folder) => {
    setSelectedFolder(folder);
    // Fetch bookmarks for the selected folder
    // Assuming you have a function getBookmarksByFolderId
    const fetchedBookmarks = await getBookmarksByFolderId(folder.id);
    setBookmarks(fetchedBookmarks);
  };

  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-[#14161e] min-h-screen px-[80px]">
      <Navbar />
      <main className="">
        <h1 className="text-3xl font-bold text-white mb-6">Spaces</h1>
        {!selectedFolder ? (
          <div>
            {folders.map((folder) => (
              <div key={folder.id} onClick={() => handleFolderClick(folder)}>
                <h2 className="text-xl font-bold text-white mb-4 cursor-pointer">
                  {folder.name}
                </h2>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedFolder(null)}
              className="text-white mb-4"
            >
              Back to Folders
            </button>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="">
                  <BookmarkModal
                    screenshot={bookmark.screenshot}
                    text={bookmark.text}
                    key={bookmark.id}
                    folder={selectedFolder}
                    modal={true}
                    bookmarkId={bookmark.id}
                    title={bookmark.title}
                    tags={bookmark.tags}
                    bookmarkHeights={bookmarkHeights[bookmark.id] || 1}
                  />
                </div>
              ))}
            </Masonry>
          </div>
        )}
      </main>
    </div>
  );
};

export default Spaces;
