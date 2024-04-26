"use client";

import React, { useState } from "react";
import { supabase } from "@/app/utils/supabase/supabase";

interface FileUploadProps {
  onUpload: () => void; // Function to trigger refresh
}

const FileUpload: React.FC<FileUploadProps> = ({onUpload}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileFlag, setfileFlag] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from("SnapSync Photos")
        .upload(`Sample_Event/${selectedFile.name}`, selectedFile);

      if (error) {
        throw error;
      }

      alert("File uploaded successfully.");
      onUpload();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }

    setfileFlag(true);
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        className="text-white bg-slate-400 z-110"
      />
      <button onClick={uploadFile} className="z-100">
        Upload File
      </button>
    </div>
  );
};

export default FileUpload;
