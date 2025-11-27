import React, { useCallback, useEffect, useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const VideoPlayer = () => {
  const location = useLocation();
  const { video, videos } = location.state || {};
  const [fullVideo, setFullVideo] = useState(video || null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const { id } = useParams();
  const videoId = video?.id?.videoId || video?.id || id;
  const fetchVideos = useCallback(
    async (pageToken = "") => {
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

        // Fetch channel thumbnails

        let channelMap = {};

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
    async function loadFullDetails() {
      // Search API does NOT provide categoryId, statistics, etc
      if (!video.snippet.categoryId) {
        try {
          const res = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
              params: {
                part: "snippet,statistics,contentDetails",
                id: videoId,
                key: API_KEY,
              },
            }
          );

          // Replace with full details
          setFullVideo(res.data.items[0]);
        } catch (err) {
          console.error("Failed to load full video details", err);
        }
      } else {
        // Already full data
        setFullVideo(video);
      }
    }

    loadFullDetails();
  }, [videoId]);

  useEffect(() => {
    if (!fullVideo?.snippet?.categoryId) return; // wait until loaded

    async function fetchRelated() {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              maxResults: 50,
              type: "video",
              relatedToVideoId: videoId,
              key: API_KEY,
            },
          }
        );
        setRelatedVideos(response.data.items);
      } catch (err) {
        console.error("Failed to load related videos", err);
      }
    }

    fetchRelated();
  }, [videoId, fullVideo]);

  useEffect(() => {
    setRelatedVideos([]); // reset when opening new video
    fetchVideos(); // load category videos
  }, [videoId]);
  useEffect(() => {
    if (!video && id) {
      async function fetchDirectVideo() {
        try {
          const res = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
              params: {
                part: "snippet,statistics,contentDetails",
                id,
                key: API_KEY,
              },
            }
          );
          setFullVideo(res.data.items[0]);
        } catch (err) {
          console.error("Failed to fetch direct video", err);
        }
      }

      fetchDirectVideo();
    }
  }, [id, video]);

  console.log(relatedVideos);

  return (
    <div className=" w-full relative    gap-[calc(1rem+1vw)]   flex justify-between ">
      {/* Video Player */}
      <div className="w-full fixed  lg:relative  left-0  top-[calc(2rem+2vw)] lg:w-7/10  md:top-[calc(2.5rem+2.5vw)] lg:top-0 z-9 bg-background">
        <iframe
          allow="autoplay"
          allowFullScreen
          className="w-full lg:rounded-[15px]  h-[calc(8rem+22vw)] md:h-[calc(9rem+25vw)]"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={video.snippet.title}
        ></iframe>
        <div className="max-lg:hidden">
          {/* video info */}
          <div className="flex px-[calc(1rem+1vw)]  items-start justify-between  w-full">
            <div className="  py-[calc(.7em+.5vw)]">
              <h3 className="line-clamp-2 text-[clamp(1.05rem,1.3vw,3rem)] font-medium leading-tight text-primary1">
                {video.snippet.title}
              </h3>
              <div className="flex items-center line-clamp-2 text-secondary2 py-[calc(.2rem+.2vw)] gap-[calc(.1rem+.1vw)] text-[clamp(.74rem,.9vw,2rem)]"></div>
            </div>
          </div>
          <div className=" ">
            <img src={video.channelThumbnail} alt="" />
          </div>
        </div>
      </div>
      {/* suggestions */}
      <div className="pt-[calc(10rem+11vw)] lg:pt-0 relative   w-full lg:w-3/10   ">
        {/* video details */}
        <div className="lg:hidden">
          {/* video info */}
          <div className="flex px-[calc(1rem+1vw)]  items-start justify-between  w-full">
            <div className="  py-[calc(.7em+.5vw)]">
              <h3 className="line-clamp-2 text-white text-[clamp(1.05rem,1.3vw,3rem)] font-medium leading-tight">
                {video.snippet.title}
              </h3>
              <div className="flex items-center line-clamp-2 text-secondary2 py-[calc(.2rem+.2vw)] gap-[calc(.1rem+.1vw)] text-[clamp(.74rem,.9vw,2rem)]"></div>
            </div>
          </div>
          <div className=" ">
            <img src={video.channelThumbnail} alt="" />
          </div>
        </div>
        {/* related videos */}
        {relatedVideos.length > 0 ? (
          relatedVideos
            .filter((v) => v.id !== videoId)
            .map((v) => (
              <Link
                key={v.id}
                to={`/video/${v.id}`}
                state={{ video: v, videos }}
              >
                <div className="w-full xl:flex max-xl:mb-[calc(.5rem+.4vw)]  my-[calc(.2rem+.2vw)] gap-2">
                  <img
                    src={v.snippet.thumbnails.medium.url}
                    alt={v.snippet.title}
                    className="w-full xl:w-2/5 h-auto lg:rounded-[10px]"
                  />
                  <div className="xl:w-3/5 max-xl:pt-[calc(.15rem+.15vw)]  font-medium  max-md:px-[calc(.4rem+.4vw)] ">
                    <div className="w-full">
                      <p className=" text-[clamp(.85rem,.85vw,2.5rem)] line-clamp-2 text-primary1  ">
                        {v.snippet.title}
                      </p>
                      <p className="text-secondary2 py-[calc(.05rem+.1vw)] text-[clamp(.8rem,.8vw,2.2rem)]">
                        {v.snippet.channelTitle}
                      </p>
                      <p className="text-[clamp(.7rem,.72vw,2rem)] text-secondary2">
                        {v.statistics.viewCount >= 1_000_000_000
                          ? `${(v.statistics.viewCount / 1_000_000_000).toFixed(
                              0
                            )}B views`
                          : v.statistics.viewCount >= 1_000_000
                          ? `${(v.statistics.viewCount / 1_000_000).toFixed(
                              0
                            )}M views`
                          : v.statistics.viewCount >= 1_000
                          ? `${(v.statistics.viewCount / 1_000).toFixed(
                              0
                            )}K views`
                          : `${v.statistics.viewCount} views`}{" "}
                        &middot;{" "}
                        {formatDistanceToNow(new Date(v.snippet.publishedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
        ) : (
          <p className="px-[calc(1rem+1vw)]  pt-[calc(1rem+3vw)] text-center">
            No related videos found 😔
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
