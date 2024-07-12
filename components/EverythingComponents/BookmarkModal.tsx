import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import BookmarkCard from "./BookmarkCard";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addTag } from "@/actions/bookmarkActions";
import { Plus, X, Folder, Trash2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteTag } from "@/actions/DeleteTag";
import {
  addBookmarkToFolder,
  deleteBookmark,
} from "@/actions/addOrDeleteBookmark";
import { getFolders } from "@/actions/fetchAllFolderWithTags";
import FolderSelector from "./FolderSelector";
import Image from "next/image";

interface Folder {
  id: number;
  name: string;
  createdAt: Date;
}

type BookmarkCardProps = {
  screenshot: string | null;
  text: string;
  title: string | null;
  tags: string;
  folder: Folder | null;
  bookmarkId: number;
  modal?: boolean;
  bookmarkHeights: number;
};

const BookmarkModal: React.FC<BookmarkCardProps> = ({
  screenshot,
  text,
  title,
  tags,
  folder,
  bookmarkId,
  modal,
  bookmarkHeights,
}) => {
  const link = text;
  const domain = extractDomain(link);
  const [newTag, setNewTag] = useState<string>("");
  const [tagArray, setTagArray] = useState<string[]>(
    tags.split(",").map((tag: string) => tag.trim())
  );
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false);
  const [folders, setFolders] = useState<
    {
      name: string;
      id: number;
    }[]
  >([]);
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const folderSelectorRef = useRef<HTMLDivElement>(null);

  const handleAddToFolder = async (folderId: number) => {
    try {
      const result = await addBookmarkToFolder(bookmarkId, folderId);
      if (result.success) {
        // Handle success (e.g., show a success message or update UI)
        setShowFolderSelector(false);
      } else {
        // Handle error
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error adding bookmark to folder:", error);
    }
  };

  const handleDeleteBookmark = async () => {
    try {
      const result = await deleteBookmark(bookmarkId);
      if (result.success) {
        // Handle success (e.g., close the modal and update the parent component)
      } else {
        // Handle error
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  useEffect(() => {
    const fetchFolders = async () => {
      const fetchedFolders = await getFolders();
      setFolders(fetchedFolders);
    };
    fetchFolders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        folderSelectorRef.current &&
        !folderSelectorRef.current.contains(event.target as Node)
      ) {
        setShowFolderSelector(false);
      }
    };

    if (showFolderSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFolderSelector]);

  const handleAddTag = async () => {
    if (newTag.trim()) {
      try {
        await addTag(bookmarkId, newTag.trim());
        setTagArray((prevTags) => [...prevTags, newTag.trim()]);
        setNewTag("");
        setIsAddingTag(false);
      } catch (error) {
        console.error("Error adding tag:", error);
      }
    }
  };

  const handleDeleteTag = async (tagToDelete: string) => {
    try {
      await DeleteTag(bookmarkId, tagToDelete);
      setTagArray((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="text-start">
        <BookmarkCard
          key={bookmarkId}
          screenshot={screenshot}
          title={title}
          description={text}
          heightMultiplier={bookmarkHeights}
        />
      </DialogTrigger>
      <DialogContent className="w-[94%] h-[85%] flex">
        <section className="w-full h-full ">
          <div className="flex flex-col items-center m-[100px] h-full ">
            {screenshot ? (
              <Image
                src={`data:image/jpeg;base64,${screenshot}`}
                alt={title || "Bookmark screenshot"}
                width={600}
                height={300}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-[500px] h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No screenshot available</span>
              </div>
            )}
            <h2 className="mt-4 text-3xl text-[#a7b4c6] font-bold font-nunito text-center">
              {title}
            </h2>
            <Link
              href={text}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-[#7A889D] text-[13px] underline font-nunito"
            >
              VISIT ORIGINAL ARTICLE
            </Link>
          </div>
        </section>
        <section className="w-[550px] rounded-lg overflow-hidden  flex flex-col">
          <header className="w-full h-[95px] font-nunito py-5 px-[27px] flex flex-col justify-center text-[#a7b4c6] header-gradient ">
            <div className="text-[29px] font-extralight">{title}</div>
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extralight"
            >
              {domain}
            </Link>
          </header>
          <div className="h-[calc(100%-95px)] flex flex-col justify-between  scroll bg-[#1d1e28]">
            <div>
              <div className="Tldr text-[#748297] font-nunito p-4">
                <div className="top-left-text "></div>
                Content here to ensure the div is visible
              </div>
              <div className=" overflow-scroll p-4">
                <h3 className="text-[#a7b4c6] font-nunito mb-2">Tags:</h3>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isAddingTag
                      ? "mb-4 max-h-20 opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                  style={{
                    transform: isAddingTag
                      ? "translateY(0)"
                      : "translateY(-20px)",
                    transitionProperty: "max-height, opacity, transform",
                    transitionDuration: "400ms, 400ms, 400ms",
                    transitionDelay: isAddingTag
                      ? "0ms, 0ms, 0ms"
                      : "0ms, 0ms, 0ms",
                  }}
                >
                  <div className="flex gap-1">
                    <Input
                      type="text"
                      value={newTag}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTag(e.target.value)
                      }
                      placeholder="New tag"
                      className="bg-[#242531] h-[45px] focus:outline-none text-[#a7b4c6] flex-grow border-none Input"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button
                      onClick={handleAddTag}
                      className=" bg-[#ff5924] hover:bg-[#ba3c11] h-[45px] "
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setIsAddingTag(!isAddingTag)}
                    className={cn(
                      "bg-[#ff5924] text-white px-2.5 py-0.5 rounded-full text-sm flex items-center transition-all duration-300 font-nunito hover:bg-[#2a2b38] border border-[#ff5924] ",
                      isAddingTag
                        ? " bg-transparent "
                        : "opacity-100 translate-y-0 duration-100 "
                    )}
                  >
                    <Plus size={13} className="mr-1" />
                    Add tag
                  </button>
                  {tagArray.map((tag: string, index: number) => (
                    <div
                      key={index}
                      className="relative group"
                      style={{ boxShadow: "5px 5px 22px rgb(0 0 0 / 11%)" }}
                    >
                      <span className="bg-[#1c1e26] group-hover:bg-black text-[#748297] px-3 py-1.5 rounded-full text-sm font-nunito font-extralight inline-block border group-hover:border cursor-pointer">
                        {tag}
                      </span>
                      <button
                        onClick={() => handleDeleteTag(tag)}
                        className="absolute -top-1 -right-1 bg-[#36373a] text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#2a2b38] border "
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className=" gap-3 h-[95px] relative flex  items-end pb-4 justify-center ">
              <div ref={folderSelectorRef} className="">
                <div
                  onClick={() => setShowFolderSelector(!showFolderSelector)}
                  className="bg-[#1c1e26] text-[#748297] hover:bg-[#3b3f4f] rounded-full p-1.5 "
                >
                  <Circle size={23} className="" />
                </div>
                {showFolderSelector && (
                  <div>
                    <FolderSelector
                      folders={folders}
                      onSelectFolder={handleAddToFolder}
                      onClose={() => setShowFolderSelector(false)}
                    />
                  </div>
                )}
              </div>
              <div
                onClick={handleDeleteBookmark}
                className="bg-[#1c1e26] text-[#748297] hover:bg-[#3b3f4f] rounded-full "
              >
                <Trash2 size={34} className="p-1.5" />
              </div>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkModal;

function extractDomain(url: string): string {
  let domain;
  if (url.indexOf("//") > -1) {
    domain = url.split("/")[2];
  } else {
    domain = url.split("/")[0];
  }
  domain = domain.split(":")[0].split("?")[0];
  return domain;
}
