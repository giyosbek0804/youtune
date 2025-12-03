import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
const YouTubeContext = createContext();
import { toast } from "sonner";
export const YouTubeProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [likes, setLikes] = useState([]);
  const [filter, setFilter] = useState("Sports");
  const [searchQuery, setSearchQuery] = useState("");

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
        .then((data) => {
          setUser(data);
          toast.success(
            `Hey there, glad to see you! ${
              data.given_name || data.name || "My friend"
            } 🎉`
          );
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            `Sorry, ${
              user?.given_name || "friend"
            }! Something went wrong. Try again.`
          );
        });

      setToken(accessToken);
    },
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("google_token");
    if (!storedToken) return;

    setToken(storedToken);

    // Fetch user info
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);
  }, []);

  // fetch subscriptions
  async function fetchSubscriptions() {
    if (!token) return;

    let nextPageToken = "";
    let allSubs = [];

    try {
      do {
        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/subscriptions",
          {
            params: {
              part: "snippet,contentDetails",
              mine: true,
              maxResults: 50,
              pageToken: nextPageToken || undefined,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.data?.items) break; // safety check

        allSubs = [...allSubs, ...res.data.items];

        nextPageToken = res.data.nextPageToken;
      } while (nextPageToken);

      // remove duplicates
      const uniqueSubs = allSubs.filter(
        (sub, index, self) => self.findIndex((s) => s.id === sub.id) === index
      );

      setSubscriptions(uniqueSubs);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired, please log in again.");
        setToken(null);
        setUser(null);
        localStorage.removeItem("google_token");
        setSubscriptions([]);
      } else {
        toast.error("Failed to fetch subscriptions.");
      }
    }
  }
  useEffect(() => {
    if (token) fetchSubscriptions();
  }, [token]);

  return (
    <YouTubeContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        subscriptions,
        setSubscriptions,
        likes,
        setLikes,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        login,
      }}
    >
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => useContext(YouTubeContext);
