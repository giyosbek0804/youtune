import { LuSearch, LuUpload } from "react-icons/lu";
import { FaArrowLeft, FaMicrophone, FaRegBell } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import "../index.css";
import "./nav.css";
import { useState } from "react";

function Navbar() {
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  function submit(e) {
    e.preventDefault();
    if (inputValue.trim() === "") {
      return;
    }
    console.log(inputValue);
  }
  return (
    <>
      <section className=" fixed top-0 left-0 bg-background w-full flex items-center justify-between px-[calc(.5rem+1vw)] lg:px-[calc(1rem+1.5vw)] py-[calc(.5rem+1vw)]  text-white">
        {/* logo */}
        <abbr
          title="YouTune Home"
          className="flex items-center  gap-1.5 cursor-pointer no-underline"
        >
          <img
            src="/images/youtube logo.png"
            alt="logo"
            className="w-[calc(1.6rem+1.2vw)]  lg:w-[calc(1.4rem+1.1vw)] h-auto "
          />
          <p className="text-[clamp(1.23rem,1.5vw,3rem)] font-bold">YouTune</p>
        </abbr>

        {/* search part */}
        <div
          className={`flex items-center   justify-between duration-250 gap-[calc(1rem+1vw)] md:w-[calc(25rem+28vw)]  md:max-w-[55vw] ${
            navbarExpanded
              ? "w-full  absolute md:relative left-0 top-0 h-full  md:left-auto bg-background  px-[calc(.7rem+.6vw)]"
              : "w-fit md:px-[calc(.7rem+.6vw)]"
          }  `}
        >
          <FaArrowLeft
            onClick={() => setNavbarExpanded(false)}
            className={`icons ${navbarExpanded ? "block md:hidden" : "hidden"}`}
          />
          <form
            onSubmit={submit}
            className={`flex items-center    border-none     w-full max-w-[calc(20rem+25vw)]   ${
              navbarExpanded ? "border-2 " : "border-0 md:border-2"
            } rounded-3xl  `}
          >
            <input
              value={inputValue}
              type="text"
              onChange={(e) => setInputValue(e.target.value)}
              className={`outline-none border-hover border focus-within:border-blue-600  py-[calc(.2rem+.39vw)] rounded-l-3xl pl-[calc(.6rem+.8vw)]  md:block text-[clamp(1rem,1.2vw,3rem)]     md:w-full  ${
                navbarExpanded ? "w-full block " : "w-0  hidden "
              } `}
              placeholder="Search"
            />
            <abbr title="Search">
              <button
                className={` flex items-center justify-center md:border border-hover  cursor-pointer py-[calc(.25rem+.35vw)]   rounded-br-3xl rounded-tr-3xl ${
                  navbarExpanded
                    ? "bg-hover w-[calc(3rem+2vw)]"
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
                navbarExpanded ? "block" : "hidden md:block"
              }`}
            >
              <FaMicrophone />
            </abbr>
          </button>
        </div>

        {/* account */}
        <div className="hidden md:flex items-center gap-[calc(.8rem+1vw)] ">
          <button className="flex  items-center  rounded-2xl border-none bg-hover hover:bg-hover2 gap-0.5 py-[calc(.15rem+.2vw)] px-[calc(.3rem+.3vw)] cursor-pointer   duration-200">
            <FiPlus className="text-[clamp(1.5rem,1.7vw,4rem)]" />
            Create
          </button>
          <abbr title="Notifications" className="icons">
            <FaRegBell className="" />
          </abbr>
          <img
            className="h-auto w-[calc(1.4rem+1.1vw)] rounded-full  cursor-pointer"
            src="/images/user-image.jpg"
            alt="user profile image"
          />
        </div>
      </section>
    </>
  );
}
export default Navbar;
