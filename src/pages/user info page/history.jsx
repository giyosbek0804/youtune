import React, { useState } from "react";
import { useYouTube } from "../../youtuneContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { HiOutlineDotsVertical } from "react-icons/hi";

function History() {
  const { history, user, removeItem } = useYouTube();
  const [activeMenu, setActiveMenu] = useState(null);

  if (!user) {
    return (
      <div className="text-primary1 text-center pt-20">
        <h1 className="text-2xl font-bold">Please login to see your history</h1>
      </div>
    );
  }

  return (
    <div className="w-full px-[calc(1rem+2vw)] py-8 min-h-screen bg-background" onClick={() => setActiveMenu(null)}>
      <h1 className="text-3xl font-bold text-primary1 mb-8">Watch History</h1>
      
      {history.length === 0 ? (
        <p className="text-secondary2">You haven't watched any videos yet.</p>
      ) : (
        <div className="flex flex-col gap-6 max-w-4xl">
          {[...history].reverse().map((video, index) => (
            <div key={`${video.id?.videoId || video.id}-${index}`} className="flex flex-col md:flex-row gap-4 group relative">
              <Link
                to={`/video/${video.id?.videoId || video.id}`}
                state={{ video }}
                className="flex flex-col md:flex-row gap-4 flex-1"
              >
                <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-0 pr-8">
                  <h3 className="text-primary1 font-medium text-lg line-clamp-2 leading-snug">
                    {video.snippet.title}
                  </h3>
                  <div className="text-secondary2 text-sm mt-1">
                    <p className="font-medium text-primary1">{video.snippet.channelTitle}</p>
                    <p>
                      {video.channelSubscriberCount 
                        ? `${video.channelSubscriberCount} subscribers` 
                        : "Subscribers hidden"}
                    </p>
                  </div>
                </div>
              </Link>

              {/* 3 Dots Menu */}
              <div className="absolute top-0 right-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === index ? null : index);
                  }}
                  className="p-2 text-primary1 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <HiOutlineDotsVertical />
                </button>
                
                {activeMenu === index && (
                  <div className="absolute right-0 top-10 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-lg py-2 w-48 z-10">
                    <button 
                      onClick={() => removeItem("history", video)}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-800 transition-colors"
                    >
                      Remove from history
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

export default History;