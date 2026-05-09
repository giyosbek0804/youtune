import React, { useState } from "react";
import { useYouTube } from "../../youtuneContext";
import { Link } from "react-router-dom";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";

function WatchLater() {
  const { watchLater, user, removeItem } = useYouTube();
  const [activeMenu, setActiveMenu] = useState(null);

  if (!user) {
    return (
      <div className="text-primary1 text-center pt-20">
        <h1 className="text-2xl font-bold">Please login to see your saved videos</h1>
      </div>
    );
  }

  return (
    <div className="w-full px-[calc(1rem+2vw)] py-8 min-h-screen bg-background" onClick={() => setActiveMenu(null)}>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-zinc-800 rounded-full">
          <MdOutlineAccessTimeFilled className="text-3xl text-primary1" />
        </div>
        <h1 className="text-3xl font-bold text-primary1">Watch Later</h1>
      </div>
      
      {watchLater.length === 0 ? (
        <p className="text-secondary2">You haven't saved any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {watchLater.map((video, index) => (
            <div key={video.id?.videoId || video.id} className="relative group">
              <Link
                to={`/video/${video.id?.videoId || video.id}`}
                state={{ video }}
                className="flex flex-col gap-3"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col pr-8">
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

              {/* 3 Dots Menu */}
              <div className="absolute top-[calc(100%-40px)] right-0 md:top-auto md:bottom-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === index ? null : index);
                  }}
                  className="p-1 text-primary1 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <HiOutlineDotsVertical />
                </button>
                
                {activeMenu === index && (
                  <div className="absolute right-0 bottom-full mb-2 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-lg py-2 w-48 z-10">
                    <button 
                      onClick={() => removeItem("watchLater", video)}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-800 transition-colors"
                    >
                      Remove from Watch Later
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchLater;