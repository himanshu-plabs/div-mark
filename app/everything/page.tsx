import BookmarkForm from "@/components/EverythingComponents/BookmarkForm";
import BookmarkSearch from "@/components/EverythingComponents/BookmarkSearch";
import Navbar from "@/components/EverythingComponents/Navbar";
import React from "react";

const EveryBookmark = () => {
  return (
    <div>
      <Navbar />
      <BookmarkForm />
      <BookmarkSearch />
    </div>
  );
};

export default EveryBookmark;
