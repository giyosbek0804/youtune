import { useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { useYouTube } from "../../youtuneContext";

function You() {
  const {
    user,
    setUser,
    token,
    setToken,
    subscriptions,
    setSubscriptions,
    videos,
    setVideos,
  } = useYouTube();

  const login = useGoogleLogin({
    scope:
      "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    onSuccess: (res) => setToken(res.access_token),
    flow: "implicit",
  });

  useEffect(() => {
    if (!token) return;
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch(
      "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=5",
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => setSubscriptions(data.items || []));
  }, [token]);

  useEffect(() => {
    if (!subscriptions.length || !token) return;

    const fetchVideos = async () => {
      const results = [];
      for (const sub of subscriptions.slice(0, 3)) {
        const channelId = sub.snippet.resourceId.channelId;
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=3&order=date&type=video`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.items) results.push(...data.items);
      }
      setVideos(results);
    };

    fetchVideos();
  }, [subscriptions, token]);

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setToken(null);
    setSubscriptions([]);
    setVideos([]);
  };

  return (
    <div className="text-white flex flex-col items-center">
      {!user ? (
        <button
          onClick={login}
          className="bg-red-600 px-6 py-2 rounded-md mt-6"
        >
          Login with Google
        </button>
      ) : (
        <>
          <h2 className="mt-6 text-xl font-semibold">Welcome {user.name}</h2>
          <button
            onClick={handleLogout}
            className="bg-gray-700 px-4 py-1 mt-4 rounded-md"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default You;
