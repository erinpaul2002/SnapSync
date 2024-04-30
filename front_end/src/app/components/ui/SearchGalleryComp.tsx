import React from "react";
import Image from "next/image";
import { supabase } from "@/app/utils/supabase/supabase";
import { saveAs } from "file-saver";

interface GalleryImageHolderProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

const handleDownload = async (imageUrl: string, title: string) => {
  saveAs(imageUrl, title);
};
const SearchGalleryComp = ({
  imageUrl,
  subtitle,
  title,
}: GalleryImageHolderProps) => {
  if (title !== "dummy.jpg") {
    return (
      <div className="lg:w-1/3 sm:w-1/2 p-4">
        <div className="relative h-80">
          <Image
            alt="gallery"
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={imageUrl}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 flex flex-col justify-between bg-black bg-opacity-50 p-4 transition-opacity duration-300 opacity-0 hover:opacity-100">
            <div>
              <h2 className="text-xs text-white">{subtitle}</h2>
              <h1 className="text-lg text-white font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
                {title}
              </h1>
            </div>
            <div className="flex justify-between items-center place-self-center w-auto">
              <button
                onClick={() => handleDownload(imageUrl, title)}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-auto"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null; // Return null if it's a dummy image
  }
};

export default SearchGalleryComp;
