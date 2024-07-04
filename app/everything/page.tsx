import BookmarkForm from "@/components/EverythingComponents/BookmarkForm";
import BookmarkSearch from "@/components/EverythingComponents/BookmarkSearch";
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
    </div>
  );
};

export default EveryBookmark;
