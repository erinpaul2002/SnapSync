import React from "react";
import Image from "next/image";
import { supabase } from "@/app/utils/supabase/supabase";

interface GalleryImageHolderProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

const deleteImage = async (imgpath:string) => {
  try {
    const { data, error } = await supabase
      .storage
      .from('SnapSync Photos')
      .remove([imgpath]);

    if (error) {
      throw error;
    }

    console.log('Image deleted successfully:', data);
    
  } catch (error:any) {
    console.error('Error deleting image:', error.message);
  }
};
const handleDelete = async (imgurl:string) => {
  const url = new URL(imgurl);
  const imagePathToDelete = url.pathname.split("/").slice(-2).join("/"); 
  console.log(url)
  console.log(imagePathToDelete)
  await deleteImage(imagePathToDelete);
};

const GalleryImageHolder = ({
  imageUrl,
  subtitle,
  title,
}: GalleryImageHolderProps) => {
  return (
    <div className="lg:w-1/3 sm:w-1/2 p-4">
      <div className="flex relative">
        <img
          alt="gallery"
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={imageUrl}
        />
        
        <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
          <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">
            {subtitle}
          </h2>
          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
            {title}
          </h1>
          <button className="mr-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Download</button>
          <button onClick={() => handleDelete(imageUrl)} className="absolute top-0 right-0 m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full">X</button>

        </div>
      </div>
    </div>
  );
};

export default GalleryImageHolder;
