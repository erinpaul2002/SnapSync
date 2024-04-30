// Import necessary modules and components
"use client";
import { ChangeEvent, SetStateAction, useState } from "react";
import { AuroraBackground } from "../components/ui/aurora_background";
import { Meteors } from "../components/ui/meteors";
import BackButton from "../components/back_button"; 
import { supabase } from "../utils/supabase/supabase";
import SearchGalleryComp from "../components/ui/SearchGalleryComp";


// Parent component for the image search page
export default function ImageSearchPage() {
  // State to store event name and selected image
  const [eventName, setEventName] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
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
        body: JSON.stringify({ imageUrl: imageUrl, eventName: eventName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setMatchingImages(result.matching_images);
      console.log(matchingImages);
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

  // Function to handle event name change
  const handleEventNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEventName(event.target.value);
  };

  // Function to handle image selection
  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      setSelectedImage(imageUrl); // Set the selected image URL
    }
  };

  return (
    <div className="bg-black w-auto">
      <BackButton />
      <section className="text-gray-600 body-font z-100">
      <AuroraBackground className="fixed bg-slate-800 overflow-auto" >
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-4xl text-2xl title-font mb-4 text-white font-bold z-50">
              SnapSync
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-white z-50"></p>
            <div className="z-100 flex flex-col gap-6 place-self-center mt-10">
              <input
                type="text"
                value={eventName}
                onChange={handleEventNameChange}
                placeholder="Enter event name"
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "#374151",
                  color: "#fff",
                  borderRadius: "0.375rem",
                  outline: "none",
                  border: "1px solid transparent",
                  transition:
                    "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                }}
                className="focus:ring focus:border-blue-300 mb-4"
              />

              <form onSubmit={handleSubmit} className=" flex flex-col gap-6">
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
                  className="m-0"
                />
                <button
                  onClick={handleSubmit}
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
                  disabled={isLoading}
                >
                  Submit
                </button>
              </form>
            </div>
            <div>
              {isLoading && <p className="mt-2 text-slate-200">Loading...</p>}
              {error && <p className="error">{error}</p>}
              {matchingImages.length > 0 && (
                <div>
                  <h1 className="text-4xl mb-10 mt-5 font-medium text-white underline">
                    Matching Images:
                  </h1>
                  <div className="flex flex-wrap -m-4">
                    {matchingImages.map((img_url, index) => (
                      <SearchGalleryComp
                        key={`${img_url.split("/")[-1]}-${index}`}
                        imageUrl={img_url}
                        title={img_url.split("/")[img_url.split("/").length -1]}
                        subtitle={"From Supabase"}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </AuroraBackground>
      </section>

    </div>
  );
}
