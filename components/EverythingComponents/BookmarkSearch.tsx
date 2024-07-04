'use client';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import SearchBookmarks from '@/actions/SearchBookmark';

const BookmarkSearch: React.FC = () => {
  const [tags, setTags] = useState('');
  const [results, setResults] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await SearchBookmarks(tags)
      const data = response[0]?.text
      setResults(data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
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
              {results}
        {/* {results.length > 0 ? (
          <ul>
            {results.map((bookmark: any) => (
              <li key={bookmark.id} className="mb-2">
                <h3 className="font-bold">{bookmark.title}</h3>
                <p>{bookmark.text}</p>
                <p>Tags: {bookmark.tags.join(', ')}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookmarks found</p>
        )} */}
      </div>
    </div>
  );
};

export default BookmarkSearch;
