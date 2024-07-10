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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkModal;
