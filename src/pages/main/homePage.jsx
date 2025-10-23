import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  async function searchVideos() {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=6&key=${API_KEY}`
    );
    const data = await response.json();
      setVideos(data.items);
      console.log(data );
      
  }
 return (
   <div className="p-4">
     <h1>YouTube Search</h1>

     <input
       value={query}
       onChange={(e) => setQuery(e.target.value)}
       placeholder="Search videos..."
       className="border px-2 py-1 rounded"
     />
     <button
       onClick={searchVideos}
       className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
     >
       Search
     </button>

     <div className="grid grid-cols-3 gap-4 mt-4">
       {videos.map((v) => (
         <div key={v.id.videoId}>
           <img src={v.snippet.thumbnails.medium.url} alt={v.snippet.title} />
           <h3 className="text-sm mt-2">{v.snippet.title}</h3>
         </div>
       ))}
     </div>
   </div>
 );
}
export default HomePage;
