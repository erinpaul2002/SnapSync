import React, { useState } from "react";
import { supabase } from "@/app/utils/supabase/supabase"; // Correct import of configured Supabase client

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
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("SnapSync Photos")
      .upload(`eventFolder/${fileName}`, file);

    if (error) {
      throw new Error(error.message);
    }
    const response = supabase.storage.from("SnapSync Photos").getPublicUrl(`eventFolder/${fileName}`);
    return response.data.publicUrl
  };

  const findMatches = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await uploadFileToSupabase(file);  // Ensure this call is awaited and correctly handled

      const response = await fetch('http://localhost:5000/find-matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageUrl, eventName: 'Sample_Event' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setMatchingImages(result.matching_images);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to find matches. Please try again.');
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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          className="text-white bg-slate-400 z-110"
        />
        <button type="submit" disabled={isLoading} className="z-100">
          Find Matches
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {matchingImages.length > 0 && (
        <div>
          <h3>Matching Images:</h3>
          <ul>
            {matchingImages.map((image, index) => (
              <li key={index}>{image}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchUpload;
