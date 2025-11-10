import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function Content() {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);
  const loadingRef = useRef(false); // 🔹 keeps the live loading value

  // Sync ref whenever loading changes
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // Fetch videos
  const fetchVideos = useCallback(async (pageToken = "") => {
    if (loadingRef.current) return;
    setLoading(true);

    try {
      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,contentDetails,statistics",
            chart: "mostPopular",
            regionCode: "US",
            maxResults: 24,
            key: API_KEY,
            pageToken: pageToken || undefined,
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

      setVideos((prev) => {
        const newVideos = itemsWithChannels.filter(
          (v) => !prev.some((p) => p.id === v.id)
        );
        return [...prev, ...newVideos];
      });
      setNextPageToken(newNextPage);
      setHasMore(Boolean(newNextPage));
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // First load
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Observer logic
  const lastVideoRef = useCallback(
    (node) => {
      if (loadingRef.current) return; // use ref instead of stale state

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (
            entry.isIntersecting &&
            hasMore &&
            nextPageToken &&
            !loadingRef.current
          ) {
            // Immediately disconnect to prevent duplicate calls
            observerRef.current.disconnect();
            fetchVideos(nextPageToken);
          }
        },
        { root: null, rootMargin: "400px", threshold: 0.1 }
      );

      if (node) observerRef.current.observe(node);
    },
    [hasMore, nextPageToken, fetchVideos]
  );

  return (
    <section className="flex justify-center flex-wrap ">
      {videos.map((video, i) => {
        const isLastVideo = i === videos.length - 5;

        return (
          <div
            key={video.id || i}
            ref={isLastVideo ? lastVideoRef : null}
            className="my-[calc(.5rem+1vw)]"
          >
            <Link
              to={`/video/${video.id}`}
              state={{ video, videos }}
              className="block w-[100vw] md:w-[calc(15rem+11vw)] overflow-hidden md:rounded-2xl"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full"
              />

              <div className="flex items-start mt-2 gap-2">
                {video.channelThumbnail && (
                  <img
                    src={video.channelThumbnail}
                    alt={video.snippet.channelTitle}
                    className="w-[calc(2rem+2vw)] h-[calc(2rem+2vw)] rounded-full"
                  />
                )}
                <div>
                  <h3 className="line-clamp-2 text-[clamp(.9rem,1vw,3rem)] leading-tight">
                    {video.snippet.title}
                  </h3>
                  <div className="flex items-center text-secondary2 gap-[calc(.1rem+.1vw)] text-[clamp(.76rem,.9vw,2rem)]">
                    <p>
                      {video.snippet.channelTitle} &middot;{" "}
                      {video.statistics.viewCount >= 1_000_000_000
                        ? `${(
                            video.statistics.viewCount / 1_000_000_000
                          ).toFixed(0)}B views`
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
                      {formatDistanceToNow(
                        new Date(video.snippet.publishedAt),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}

      {loading && <p className="w-full text-center py-6">Loading...</p>}
    </section>
  );
}

export default Content;
