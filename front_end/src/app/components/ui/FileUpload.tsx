"use client";

import React, { useState } from "react";
import { supabase } from "@/app/utils/supabase/supabase";

interface FileUploadProps {
  onUpload: () => void; // Function to trigger refresh
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileFlag, setfileFlag] = useState(false);
  const eventName =
    typeof window !== "undefined" ? localStorage.getItem("eventName") : null;

  if (!eventName) {
    console.log("Event name is not set.");
    return;
  }

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
        .upload(`${eventName}/${selectedFile.name}`, selectedFile);

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
    <div className="object-contain mx-auto mt-6 mb-0">
      <div className="flex gap-6 justify-center place-items-center">
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            color: "#fff",
            backgroundColor: "#4b5563",
            padding: "0.5rem 0.75rem",
            placeItems: "center",
            borderRadius: "0.375rem",
            outline: "none",
            border: "1px solid transparent",
            transition:
              "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          }}
          className="m-0 w-1/3"
        />
        <button
          onClick={uploadFile}
          style={{
            width: "6rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "#fff",
            borderRadius: "0.375rem",
            outline: "none",
            placeSelf: "center",
            border: "1px solid transparent",
            transition:
              "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
          }}
        >
          Submit
        </button>
      </div>
    </div>
    // <div>
    //   <input
    //     type="file"
    //     onChange={handleFileChange}
    //     className="text-white bg-slate-400 z-110"
    //   />
    //   <button onClick={uploadFile} className="z-100">
    //     Upload File
    //   </button>
    // </div>
  );
};

export default FileUpload;
