import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../navbar/nav";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function HomePage() {
  const [query, setQuery] = useState("react");
  // useEffect(() => {
  //   async function getData() {
  //     try {
  //       const res = await axios.get(
  //         `https://www.googleapis.com/youtube/v3/videos`,
  //         {
  //           params: {
  //             part: "snippet,contentDetails,statistics",
  //             chart: "mostPopular",
  //             regionCode: "US",
  //             maxResults: 12,
  //             key: API_KEY,
  //           },
  //         }
  //       );
  //       console.log(res);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getData();
  // }, []);
  return (
    <>
      <Navbar />
    </>
  );
}
export default HomePage;
