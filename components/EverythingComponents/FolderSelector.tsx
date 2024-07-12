// components/FolderSelector.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface Folder {
  id: number;
  name: string;
}

interface FolderSelectorProps {
  folders: Folder[];
  onSelectFolder: (folderId: number) => void;
  onClose: () => void;
}

const FolderSelector: React.FC<FolderSelectorProps> = ({
  folders,
  onSelectFolder,
  onClose,
}) => {
  return (
    <div className="absolute bottom-full left-0 w-full bg-[#1d1e28] p-4 rounded-lg shadow-lg mb-2">
      <h3 className="text-[#a7b4c6] font-nunito mb-4">Select a Folder</h3>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            className="bg-[#242531] text-[#a7b4c6] hover:bg-[#2a2b38] justify-start"
          >
            {folder.name}
          </Button>
        ))}
      </div>
      <Button onClick={onClose} className="mt-4 w-full bg-[#ff5924] hover:bg-[#ba3c11]">
        Cancel
      </Button>
    </div>
  );
};

export default FolderSelector;