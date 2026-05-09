import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { toast } from "sonner";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { toggleCollectionItem, addToHistoryUtil, removeFromCollection } from "./firebaseUtils";

const YouTubeContext = createContext();

export const YouTubeProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [likes, setLikes] = useState([]);
  const [history, setHistory] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [filter, setFilter] = useState("all");
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

  // --- FIREBASE LOGIC ---
  // Sync user data with Firestore when user logs in
  useEffect(() => {
    if (!user?.email) {
      console.log("Firebase Sync: No user email yet, waiting...");
      return;
    }

    console.log("Firebase Sync: Fetching data for", user.email);
    const userRef = doc(db, "users", user.email);

    // Initial fetch and real-time listener
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Firebase Sync: Data received from Firestore:", data);
        setLikes(data.likes || []);
        setHistory(data.history || []);
        setWatchLater(data.watchLater || []);
      } else {
        console.log("Firebase Sync: No document found, creating new profile...");
        // Create user doc if it doesn't exist
        setDoc(userRef, {
          email: user.email,
          name: user.name,
          likes: [],
          history: [],
          watchLater: [],
          createdAt: new Date()
        }).catch(err => {
          console.error("Firebase Sync: Error creating profile (check your Rules!):", err);
          toast.error("Database error: Could not create user profile.");
        });
      }
    }, (err) => {
      console.error("Firebase Sync: Listener error (check your Rules!):", err);
      toast.error("Database error: Could not listen to updates.");
    });

    return () => unsubscribe();
  }, [user?.email]);

  const toggleLike = async (video) => {
    try {
      const { action } = await toggleCollectionItem(user?.email, "likes", video, likes);
      toast.success(action === "added" ? "Added to liked videos" : "Removed from liked videos");
    } catch (err) {
      toast.error("Failed to update likes. Check Firebase rules!");
    }
  };

  const addToHistory = async (video) => {
    await addToHistoryUtil(user?.email, video, history);
  };

  const toggleWatchLater = async (video) => {
    try {
      const { action } = await toggleCollectionItem(user?.email, "watchLater", video, watchLater);
      toast.success(action === "added" ? "Added to Watch Later" : "Removed from Watch Later");
    } catch (err) {
      toast.error("Failed to update Watch Later. Check Firebase rules!");
    }
  };

  const removeItem = async (collectionName, video) => {
    await removeFromCollection(user?.email, collectionName, video);
  };

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

  async function subscribeChannel(channelId, channelTitle) {
    if (!token) {
      toast.error("Please login to subscribe");
      return;
    }
    try {
      const res = await axios.post(
        "https://www.googleapis.com/youtube/v3/subscriptions",
        {
          snippet: {
            resourceId: {
              kind: "youtube#channel",
              channelId: channelId,
            },
          },
        },
        {
          params: { part: "snippet" },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSubscriptions((prev) => [...prev, res.data]);
      toast.success(`Subscribed to ${channelTitle}! 🎉`);
    } catch (err) {
      console.error("Error subscribing:", err);
      toast.error(`Could not subscribe to ${channelTitle}. Try again!`);
    }
  }

  async function unSubscribeChannel(channelId, channelTitle) {
    if (!token) return;
    try {
      const sub = subscriptions.find(
        (s) => s.snippet.resourceId.channelId === channelId
      );

      if (!sub) {
        toast.error(`You are not subscribed to ${channelTitle}`);
        return;
      }

      await axios.delete(
        "https://www.googleapis.com/youtube/v3/subscriptions",
        {
          params: { id: sub.id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubscriptions((prev) =>
        prev.filter((s) => s.snippet.resourceId.channelId !== channelId)
      );
      toast.success(`Unsubscribed from ${channelTitle}!`);
    } catch (err) {
      console.error("Error unsubscribing:", err);
      toast.error(`Could not unsubscribe from ${channelTitle}. Try again!`);
    }
  }

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
        history,
        setHistory,
        watchLater,
        setWatchLater,
        toggleLike,
        addToHistory,
        toggleWatchLater,
        removeItem,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        login,
        subscribeChannel,
        unSubscribeChannel,
      }}
    >
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => useContext(YouTubeContext);
