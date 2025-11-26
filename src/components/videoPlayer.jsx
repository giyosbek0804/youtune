// import axios from "axios";
// import { formatDistanceToNow } from "date-fns";
// import React, { useCallback, useEffect, useState } from "react";

// import { useLocation, Link } from "react-router-dom";

// const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
// const VideoPlayer = () => {
//   const location = useLocation();
//   const [relatedVideos, setRelatedVideos] = useState([]);
//   const { video, videos } = location.state;
//   const [fullVideo, setFullVideo] = useState(video);
//   const videoId = video.id || video.id.videoId;
//   const fetchVideos = useCallback(
//     async (pageToken = "") => {
//       try {
//         const res = await axios.get(
//           "https://www.googleapis.com/youtube/v3/videos",
//           {
//             params: {
//               part: "snippet,contentDetails,statistics",
//               chart: "mostPopular",
//               regionCode: "US",
//               maxResults: 50,
//               order: "viewCount",
//               key: API_KEY,
//               pageToken: pageToken || undefined,
//               videoCategoryId: video.snippet.categoryId,
//             },
//           }
//         );

//         const items = res.data.items || [];

//         // Fetch channel thumbnails
//         const channelIds = [
//           ...new Set(items.map((v) => v.snippet.channelId)),
//         ].join(",");
//         let channelMap = {};

//         const itemsWithChannels = items.map((v) => ({
//           ...v,
//           channelThumbnail: channelMap[v.snippet.channelId] || "",
//         }));

//         setRelatedVideos((prev) => {
//           const newVideos = itemsWithChannels.filter(
//             (v) => !prev.some((p) => p.id === v.id)
//           );
//           return [...prev, ...newVideos];
//         });
//       } catch (err) {
//         console.error("Error fetching videos:", err);
//       } finally {
//         // setLoading(false);
//       }
//     },
//     [video.snippet.categoryId]
//   );
//   useEffect(() => {
//     async function loadFullDetails() {
//       // Search API does NOT provide categoryId, statistics, etc
//       if (!video.snippet.categoryId) {
//         try {
//           const res = await axios.get(
//             "https://www.googleapis.com/youtube/v3/videos",
//             {
//               params: {
//                 part: "snippet,statistics,contentDetails",
//                 id: videoId,
//                 key: API_KEY,
//               },
//             }
//           );

//           // Replace with full details
//           setFullVideo(res.data.items[0]);
//         } catch (err) {
//           console.error("Failed to load full video details", err);
//         }
//       } else {
//         // Already full data
//         setFullVideo(video);
//       }
//     }

//     loadFullDetails();
//   }, [videoId]);
//   useEffect(() => {
//     if (!fullVideo?.snippet?.categoryId) return; // wait until loaded

//     async function fetchRelated() {
//       try {
//         const response = await axios.get(
//           "https://www.googleapis.com/youtube/v3/search",
//           {
//             params: {
//               id:videoId,
//               part: "snippet",
//               maxResults: 15,
//               type: "video",
//               relatedToVideoId: videoId,
//               key: API_KEY,
//             },
//           }
//         );
//         setRelatedVideos(response.data.items);
//       } catch (err) {
//         console.error("Failed to load related videos", err);
//       }
//     }

//     fetchRelated();
//   }, [videoId, fullVideo]);
//   useEffect(() => {
//     setRelatedVideos([]); // reset when opening new video
//     fetchVideos(); // load category videos
//   }, [videoId]);

//   console.log(relatedVideos);

