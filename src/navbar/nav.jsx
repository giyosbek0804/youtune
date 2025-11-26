import {
  LuHistory,
  LuMessageSquareWarning,
  LuSearch,
  LuUpload,
} from "react-icons/lu";
import {
  SiYoutubekids,
  SiYoutubeshorts,
  SiYoutubestudio,
} from "react-icons/si";
import {
  FaChevronRight,
  FaQuestionCircle,
  FaRegLightbulb,
  FaRegNewspaper,
  FaThumbsUp,
  FaTrophy,
  FaUserCircle,
} from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import {
  MdHistory,
  MdOutlineAccessTime,
  MdOutlineAccessTimeFilled,
  MdOutlinePlaylistPlay,
  MdSubscriptions,
} from "react-icons/md";
import { GiConsoleController, GiGears } from "react-icons/gi";
import { HiSignal } from "react-icons/hi2";
import {
  IoChevronBackOutline,
  IoChevronForward,
  IoFlagSharp,
  IoHome,
} from "react-icons/io5";
import { IoMusicalNotes } from "react-icons/io5";
import { BiSolidVideos } from "react-icons/bi";
import { FaArrowLeft, FaBars, FaMicrophone, FaRegBell } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { GiHanger } from "react-icons/gi";
import "../index.css";
import "./nav.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useYouTube } from "../youtuneContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ expanded, setExpanded }) {
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [expandAside, setExpandAside] = useState(expanded);
  const [selected, setSelected] = useState("home");
  const [showExtra, setShowExtra] = useState(false);
  const location = useLocation();
  const { subscriptions } = useYouTube();
  const [filterSelector, setFilterSelector] = useState("all");
  const showFilters = location.pathname === "/";

  // aside data
  const asideData = [
    {
      id: "main",
      title: null,
      alwaysVisible: true,
      links: [
        {
          id: "home",
          icon: <IoHome />,
          label: "Home",
          selected: true,
          path: "/",
        },
        {
          id: "shorts",
          icon: <SiYoutubeshorts />,
          label: "Shorts",
          selected: false,
          path: "/shorts",
        },
        {
          id: "subscriptions",
          icon: <MdSubscriptions />,
          label: "Subscriptions",
          selected: false,
          message: true,
          path: "/subscriptions",
        },
        {
          id: "youSmall",
          icon: <FaUserCircle />,
          label: "You",
          selected: false,
          path: "/you",
        },
      ],
    },
    {
      id: "you",
      title: null,
      alwaysVisible: showExtra,
      links: [
        {
          id: "yourActivity",
          icon: <LuHistory />,
          label: "You   >",
          selected: false,
          title: true,
          path: "/you",
        },
        {
          id: "history",
          icon: <LuHistory />,
          label: "History",
          selected: false,
          path: "/you/history",
        },
        {
          id: "playlist",
          icon: <MdOutlinePlaylistPlay />,
          label: "Playlist",
          selected: false,
          path: "/you/playlist",
        },
        {
          id: "yourVideos",
          icon: <BiSolidVideos />,
          label: "Your Videos",
          selected: false,
          path: "/you/yourvideos",
        },
        {
          id: "yourCourses",
          icon: <FaGraduationCap />,
          label: "Your Courses",
          selected: false,
          path: "/you/yourcourses",
        },
        {
          id: "watchLater",
          icon: <MdOutlineAccessTimeFilled />,
          label: "Watch Later",
          selected: false,
          path: "/you/watchlater",
        },
        {
          id: "likedVideos",
          icon: <FaThumbsUp />,
          label: "Liked Videos",
          selected: false,
          path: "/you/likedvideos",
        },
      ],
    },
    {
      id: "subscription",
      title: null,
      alwaysVisible: showExtra,
      links: [
        {
          id: "subscriptionsList",
          icon: <LuHistory />,
          label: "Subscriptions   >",
          selected: false,
          title: true,
          message: true,
          path: "/subscriptionslist",
        },
      ],
    },
    {
      id: "explore",
      title: "Explore",
      alwaysVisible: showExtra,
      links: [
        {
          id: "music",
          icon: <IoMusicalNotes />,
          label: "Music",
          selected: false,
          path: "/explore/music",
        },
        {
          id: "live",
          icon: <HiSignal />,
          label: "Live",
          selected: false,
          path: "/explore/live",
        },
        {
          id: "gaming",
          icon: <GiConsoleController />,
          label: "Gaming",
          selected: false,
          path: "/explore/gaming",
        },
        {
          id: "news",
          icon: <FaRegNewspaper />,
          label: "News",
          selected: false,
          path: "/explore/news",
        },
        {
          id: "sport",
          icon: <FaTrophy />,
          label: "Sport",
          selected: false,
          path: "/explore/sport",
        },
        {
          id: "learning",
          icon: <FaRegLightbulb />,
          label: "Learning",
          selected: false,
          path: "/explore/learning",
        },
        {
          id: "fashion",
          icon: <GiHanger />,
          label: "Fashion & beauty",
          selected: false,
          path: "/explore/fashion",
        },
      ],
    },
    {
      id: "youtuneProducts",
      title: "More from YouTune",
      alwaysVisible: showExtra,
      links: [
        {
          id: "youtubeStudio",
          icon: <SiYoutubestudio />,
          label: "YouTune Studio ",
          selected: false,
          path: "/studio",
        },
        {
          id: "youtuneKids",
          icon: <SiYoutubekids />,
          label: "YouTune Kids ",
          selected: false,
          path: "/kids",
        },
      ],
    },
    {
      id: "appInfo",
      title: null,
      alwaysVisible: showExtra,
      links: [
        {
          id: "settings",
          icon: <GiGears />,
          label: "Settings ",
          selected: false,
          path: "/studio",
        },
        {
          id: "reportHistory",
          icon: <IoFlagSharp />,
          label: "Report History ",
          selected: false,
          path: "/reporthistory",
        },
        {
          id: "help",
          icon: <FaQuestionCircle />,
          label: "Help ",
          selected: false,
          path: "/help",
        },
        {
          id: "sendFeedback",
          icon: <LuMessageSquareWarning />,
          label: "Send Feedback ",
          selected: false,
          path: "/sendfeedback",
        },
      ],
    },
  ];
  const videoFilters = [
    {
      filter: "all",
    },
    {
      filter: "films",
    },
    {
      filter: "cars",
    },
    {
      filter: "music",
    },
    {
      filter: "animals",
    },
    {
      filter: "sports",
    },
    {
      filter: "gaming",
    },
    {
      filter: "blogs",
    },
    {
      filter: "comedy",
    },
    {
      filter: "entertainment",
    },
    {
      filter: "news",
    },
    {
      filter: "style",
    },
    {
      filter: "science",
    },
  ];
  const { filter, setFilter } = useYouTube();

  const filters = videoFilters.map((filter) => {
    return { ...filter, id: filter.filter.toLowerCase(), selected: false };
  });

  subscriptions.forEach((sub) => {
    asideData[2].links.push({
      id: sub.snippet.title,
      icon: (
        <img
          src={sub.snippet.thumbnails.medium.url}
          className="w-[calc(.5rem+1.2vw)] h-auto rounded-full"
          alt={sub.title}
        />
      ),
      label: sub.snippet.title,
      selected: false,
      message: true,
      path: `/subscriptionslist/${sub.snippet.title}`,
    });
  });
  useEffect(() => {
    // Find the section that contains the current path
    const matchedSection = asideData.find((section) =>
      section.links.some((link) => link.path === location.pathname)
    );

    const matchedLink = matchedSection
      ? matchedSection.links.find((link) => link.path === location.pathname)
      : null;

    if (matchedLink) {
      setSelected(matchedLink.id);
    }
  }, [location.pathname]);

  const { searchQuery, setSearchQuery } = useYouTube();
  const navigate = useNavigate();
  // locate to search jsx
  const handleSearchNavigate = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`); // Navigate to search page with query
      setSearchQuery(inputValue);
    }
  };
  return (
    <>
      {/* navbar section */}
      <section className=" fixed top-0 py-[calc(.2rem+.2vw)] bg-blur  z-20 bg-background  w-full  text-white">
        <div className="w-full   flex items-center justify-between pr-[calc(.5rem+1vw)]  lg:pr-[calc(.9rem+1vw)] pl-[calc(.6rem+1vw)]  py-[calc(.2rem+.5vw)]  ">
          {/* icons part */}

          <div className="flex items-center gap-[calc(.7rem+1vw)]">
            <div className="icons hidden md:block ">
              <FaBars
                onClick={() => {
                  setExpandAside((prev) => !prev);
                  setShowExtra((prev) => !prev);
                  setExpanded((prev) => !prev);
                }}
              />
            </div>
            <Link to="/">
              <abbr
                title="YouTune Home"
                className="flex items-center  gap-1 cursor-pointer no-underline"
              >
                <img
                  src="/images/youtube logo.png"
                  alt="logo"
                  className="w-[calc(1.4rem+1.2vw)]  lg:w-[calc(1rem+1.1vw)] h-auto "
                />
                <p className="text-[clamp(1.23rem,1.3vw,3rem)] font-bold">
                  {useLocation().pathname === "/subscriptionslist"
                    ? "All subscriptions"
                    : "YouTune"}
                </p>
              </abbr>
            </Link>
          </div>

          {/* search part */}
          <div
            className={`flex items-center     justify-between duration-250 gap-[calc(.5rem+.5vw)] md:w-[calc(25rem+28vw)]  md:max-w-[45.5vw] ${
              navbarExpanded
                ? "w-full  absolute md:relative ml-0 left-0 top-0 h-full  md:left-auto bg-[#292929]  px-[calc(.7rem+.6vw)]"
                : "w-fit md:px-[calc(.7rem+.6vw)] ml-[calc(2rem+3vw)]"
            }  `}
          >
            <FaArrowLeft
              onClick={() => setNavbarExpanded(false)}
              className={`icons ${
                navbarExpanded ? "block md:hidden" : "hidden"
              }`}
            />
            <form
              onSubmit={handleSearchNavigate}
              className={`flex items-center    border-none     w-full max-w-[calc(20rem+25vw)]   ${
                navbarExpanded
                  ? "border-2 bg-[#383838]"
                  : "border-0 md:border-2"
              } rounded-3xl  `}
            >
              <input
                value={searchQuery}
                type="search"
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`outline-none border-hover border focus-within:border-blue-600  py-[calc(.1rem+.35vw)] rounded-l-3xl pl-[calc(.6rem+.8vw)] pr-2 md:block text-[clamp(1rem,1vw,3rem)]     md:w-full  ${
                  navbarExpanded ? "w-full block " : "w-0  hidden "
                } `}
                placeholder="Search"
              />
              <abbr title="Search">
                <button
                  className={` flex items-center justify-center md:border border-hover  cursor-pointer py-[calc(.15rem+.3vw)]   rounded-br-3xl rounded-tr-3xl ${
                    navbarExpanded
                      ? "bg-[#383838] w-[calc(3rem+2vw)]"
                      : "md:w-[calc(3rem+2vw)] md:bg-hover"
                  }`}
                >
                  <LuSearch
                    onClick={() => setNavbarExpanded(true)}
                    className="text-[clamp(1.5rem,1.5vw,4rem)]  "
                  />
                </button>
              </abbr>
            </form>

            <button>
              <abbr
                title="Voice Search"
                className={`icons bg-hover outline-none rounded-full p-2 lg:block ${
                  navbarExpanded ? "block bg-[#383838]" : "hidden md:block"
                }`}
              >
                <FaMicrophone />
              </abbr>
            </button>
          </div>

          {/* account */}
          <div className="hidden  md:flex  items-center gap-[calc(.8rem+1vw)] ">
            <button className="flex  items-center  rounded-2xl border-none bg-hover hover:bg-hover2 gap-0.5 text-[clamp(.9rem,.9vw,3rem)] py-[calc(.15rem+.2vw)] px-[calc(.3rem+.3vw)] cursor-pointer   duration-200">
              <FiPlus className="text-[clamp(1.5rem,1.5vw,4rem)]" />
              Create
            </button>
            <abbr title="Notifications" className="icons">
              <FaRegBell className="" />
            </abbr>
            <img
              className="h-auto w-[calc(1.2rem+1.05vw)] rounded-full  cursor-pointer"
              src="/images/user-image.jpg"
              alt="user profile image"
            />
          </div>
        </div>

        {/* filter section */}
        <div
          className={` pl-[calc(.25rem+.32vw)]  ${
            showFilters ? "flex" : "hidden"
          }   fixed bg-background backdrop-blur-2xl w-full flex    ${
            expandAside
              ? "md:ml-[calc(8.2rem+8vw)] "
              : "md:ml-[calc(2.5rem+3vw)]  "
          }`}
        >
          <div
            className={`  filters      w-full flex overflow-scroll items-center  `}
          >
            {filters.map((filter) => {
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    setFilter(filter.filter.toLowerCase());
                    console.log(filter.filter);

                    setFilterSelector(filter.id);
                  }}
                  className={`mx-2 my-[calc(.3rem+.3vw)] capitalize cursor-pointer py-1 whitespace-nowrap duration-200 eas px-2 rounded-[8px] bg-hover ${
                    filterSelector === filter.id ? "bg-primary1 text-hover" : ""
                  } `}
                >
                  {filter.filter}
                </button>
              );
            })}
            {/* <div className="absolute right-0 md:mr-[calc(2.5rem+3vw)]  bg-white"> */}
          </div>
        </div>
      </section>

      {/* aside section */}
      <section
        className={` fixed   lg:left-0 bottom-0 overflow-auto md:pt-[calc(1rem+1.9vw)] top-auto  md:bottom-auto md:top-0 h-fit md:h-screen  transition-all duration-300 
  ${
    expandAside
      ? "md:w-[calc(8.7rem+8vw)] w-full  z-10 "
      : "md:w-[calc(2.5rem+3vw)] w-[100%] "
  } bg-background bg-blur`}
      >
        <div className="flex  flex-row md:flex-col  items-center justify-between  px-2  md:p-4">
          {asideData.map((section) => {
            return (
              <div
                key={section.id}
                className={`  w-full md:w-fit  ${
                  section.alwaysVisible ? "block  " : "hidden"
                }`}
              >
                <p className="px-[calc(.5rem+.5vw)]  mb-[calc(.3rem+.2vw)] font-black text-[clamp(1rem,1vw,3.8rem)] ">
                  {section.title}
                </p>
                <div className=" flex-row  md:flex-col justify-between  md:px-0 flex w-full">
                  {section.links.map((link) => (
                    <Link
                      key={link.id}
                      to={link.path}
                      className={` ${
                        link.id === "youSmall"
                          ? `${expandAside ? "hidden" : "block"}`
                          : "block"
                      } `}
                    >
                      <motion.div
                        onClick={() => setSelected(link.id)}
                        layout
                        className={`  min-w-fit ${
                          link.title
                            ? "flex-row-reverse  text-shadow-2xs text-shadow-white justify-start items-start "
                            : ""
                        } flex-wrap mainLinks hover:bg-hover  rounded-[10px] 
                 
                   ${
                     expandAside
                       ? `w-[calc(7.8rem+7vw)] justify-between  py-[calc(.2rem+.2vw)] px-[calc(.5rem+.5vw)]  ${
                           selected === link.id ? "bg-hover" : ""
                         }`
                       : "w-[calc(2rem+2.7vw)] justify-center   py-[calc(.5rem+.5vw)]"
                   }`}
                      >
                        <motion.div
                          layout
                          className={`  ${
                            link.title ? "hidden" : "block"
                          }   my-[calc(.1rem+.1vw)]   ${
                            selected === link.id
                              ? "text-primary1 drop-shadow-[0px_0px_2px_rgba(0,0,0,0)] drop-shadow-transparent"
                              : "text-surface drop-shadow-[0px_0px_1px_rgba(0,0,0,0)] drop-shadow-primary1"
                          } ${
                            expandAside ? "  mx-0 " : "   mx-[calc(1rem+1vw)]  "
                          }  `}
                        >
                          {link.icon}
                        </motion.div>

                        <p
                          className={`   ${
                            link.title
                              ? "w-full text-[clamp(1rem,1vw,3.8rem)] "
                              : ""
                          } ${
                            expandAside
                              ? "w-[75%] pl-[5%] text-[clamp(.9rem,.9vw,3.5rem)] font-medium"
                              : "w-full text-center text-[clamp(.6rem,.65vw,2.5rem)] "
                          }`}
                        >
                          {link.label}
                        </p>
                        <div
                          className={`w-[10%]  ${
                            link.title ? "hidden" : "block"
                          }`}
                        ></div>
                      </motion.div>
                    </Link>
                  ))}
                  <hr
                    className={`${
                      showExtra ? "block" : "hidden"
                    } my-[calc(.1rem+.1vw)]    text-hover2`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Navbar;
