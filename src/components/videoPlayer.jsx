import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

import { useLocation, Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const VideoPlayer = () => {
  const location = useLocation();
  const [relatedVideos, setRelatedVideos] = useState([]);
  // const [videos, setVideos] = useState([]);
  const { video, videos } = location.state;
  const fetchVideos = useCallback(
    async (pageToken = "") => {
      // setLoading(true);

      try {
        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              part: "snippet,contentDetails,statistics",
              chart: "mostPopular",
              regionCode: "US",
              maxResults: 50,
              order: "viewCount",
              key: API_KEY,
              pageToken: pageToken || undefined,
              videoCategoryId: video.snippet.categoryId,
            },
          }
        );

        const items = res.data.items || [];
        const newNextPage = res.data.nextPageToken || "";

        // Fetch channel thumbnails
        const channelIds = [
          ...new Set(items.map((v) => v.snippet.channelId)),
        ].join(",");
        let channelMap = {};
        if (channelIds) {
          const chRes = await axios.get(
            "https://www.googleapis.com/youtube/v3/channels",
            {
              params: { part: "snippet", id: channelIds, key: API_KEY },
            }
          );
          (chRes.data.items || []).forEach((ch) => {
            channelMap[ch.id] = ch.snippet?.thumbnails?.default?.url || "";
          });
        }

        const itemsWithChannels = items.map((v) => ({
          ...v,
          channelThumbnail: channelMap[v.snippet.channelId] || "",
        }));

        setRelatedVideos((prev) => {
          const newVideos = itemsWithChannels.filter(
            (v) => !prev.some((p) => p.id === v.id)
          );
          return [...prev, ...newVideos];
        });
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        // setLoading(false);
      }
    },
    [video.snippet.categoryId]
  );
  useEffect(() => {
    setRelatedVideos([]); // reset when opening new video
    fetchVideos(); // load category videos
  }, [video.id]);

  console.log(relatedVideos);

  return (
    <div className=" w-full relative    flex justify-between ">
      {/* Video Player */}
      <div className="w-full fixed   left-0  top-[calc(2rem+2vw)]  md:top-[calc(2.5rem+2.5vw)] z-9 bg-background">
        <iframe
          allow="autoplay"
          className="w-full  md:rounded-[20px] h-[calc(9.5rem+13vw)]"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=0`}
          title={video.snippet.title}
        ></iframe>
      </div>
      {/* suggestions */}
      <div className="pt-[calc(8rem+11vw)] relative  w-full ">
        {/* video details */}
        <div className="">
          {/* video info */}
          <div className="flex px-[calc(1rem+1vw)] border items-start justify-between  w-full">
            <div className="  py-[calc(.7em+.5vw)]">
              <h3 className="line-clamp-2 text-[clamp(1.05rem,1.3vw,3rem)] font-medium leading-tight">
                {video.snippet.title}
              </h3>
              <div className="flex items-center line-clamp-2 text-secondary2 py-[calc(.2rem+.2vw)] gap-[calc(.1rem+.1vw)] text-[clamp(.74rem,.9vw,2rem)]">
                <p>
                  {video.statistics.viewCount >= 1_000_000_000
                    ? `${(video.statistics.viewCount / 1_000_000_000).toFixed(
                        0
                      )}B views`
                    : video.statistics.viewCount >= 1_000_000
                    ? `${(video.statistics.viewCount / 1_000_000).toFixed(
                        0
                      )}M views`
                    : video.statistics.viewCount >= 1_000
                    ? `${(video.statistics.viewCount / 1_000).toFixed(
                        0
                      )}K views`
                    : `${video.statistics.viewCount} views`}{" "}
                  &middot;{" "}
                  {formatDistanceToNow(new Date(video.snippet.publishedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
    
          </div>
          <div className="border  ">
            <img src={video.channelThumbnail} alt="" />
          </div>
        </div>
        {relatedVideos.length > 0 ? (
          relatedVideos
            .filter((v) => v.id !== video.id)
            .map((v) => (
              <Link
                key={v.id}
                to={`/video/${v.id}`}
                state={{ video: v, videos }}
              >
                <div className="w-full ">
                  <img
                    src={v.snippet.thumbnails.high.url}
                    alt={v.snippet.title}
                    className="w-full h-auto"
                  />
                  <p>{v.snippet.title}</p>
                </div>
              </Link>
            ))
        ) : (
          <p className="px-[calc(1rem+1vw)]">No related videos found 😔</p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
