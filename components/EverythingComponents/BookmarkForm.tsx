"use client";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import CreateBookmark from "@/actions/CreateBookmark";

const BookmarkForm: React.FC = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true during submission
    try {
      // Handle the form submission logic
      await CreateBookmark({ Text: text });
      setText("");
    } catch (error) {
      console.error("Error creating bookmark:", error);
    } finally {
      setIsLoading(false); // Reset loading state after submission completes
    }
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
      <Button type="submit" className="mt-2" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default BookmarkForm;
