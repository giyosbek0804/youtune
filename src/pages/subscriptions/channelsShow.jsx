import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useYouTube } from "../../youtuneContext";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function ChannelsShow() {
  const { channelId } = useParams();
  const { subscriptions, subscribeChannel, unSubscribeChannel, token } = useYouTube();
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSubscribed = subscriptions.some(
    (sub) => sub.snippet.resourceId.channelId === channelId
  );

  const fetchChannelData = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Fetch channel details
      const channelRes = await axios.get(
        "https://www.googleapis.com/youtube/v3/channels",
        {
          params: {
            part: "snippet,statistics,brandingSettings",
            id: channelId,
            key: API_KEY,
          },
        }
      );
      setChannelData(channelRes.data.items[0]);

      // 2. Fetch channel videos
      const videoRes = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            channelId: channelId,
            maxResults: 50,
            order: "date",
            type: "video",
            key: API_KEY,
          },
        }
      );
      
      // Get full video stats for the search results
      const videoIds = videoRes.data.items.map(v => v.id.videoId).join(",");
      const statsRes = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,statistics,contentDetails",
            id: videoIds,
            key: API_KEY,
          },
        }
      );

      setVideos(statsRes.data.items);
    } catch (err) {
      console.error("Error fetching channel data:", err);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchChannelData();
  }, [fetchChannelData]);

  if (loading) {
    return (
      <div className="w-full flex justify-center pt-20">
        <span className="loading loading-spinner loading-lg text-primary1"></span>
      </div>
    );
  }

  if (!channelData) {
    return <div className="text-primary1 text-center pt-20">Channel not found</div>;
  }

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Banner */}
      {channelData.brandingSettings?.image?.bannerExternalUrl && (
        <div className="w-full h-[calc(10vw+100px)] overflow-hidden">
          <img
            src={channelData.brandingSettings.image.bannerExternalUrl}
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Channel Header */}
      <div className="px-[calc(1rem+2vw)] py-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={channelData.snippet.thumbnails.high?.url || channelData.snippet.thumbnails.medium.url}
          alt={channelData.snippet.title}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-zinc-800"
        />
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl font-bold text-primary1">{channelData.snippet.title}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-1 text-secondary2 text-sm">
            <span>{channelData.snippet.customUrl}</span>
            <span>&middot;</span>
            <span>
              {Number(channelData.statistics.subscriberCount).toLocaleString()} subscribers
            </span>
            <span>&middot;</span>
            <span>{channelData.statistics.videoCount} videos</span>
          </div>
          <p className="mt-3 text-secondary2 line-clamp-2 max-w-2xl text-sm">
            {channelData.snippet.description}
          </p>
          <button
            disabled={!token}
            onClick={() =>
              isSubscribed
                ? unSubscribeChannel(channelId, channelData.snippet.title)
                : subscribeChannel(channelId, channelData.snippet.title)
            }
            className={`mt-4 px-6 py-2 rounded-full font-medium transition-colors ${
              isSubscribed
                ? "bg-zinc-800 text-white hover:bg-zinc-700"
                : "bg-primary1 text-background hover:bg-zinc-200"
            } ${!token ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>

      <hr className="border-zinc-800 mx-[calc(1rem+2vw)]" />

      {/* Videos Grid */}
      <div className="px-[calc(1rem+2vw)] py-8">
        <h2 className="text-xl font-bold text-primary1 mb-6">Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              state={{ video, videos }}
              className="flex flex-col gap-3 group"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col min-w-0">
                  <h3 className="text-primary1 font-medium line-clamp-2 text-sm leading-tight">
                    {video.snippet.title}
                  </h3>
                  <div className="text-secondary2 text-xs mt-1">
                    <p>
                      {Number(video.statistics.viewCount).toLocaleString()} views &middot;{" "}
                      {formatDistanceToNow(new Date(video.snippet.publishedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChannelsShow;
