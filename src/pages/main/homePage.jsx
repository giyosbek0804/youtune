import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../navbar/nav";

function HomePage() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("react");
  const isSmallScreen = window.innerWidth <= 976;

  return (
    <>
      <section className="w-full ">
        <Navbar expanded={expanded} setExpanded={setExpanded} />

        <div
          className={`flex flex-col w-full   items-center justify-center px-0 lg:px-[calc(.6rem+1.2vw)] pt-[calc(1rem+1vw)] `}
          style={{
            paddingLeft: isSmallScreen
              ? "0"
              : expanded
              ? "calc(8.7rem + 8vw)"
              : "calc(2.5rem + 3vw) ",
            marginTop: "calc(2rem + 1.5vw)",
          }}
        >
          <Outlet />
        </div>
      </section>
    </>
  );
}
export default HomePage;
