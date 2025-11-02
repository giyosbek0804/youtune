import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../navbar/nav";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function HomePage() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("react");
  const isSmallScreen = window.innerWidth <= 768;
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
      <section className="w-full ">
        <Navbar expanded={expanded} setExpanded={setExpanded} />

        <div
          className={`flex flex-col  border items-center justify-center h-screen `}
          style={{
            marginLeft: isSmallScreen
              ? "0"
              : expanded
              ? "calc(8.7rem + 8vw)"
              : "calc(2.5rem + 3vw)",
            marginTop: "calc(3rem + 1.5vw)",
          }}
        >
          <Outlet />
        </div>
      </section>
    </>
  );
}
export default HomePage;
