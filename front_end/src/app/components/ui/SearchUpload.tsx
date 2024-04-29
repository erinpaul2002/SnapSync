import React, { useState } from "react";
import { supabase } from "@/app/utils/supabase/supabase"; // Correct import of configured Supabase client
import GalleryImageHolder from "./GalleryImageHolder";

const SearchUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [matchingImages, setMatchingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadFileToSupabase = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("SnapSync Photos")
      .upload(`eventFolder/${fileName}`, file);

    if (error) {
      throw new Error(error.message);
    }
    const response = supabase.storage
      .from("SnapSync Photos")
      .getPublicUrl(`eventFolder/${fileName}`);
    return response.data.publicUrl;
  };

  const findMatches = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await uploadFileToSupabase(file); // Ensure this call is awaited and correctly handled

      const response = await fetch("http://localhost:5000/find-matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: imageUrl, eventName: "poda" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setMatchingImages(result.matching_images);
      console.log(matchingImages)
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to find matches. Please try again.");
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first.");
    } else {
      findMatches(selectedFile);
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className=" flex flex-col gap-6">
        <input
          type="file"
          onChange={handleFileChange}
          className="text-white bg-slate-400 z-110"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 w-24 place-self-center bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          disabled={isLoading}
        >
          Submit
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {matchingImages.length > 0 && (
        <div>
          <h1>Matching Images:</h1>
          <div className="flex flex-wrap -m-4">
            {matchingImages.map((img_url,index) => (
              <GalleryImageHolder
                key={`${img_url.split("/")[-1]}-${index}`}
                imageUrl={img_url}
                title={img_url.split("/")[-1]}
                subtitle={"From Supabase"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUpload;