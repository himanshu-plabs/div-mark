// components/CreateFolderForm.tsx
"use client";

import { useState } from "react";
import { CreateFolder } from "@/actions/CreateFolder";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function CreateFolderForm() {
  const [folderName, setFolderName] = useState("");
  const [result, setResult] = useState<{
    message?: string;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const folder = await CreateFolder(folderName);
      setResult({ message: `Folder '${folder.name}' created successfully!` });
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
      setFolderName("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter Folder Name"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Folder"}
        </Button>
      </form>
      {result?.error && <p>Error: {result.error}</p>}
      {result?.message && <p>{result.message}</p>}
    </div>
  );
}
