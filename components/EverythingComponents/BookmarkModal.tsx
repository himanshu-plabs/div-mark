import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BookmarkCard from "./BookmarkCard";

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

const BookmarkModal = ({
  screenshot,
  text,
  title,
  tags,
  folder,
  bookmarkId,
  modal,
  bookmarkHeights,
}: BookmarkCardProps) => {
  return (
    <Dialog>
      <DialogTrigger className="text-start">
        <BookmarkCard
          key={bookmarkId}
          screenshot={screenshot}
          title={title}
          description={text}
          heightMultiplier={bookmarkHeights} // Default to 1 if not set
        />
      </DialogTrigger>
      <DialogContent className=" w-[94%] h-[85%]  flex">
        <div className="w-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="w-[400px] border flex flex-col ">
          <div className=" w-full h-[95px] font-nunito py-5 px-[27px] ">
            <div className="text-[29px] font-light ">{title}</div>
            <div>{text}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkModal;
