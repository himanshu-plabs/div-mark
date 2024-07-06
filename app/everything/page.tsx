import BookmarkForm from "@/components/EverythingComponents/BookmarkForm";
import BookmarkSearch from "@/components/EverythingComponents/BookmarkSearch";
import CreateFolderForm from "@/components/EverythingComponents/CreateFolderForm";
import Navbar from "@/components/EverythingComponents/Navbar";
import ScreenshotComponent from "@/components/EverythingComponents/ScreenshotComponent";
import React from "react";

const EveryBookmark = () => {
  return (
    <div>
      <Navbar />
      <BookmarkForm />
      <BookmarkSearch />
      <ScreenshotComponent />
      <CreateFolderForm />
    </div>
  );
};

export default EveryBookmark;
