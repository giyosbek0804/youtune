import React from "react";
import { useYouTube } from "../../youtuneContext";
import { Link } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";

function LikedVideos() {
  const { likes, user } = useYouTube();

  if (!user) {
    return (
      <div className="text-primary1 text-center pt-20">
        <h1 className="text-2xl font-bold">Please login to see your liked videos</h1>
      </div>
    );
  }

  return (
    <div className="w-full px-[calc(1rem+2vw)] py-8 min-h-screen bg-background">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-zinc-800 rounded-full">
          <FaThumbsUp className="text-3xl text-primary1" />
        </div>
        <h1 className="text-3xl font-bold text-primary1">Liked Videos</h1>
      </div>
      
      {likes.length === 0 ? (
        <p className="text-secondary2">You haven't liked any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likes.map((video) => (
            <Link
              key={video.id?.videoId || video.id}
              to={`/video/${video.id?.videoId || video.id}`}
              state={{ video }}
              className="flex flex-col gap-3 group"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-primary1 font-medium line-clamp-2 text-sm leading-tight">
                  {video.snippet.title}
                </h3>
                <p className="text-primary1 text-xs mt-1 font-medium">
                  {video.snippet.channelTitle}
                </p>
                <p className="text-secondary2 text-xs mt-0.5">
                  {video.channelSubscriberCount 
                    ? `${video.channelSubscriberCount} subscribers` 
                    : "Subscribers hidden"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedVideos;