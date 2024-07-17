"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Masonry from "react-masonry-css";
import Link from "next/link";
import Navbar from "@/components/EverythingComponents/Navbar";
import BookmarkModal from "@/components/EverythingComponents/BookmarkModal";
import {
  getBookmarksByFolderId,
  getFolderById,
  updateFolderName,
} from "@/actions/fetchAllFolderWithTags";
import { CircleChevronLeft } from "lucide-react"; // Import Lucide icon
import { SkeletonCard } from "@/components/SkeletonCard";


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

interface Folder {
  id: number;
  name: string;
  createdAt: Date;
}

const getRandomHeightMultiplier = () => {
  const multipliers = [1, 0.8, 1, 1.1, 1.2, 0.7, 1.3];
  return multipliers[Math.floor(Math.random() * multipliers.length)];
};

const FolderPage = () => {
  const { folderId } = useParams();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkHeights, setBookmarkHeights] = useState<{ [key: number]: number }>({});
  const [modal, setModal] = useState<boolean>(true);
  const [folderName, setFolderName] = useState<string>("");
  const [isFolder, setIsFolder] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!folderId) return {message:"folderId is required"};

      try {
        const fetchedFolder = await getFolderById(Number(folderId));
        if (!fetchedFolder) return;
        setFolder(fetchedFolder);
        setFolderName(fetchedFolder.name); // Initialize folderName state

        const fetchedBookmarks = await getBookmarksByFolderId(Number(folderId));
        setBookmarks(fetchedBookmarks);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, [folderId]);

  useEffect(() => {
    const newHeights = bookmarks.reduce((acc, bookmark) => {
      acc[bookmark.id] = getRandomHeightMultiplier();
      return acc;
    }, {} as { [key: number]: number });

    setBookmarkHeights(newHeights);
  }, [bookmarks]);

  const handleFolderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const handleFolderNameBlur = async () => {
    if (folder && folder.name !== folderName) {
      try {
        await updateFolderName(folder.id, folderName);
        setFolder((prevFolder) => (prevFolder ? { ...prevFolder, name: folderName } : null));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    }
  };

  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-[#14161e] min-h-screen px-[80px]">
      <Navbar />
      <main className="">
        <div className="flex items-center mb-4">
          {folder && (
            <div className="relative w-full mt-[40px] ">
              <div className="flex items-center">
                <Link href="/spaces" className="">
                  <CircleChevronLeft className="text-[#748297] transition-all duration-150 hover:text-white mr-5 mt-2 cursor-pointer" size={38} />
                </Link>
                <input
                  value={folderName}
                  onChange={handleFolderNameChange}
                  onBlur={handleFolderNameBlur}
                  className="w-full placeholder-[#748297] focus:outline-none bg-transparent font-satisfy text-6xl pl-[6px] hover:placeholder-[#444c5c] text-[#748297] transition duration-300 ease-in-out"
                />
              </div>
              <div className="w-full h-[1px] bg-[#36373a] mt-[6px]"></div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
                <div className="moving-highlight"></div>
              </div>
            </div>
          )}
        </div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)
            : bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="">
                  <BookmarkModal
                    screenshot={bookmark.screenshot}
                    text={bookmark.text}
                    key={bookmark.id}
                    folder={folder}
                    modal={true}
                    bookmarkId={bookmark.id}
                    title={bookmark.title}
                    tags={bookmark.tags}
                  bookmarkHeights={bookmarkHeights[bookmark.id] || 1}
                  setBookmarks={setBookmarks}
                  isFolder={isFolder}
                  />
                </div>
              ))}
        </Masonry>
      </main>
    </div>
  );
};

export default FolderPage;
