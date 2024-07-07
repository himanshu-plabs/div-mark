// 'use client';
// import React, { useState } from 'react';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import SearchBookmarks from '@/actions/SearchBookmark';

// const BookmarkSearch: React.FC = () => {
//   const [tags, setTags] = useState('');
//   const [results, setResults] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await SearchBookmarks(tags)
//       console.log(response);
//       const data = response[0]?.text
//       setResults(data);
//     } catch (error) {
//       console.error('Error fetching bookmarks:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <form onSubmit={handleSubmit} className="flex flex-col items-center">
//         <Input
//           value={tags}
//           onChange={(e) => setTags(e.target.value)}
//           placeholder="Enter tags separated by commas"
//           className="w-full p-2 border rounded-md mb-4"
//         />
//         <Button type="submit" className="">
//           Search
//         </Button>
//       </form>
//           <div className="mt-4">
//               {results}
//         {/* {results.length > 0 ? (
//           <ul>
//             {results.map((bookmark: any) => (
//               <li key={bookmark.id} className="mb-2">
//                 <h3 className="font-bold">{bookmark.title}</h3>
//                 <p>{bookmark.text}</p>
//                 <p>Tags: {bookmark.tags.join(', ')}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No bookmarks found</p>
//         )} */}
//       </div>
//     </div>
//   );
// };

// export default BookmarkSearch;

"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import SearchBookmarks from "@/actions/SearchBookmark";
import CreateFolderAndAddBookmarks from "@/actions/CreateFolderAndAddBookmarks";

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

const BookmarkSearch: React.FC = () => {
  const [tags, setTags] = useState<string>("");
  const [results, setResults] = useState<Bookmark[]>([]);
  const [folderName, setFolderName] = useState<string>("");

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await SearchBookmarks(tags);
      setResults(response);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const handleFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookmarkIds = results.map((bookmark: Bookmark) => bookmark.id);
      const response = await CreateFolderAndAddBookmarks(
        folderName,
        bookmarkIds
      );
      console.log("Folder created:", response);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col items-center"
      >
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags separated by commas"
          className="w-full p-2 border rounded-md mb-4"
        />
        <Button type="submit" className="">
          Search
        </Button>
      </form>
      <div className="mt-4">
        {results.length > 0 ? (
          <ul>
            {results.map((bookmark: Bookmark) => (
              <li key={bookmark.id} className="mb-2">
                <h3 className="font-bold">{bookmark.title}</h3>
                <p>{bookmark.text}</p>
                <p>Tags: {bookmark.tags}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookmarks found</p>
        )}
      </div>
      {results.length > 0 && (
        <form
          onSubmit={handleFolderSubmit}
          className="flex flex-col items-center mt-4"
        >
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="w-full p-2 border rounded-md mb-4"
          />
          <Button type="submit" className="">
            Create Folder with Bookmarks
          </Button>
        </form>
      )}
    </div>
  );
};

export default BookmarkSearch;
