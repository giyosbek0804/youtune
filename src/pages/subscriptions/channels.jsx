import { FaCircleCheck } from "react-icons/fa6";
import { useYouTube } from "../../youtuneContext";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SubscriptionList() {
  const { subscriptions } = useYouTube();

  return (
    <div className="w-full">
      {subscriptions.length === 0 && <p>No subscriptions found.</p>}
      <ul className="  pb-[calc(4rem+4vw)] ">
        {subscriptions.map((sub) => (
          <Link
            to={`/subscriptionslist/${sub.snippet.title}`}
            key={sub.id}
            className=" flex items-center  w-[100%] m-auto my-[calc(.3rem+.1vw)] py-[calc(.3rem+.3vw)] pl-[calc(.6rem+1vw)] pr-[calc(.6rem+.6vw)]"
          >
            <img
              src={sub.snippet.thumbnails.medium.url}
              alt={sub.snippet.title}
              className="w-[calc(2.5rem+2.2vw)] h-[calc(2.5rem+2.2vw)] md:w-[calc(4rem+4vw)] md:h-[calc(4rem+4vw)]  rounded-full mr-[calc(.5rem+.7vw)] text-primary1"
            />
            <abbr
              title={sub.snippet.title}
              className="no-underline text-primary1"
            >
              <li className="line-clamp-1 text-[clamp(1.02rem,1.15vw,2.6rem)] flex items-center ">
                {sub.snippet.title}
                <abbr title="Verified">
                  <span className="text-[clamp(.5rem,.8vw,1.2rem)] cursor-pointer ml-[calc(.2rem+.1vw)] text-primary1 hidden md:block">
                    <FaCircleCheck />
                  </span>
                </abbr>
              </li>
            </abbr>
          </Link>
        ))}
      </ul>
    </div>
  );
}
export default SubscriptionList;
