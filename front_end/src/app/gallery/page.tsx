"use client";

import React, { useEffect, useState } from "react";
import GalleryImageHolder from "../components/ui/GalleryImageHolder";
import { supabase } from "@/app/utils/supabase/supabase";

interface ImageInfo {
  imageUrl: string;
  title: string;
  subtitle: string;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageInfo[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase.storage
        .from("your-bucket-name")
        .list("folder-path", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        console.error("Error fetching images:", error);
        return;
      }

      if (data) {
        const urls = await Promise.all(
          data.map(async (file) => {
            const response = await supabase.storage
              .from("SnapSync Photos")
              .getPublicUrl(`Sample_Event/${file.name}`);
            if (!response) {
              console.error("Error getting public URL:", response);
              return null;
            }

            return {
              imageUrl: response.data.publicUrl, // Correct access to the publicUrl
              title: file.name,
              subtitle: "From Supabase",
            };
          })
        );

        // Filter out any null values (in case of errors)
        setImages(urls.filter((url): url is ImageInfo => url !== null));
      }
    }

    fetchImages();
  }, []);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Master Cleanse Reliac Heirloom
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
            gentrify, subway tile poke farm-to-table.
          </p>
          <div>
            <input type="file" />
            <button>Upload File</button>
          </div>
        </div>
        <div className="flex flex-wrap -m-4">
          {images.map((img) => (
            <GalleryImageHolder
              key={img.imageUrl}
              imageUrl={img.imageUrl}
              title={img.title}
              subtitle={img.subtitle}
            />
          ))}
          <GalleryImageHolder
            imageUrl="https://suvgasxjlxfjzibnbyfk.supabase.co/storage/v1/object/public/SnapSync%20Photos/Sample_Event/photo_2023-12-03_11-14-41.jpg"
            title="something"
            subtitle="nothing"
          />
        </div>
      </div>
    </section>
  );
}
