import { useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { toast } from "sonner";
import { useYouTube } from "../../youtuneContext";
import { Link } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";

function You() {
  const {
    user,
    setUser,
    token,
    setToken,
    subscriptions,
    setSubscriptions,
    likes,
    setLikes,
    login,
  } = useYouTube();

  console.log(subscriptions);

  // Fetch subscriptions
  // const fetchSubscriptions = (accessToken) => {
  //   fetch(
  //     "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50",
  //     { headers: { Authorization: `Bearer ${accessToken}` } }
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (!data.items) return;

  //       setSubscriptions(data.items);

  //       localStorage.setItem("subscriptions", JSON.stringify(data.items));
  //     })
  //     .catch(console.error);
  // };

  // Google login
  // const login = useGoogleLogin({
  //   flow: "implicit",
  //   scope:
  //     "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  //   onSuccess: (tokenResponse) => {
  //     const accessToken = tokenResponse.access_token;
  //     setToken(accessToken);
  //     localStorage.setItem("google_token", accessToken);

  //     // fetch user info
  //     fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setUser(data);
  //         toast.success(
  //           `Hey there, glad to see you! ${
  //             data.given_name || data.name || "My friend"
  //           } 🎉`
  //         );
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         toast.error(
  //           `Sorry, ${
  //             user?.given_name || "friend"
  //           }! Something went wrong. Try again.`
  //         );
  //       });

  //     setToken(accessToken);
  //   },
  // });

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setToken(null);
    setSubscriptions([]);
    localStorage.clear();
    toast.success("Come back anytime, we’ll miss you! ❤️");
  };

  return (
    <div className=" w-full px-[calc(.95rem+1vw)]   ">
      {!user ? (
        <div className="w-full  flex justify-center items-center">
          <button
            onClick={() => login()}
            className="text-primary1 border px-[calc(.3rem+.3vw)] py-[calc(.1rem+.2vw)] "
          >
            Login with Google
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 items-center">
            <div className="min-w-[calc(4rem+3vw)] ">
              <img
                src={user.picture}
                alt="Profile img"
                className="rounded-full w-[calc(4rem+3vw)] h-[calc(4rem+3vw)] text-primary1  "
              />
            </div>
            <div className="">
              <h2 className="text-[clamp(1.5rem,2.3vw,4rem)] leading-tight font-bold w-fit  text-primary1">
                {user.name}
              </h2>
              <p className="text-[clamp(.75rem,1vw,2.6rem)] text-primary1">
                @{user.email}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 my-[calc(1rem+1vw)] ">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-fit gap-[calc(.1rem+.1vw)]  bg-[#C72B2A] text-primary1 font-bold text-[clamp(.9rem,1vw,2.4rem)] rounded-[20px] px-[calc(.8rem+1vw)] py-[calc(.2rem+.2vw)] "
            >
              <IoIosLogOut className="text-[clamp(1.3rem,1.5vw,3.3rem)]" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default You;
