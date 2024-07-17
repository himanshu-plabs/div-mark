"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/EverythingComponents/Navbar";
import { getFoldersWithFirstBookmark } from "@/actions/fetchAllFolderWithTags";
import { SkeletonCard } from "@/components/SkeletonCard";

interface Bookmark {
  id: number;
  screenshot: string | null;
}

interface Folder {
  id: number;
  name: string;
  createdAt: Date;
  firstBookmark: Bookmark | null;
}

const Spaces = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const fetchedFolders = await getFoldersWithFirstBookmark();
        setFolders(fetchedFolders);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setIsLoading(false);
      }
    };
    fetchFolders();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-[#14161e] min-h-screen px-[80px]">
      <Navbar />
      <main className="">
        <div className="relative w-full mt-[30px]">
          <input
            value='All spaces'
            className="w-full placeholder-[#748297] focus:outline-none bg-transparent font-satisfy text-6xl pl-[6px] hover:placeholder-[#444c5c] text-[#748297] transition duration-300 ease-in-out"
            readOnly
          />
          <div className="w-full h-[1px] bg-[#36373a] mt-[7px]"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
            <div className="moving-highlight"></div>
          </div>
        </div>
        <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mt-6">
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => <SkeletonCard key={index} />)
            : folders.map((folder) => (
                <div key={folder.id} className="shadow-md overflow-hidden rounded-lg">
                  <Link href={`/spaces/${folder.id}`}>
                    <div className="cursor-pointer">
                      {folder.firstBookmark && folder.firstBookmark.screenshot ? (
                        <div style={{ position: 'relative'}} className=" aspect-video">
                          <Image
                            src={`data:image/png;base64,${folder.firstBookmark.screenshot}`}
                            alt={folder.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="p-5 bg-[#1e1f2a] h-full flex flex-col justify-between rounded-md">
                          <p className="text-[#748297] text-sm font-nunito">No Image</p>
                        </div>
                      )}
                      <div className="p-2">
                        <h3 className="text-sm font-nunito truncate text-center text-white">
                          {folder.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
        </div>
      </main>
    </div>
  );
};

export default Spaces;
