import { useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { useYouTube } from "../../youtuneContext";
import { Link } from "react-router-dom";

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
  } = useYouTube();
  console.log(subscriptions);

  // Fetch subscriptions
  const fetchSubscriptions = (accessToken) => {
    fetch(
      "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.items) return;

        setSubscriptions(data.items);

        localStorage.setItem("subscriptions", JSON.stringify(data.items));
      })
      .catch(console.error);
  };

  // Fetch liked videos
  const fetchLikes = (accessToken) => {
    fetch(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.items) return;
        const likedPlaylist = data.items.find(
          (pl) => pl.snippet.title.toLowerCase() === "liked videos"
        );
        if (!likedPlaylist) return;

        fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${likedPlaylist.id}&maxResults=50`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.items) return;
            setLikes(data.items);
            localStorage.setItem("likes", JSON.stringify(data.items));
          });
      })
      .catch(console.error);
  };

  // Google login
  const login = useGoogleLogin({
    flow: "implicit",
    scope:
      "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    onSuccess: (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      setToken(accessToken);
      localStorage.setItem("google_token", accessToken);

      // fetch user info
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then(setUser);

      fetchSubscriptions(accessToken);
      fetchLikes(accessToken);
    },
  });

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setToken(null);
    setSubscriptions([]);
    setLikes([]);
    localStorage.clear();
  };

  return (
    <div className="">
      {!user ? (
        <button onClick={() => login()}>Login with Google</button>
      ) : (
        <>
          <h2>{user.name}</h2>
          <img src={user.picture} alt="Profile" />
          <p>{user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <h3>Subscriptions</h3>
          <div>
            {subscriptions.map((sub) => (
              <div key={sub.id} className="border w-full overflow-hidden">
                <img
                  src={sub.snippet.thumbnails.medium.url}
                  alt={sub.snippet.title}
                  className="w-[calc(2.5rem+2vw)] h-[calc(2.5rem+2vw)] rounded-full"
                />
                <p>{sub.snippet.title}</p>
              </div>
            ))}
          </div>
          <h3>Liked Videos</h3>
          <ul>
            {likes.map((video) => (
              <li key={video.id}>{video.snippet.title}</li>
            ))}
          </ul>
          <Link to="/subscriptionslist">Subscriptions Only</Link> |{" "}
          <Link to="/you/likedvideos">Likes Only</Link>
        </>
      )}
    </div>
  );
}

export default You;
