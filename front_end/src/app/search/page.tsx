// Import necessary modules and components
"use client";
import { useState } from "react";
import { AuroraBackground } from "../components/ui/aurora_background";
import { Meteors } from "../components/ui/meteors";
import New_Event_input from "../components/ui/new_input_field";

// Parent component for the image search page
export default function ImageSearchPage() {
  // State to store search query
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle search submission
  const handleSearchSubmit = () => {
    // Call API to search for similar images based on searchQuery
    // Display search results
    console.log("Searching for similar images with query:", searchQuery);
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
      <div className="w-full relative max-w-lg m-0"> {/* Adjusted max-width to max-w-lg */}
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-min overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <h1 className="font-bold text-xl text-white relative z-50 m-0 p-0 place-self-center">
            IMAGE SEARCH
          </h1>
          {/* Search component */}
          <div className="flex w-full mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              placeholder="Search for similar images..."
              className="w-full py-2 px-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={handleSearchSubmit}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Search
            </button>
          </div>

          {/* Display search results here */}
          {/* You can use a grid to display the images */}
          {/* Example: <div className="grid grid-cols-3 gap-4">...</div> */}

          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