//   return (
//     <div className=" w-full relative    flex justify-between ">
//       {/* Video Player */}
//       <div className="w-full fixed   left-0  top-[calc(2rem+2vw)]  md:top-[calc(2.5rem+2.5vw)] z-9 bg-background">
//         <iframe
//           allow="autoplay"
//           className="w-full  md:rounded-[20px] h-[calc(9.5rem+13vw)]"
//           src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
//           title={video.snippet.title}
//         ></iframe>
//       </div>
//       {/* suggestions */}
//       <div className="pt-[calc(8rem+11vw)] relative  w-full ">
//         {/* video details */}
//         <div className="">
//           {/* video info */}
//           <div className="flex px-[calc(1rem+1vw)] border items-start justify-between  w-full">
//             <div className="  py-[calc(.7em+.5vw)]">
//               <h3 className="line-clamp-2 text-[clamp(1.05rem,1.3vw,3rem)] font-medium leading-tight">
//                 {video.snippet.title}
//               </h3>
//               <div className="flex items-center line-clamp-2 text-secondary2 py-[calc(.2rem+.2vw)] gap-[calc(.1rem+.1vw)] text-[clamp(.74rem,.9vw,2rem)]">
//                 {/* {video.statistics.viewCount ? (
//                   <p>
//                     {video.statistics.viewCount >= 1_000_000_000
//                       ? `${(video.statistics.viewCount / 1_000_000_000).toFixed(
//                           0
//                         )}B views`
//                       : video.statistics.viewCount >= 1_000_000
//                       ? `${(video.statistics.viewCount / 1_000_000).toFixed(
//                           0
//                         )}M views`
//                       : video.statistics.viewCount >= 1_000
//                       ? `${(video.statistics.viewCount / 1_000).toFixed(
//                           0
//                         )}K views`
//                       : `${video.statistics.viewCount} views`}{" "}
//                     &middot;{" "}
//                     {formatDistanceToNow(new Date(video.snippet.publishedAt), {
//                       addSuffix: true,
//                     })}
//                   </p>
//                 ) : null} */}
//               </div>
//             </div>
//           </div>
//           <div className="border  ">
//             <img src={video.channelThumbnail} alt="" />
//           </div>
//         </div>
//         {relatedVideos.length > 0 ? (
//           relatedVideos
//             .filter((v) => v.id !== videoId)
//             .map((v) => (
//               <Link
//                 key={v.id}
//                 to={`/video/${v.id}`}
//                 state={{ video: v, videos }}
//               >
//                 <div className="w-full ">
//                   <img
//                     src={v.snippet.thumbnails.high.url}
//                     alt={v.snippet.title}
//                     className="w-full h-auto"
//                   />
//                   <p>{v.snippet.title}</p>
//                 </div>
//               </Link>
//             ))
//         ) : (
//           <p className="px-[calc(1rem+1vw)]">No related videos found 😔</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const VideoPlayer = () => {
  const location = useLocation();
  const { video, videos } = location.state; // video clicked + full list
  const [fullVideo, setFullVideo] = useState(video);
  const [relatedVideos, setRelatedVideos] = useState([]);

  // Extract correct ID for search OR normal video
  const videoId = video.id?.videoId || video.id;

  // ---------------------------------------------------
  // 1️⃣ Load full video details if coming from search API
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // 2️⃣ Load related videos (needs categoryId → use fullVideo)
  // ---------------------------------------------------
  useEffect(() => {
    if (!fullVideo?.snippet?.categoryId) return; // wait until loaded

    async function fetchRelated() {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              maxResults: 15,
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

  // ---------------------------------------------------
  // 3️⃣ Render
  // ---------------------------------------------------
  return (
    <div className=" w-full relative    flex justify-between ">
      {/* Video Player */}
      <div className="w-full fixed   left-0  top-[calc(2rem+2vw)]  md:top-[calc(2.5rem+2.5vw)] z-9 bg-background">
        <iframe
          allow="autoplay"
          className="w-full  md:rounded-[20px] h-[calc(9.5rem+13vw)]"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
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
                {/* {video.statistics.viewCount ? (
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
                ) : null} */}
              </div>
            </div>
          </div>
          <div className="border  ">
            <img src={video.channelThumbnail} alt="" />
          </div>
        </div>
        {relatedVideos.length > 0 ? (
          relatedVideos
            .filter((v) => v.id !== videoId)
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
          <p className="px-[calc(1rem+1vw)]  pt-[calc(1rem+3vw)] text-center">
            No related videos found 😔
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
