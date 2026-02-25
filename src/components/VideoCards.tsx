import { YouTubeEmbed } from "@next/third-parties/google";
import React from "react";

type VideoItemsProps = {
  videoItems: {
    //id?: number;
    $id?: string;
    title?: string;
    name?: string;
    url?: string;
    youtubeCode?: string;
  }[];
};

const VideoCards = ({ videoItems }: VideoItemsProps) => {
  return (
    <div className="flex flex-wrap gap-8  justify-center">
      {videoItems.map((video) => {
        const videoId = video.$id || '';
        const videoTitle = video.name || video.title || '';
        const videoUrl = video.youtubeCode || video.url || '';
        
        return (
          <div
            key={videoId}
            className="flex flex-col items-center bg-gray-300 p-2 rounded-xl "
          >
            <h2 className="text-xl font-bold mb-2">{videoTitle}</h2>
            <div className="aspect-video ">
              <YouTubeEmbed
                videoid={videoUrl}
                height={100}
                width={400}
                params="controls=1&autoplay=1&mute=0&playsinline=1&loop=0"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VideoCards;
