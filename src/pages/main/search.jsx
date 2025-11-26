import { useEffect, useState } from "react";
import { useYouTube } from "../../youtuneContext";
import axios from "axios";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export default function Search() {
  const { searchQuery, setSearchQuery } = useYouTube();
    const [videos, setVideos] = useState([]);
    
  useEffect(() => {
    if (!searchQuery) return;

    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              maxResults: 15,
              q: searchQuery,
              type: "video",
              key: API_KEY,
            },
          }
        );

        setVideos(res.data.items);
      } catch (err) {
        console.error("Search fetch error:", err);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);
  console.log(videos);

  return (
    //   {render results}
    <section className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3    sm:gap-4 ">
      {videos.length !== 0 ? (
        videos.map((video) => (
          <div key={video.id.videoId}>
            <Link
              to={`/video/${video.id.videoId}`}
              state={{ video, videos }}
              className="block   overflow-hidden "
            >
              {/* thumbnail */}
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full  md:rounded-2xl border "
              />

              <div className="flex items-start pt-[calc(.6rem+.5vw)] gap-3  px-[calc(.6rem+.6vw)] sm:px-0 ">

                {/* title */}
                <div className="flex items-start justify-between  w-full">
                  <div>
                    <h3 className="line-clamp-2 text-[clamp(.87rem,1vw,3rem)] leading-tight">
                      {video.snippet.title}
                    </h3>
                    {/* <div className="flex items-center line-clamp-2 text-secondary2 gap-[calc(.1rem+.1vw)] text-[clamp(.74rem,.9vw,2rem)]">
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
                    </div> */}
                  </div>
                  <div>
                    <HiOutlineDotsVertical />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p>No videos found 😔</p>
      )}
    </section>
  );
}
