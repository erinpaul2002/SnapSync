// Import necessary modules and components
"use client";
import { ChangeEvent, SetStateAction, useState } from "react";
import { AuroraBackground } from "../components/ui/aurora_background";
import { Meteors } from "../components/ui/meteors";
import BackButton from "../components/back_button";

// Parent component for the image search page
export default function ImageSearchPage() {
  // State to store event name and selected image
  const [eventName, setEventName] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

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

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Validate event name
      if (!eventName.trim()) {
        throw new Error("Event name cannot be empty");
      }

      // Validate image selection
      if (!selectedImage) {
        throw new Error("Please select an image");
      }

      // You can perform any desired operations with the selected image here,
      // such as saving it locally or using it in other processes.

      // Clear form fields after successful submission
      setEventName("");
      setSelectedImage("");

      // Show success message
      alert("Event Valid");
    } catch (error :any) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AuroraBackground className=" bg-slate-950" />
      <div className="w-full relative max-w-lg m-0 flex justify-center items-center"> {/* Adjusted max-width to max-w-lg */}
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-4 py-8 h-min overflow-hidden rounded-2xl flex flex-col justify-center items-center"> {/* Modified flex properties */}
          <BackButton />
          <h1 className="font-bold text-xl text-white relative z-50 m-0 p-0"> {/* Removed place-self-center */}
            IMAGE SEARCH
          </h1>
          {/* Display selected image */}
          {selectedImage && (
            <div className="w-full mb-4 flex justify-center">
              <img src={selectedImage} alt="Selected Image" className="w-full h-auto rounded-md" style={{ maxWidth: '300px', maxHeight: '300px' }} /> {/* Display selected image in a rectangle */}
            </div>
          )}
          {/* Event name input */}
          <input
            type="text"
            value={eventName}
            onChange={handleEventNameChange}
            placeholder="Enter event name"
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
          />
          {/* Image upload input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
          />
          {/* Submit button */}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Submit
          </button>

          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
