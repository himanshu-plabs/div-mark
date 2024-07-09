"use client";
import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import CreateBookmark from "@/actions/CreateBookmark";

const BookmarkForm: React.FC = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height - important to shrink on delete
      textarea.style.height = 'auto';
      // Set height based on scroll height
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" font-nunito">
      <div className="w-[232px] min-h-[200px] p-5 pt-[14px] rounded-md bg-[#1e1f2a] ">
        <label htmlFor="textarea" className="text-[#ff5924] text-xs tracking-widest " >ADD A NEW NOTE</label>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Start typing here..."
        rows={4}
        className="w-full rounded-md border-none resize-none focus:ring-0 focus:outline-none bg-transparent placeholder-[#5f697e]   overflow-hidden"
        style={{
          minHeight: '4em', // Ensure the textarea has an initial height corresponding to 4 rows
        }}
      />
</div>
      {/* <Button type="submit" className="mt-2" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </Button> */}
    </form>
  );
};

export default BookmarkForm;
