"use client";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { GenerateTags } from "../../app/Tags/actions";
import { Button } from "../ui/button";
import CreateBookmark from "@/actions/CreateBookmark";
const BookmarkForm: React.FC = () => {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic
    const data = await GenerateTags(text);
    console.log("Bookmark submitted:", text);
    const Tags = data.tags;
    await CreateBookmark({ Tags, text });
    setTags(data.tags);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write your bookmark here..."
        rows={4}
        className="w-full p-2 border rounded-md"
      />
      <Button type="submit" className="mt-2">
        Submit
      </Button>
    </form>
  );
};

export default BookmarkForm;
