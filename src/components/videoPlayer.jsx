import React from "react";

import { useLocation, Link } from "react-router-dom";

const VideoPlayer = () => {
  const location = useLocation();

  const { video, videos } = location.state;

  return (
    <div className="video-player-page">
      {/* Video Player */}
      <div className="w-screen left-0 fixed top-[calc(2.2rem+2vw)] z-20 bg-red-500">
        <iframe
          className="w-full  h-[calc(12rem+10vw)]"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.snippet.title}
        ></iframe>
        <h2>{video.snippet.title}</h2>
      </div>
      {/* suggestions */}
      <div className="pt-[calc(12rem+11vw)]">
        <h3>Other Videos</h3>
        {videos
          .filter((v) => v.id !== video.id)
          .map((v) => (
            <Link key={v.id} to={`/video/${v.id}`} state={{ video: v, videos }}>
              <div className="w-screen border">
                <img
                  src={v.snippet.thumbnails.default.url}
                  alt={v.snippet.title}
                  className="w-full h-auto"
                />
                <p>{v.snippet.title}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
