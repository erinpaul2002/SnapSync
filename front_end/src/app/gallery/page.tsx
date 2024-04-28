"use client";

import React, { useEffect, useState } from "react";
import GalleryImageHolder from "../components/ui/GalleryImageHolder";
import { supabase } from "@/app/utils/supabase/supabase";
import { AuroraBackground } from "../components/ui/aurora_background";
import FileUpload from "../components/ui/FileUpload";

interface ImageInfo {
  imageUrl: string;
  title: string;
  subtitle: string;
  key: string;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase.storage
        .from("SnapSync Photos")
        .list("Sample_Event", {
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
          data.map(async (file, index) => {
            const { data: response } = await supabase.storage
              .from("SnapSync Photos")
              .getPublicUrl(`Sample_Event/${file.name}`);

            return {
              imageUrl: response.publicUrl, // Correctly access the publicUrl directly
              title: file.name,
              subtitle: "From Supabase",
              key: `${file.name}-${index}`,
            };
          })
        );

        // Filter out any null values (in case of errors)
        setImages(urls.filter((url): url is ImageInfo => url !== null));
      }
    }

    fetchImages();
  }, [refreshFlag]);

  const triggerRefresh = () => {
    setRefreshFlag(!refreshFlag); // Toggle refreshFlag to trigger useEffect
  };

  return (
    <div className="bg-black">
      {/* <AuroraBackground className=" bg-slate-800" /> */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl title-font mb-4 text-white font-bold z-50">
              Maryum Kunjaadukalum
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-white z-50">
              Was this really the best IV? I wonder, but running over hot coals
              makes our small pretty baby feet all strong and rough
            </p>
            <div className="z-100">
              <FileUpload onUpload={triggerRefresh} />
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            {images.map((img) => (
              <GalleryImageHolder
                key={img.key}
                imageUrl={img.imageUrl}
                title={img.title}
                subtitle={img.subtitle}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
