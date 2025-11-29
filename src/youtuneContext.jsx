import { createContext, useContext, useState, useEffect } from "react";

const YouTubeContext = createContext();

export const YouTubeProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [likes, setLikes] = useState([]);
  const [filter, setFilter] = useState("Sports");
  const [searchQuery, setSearchQuery] = useState("");
  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("google_token");
    if (!storedToken) return;

    setToken(storedToken);

    // Restore subscriptions and likes from localStorage
    const storedSubs = localStorage.getItem("subscriptions");
    if (storedSubs) setSubscriptions(JSON.parse(storedSubs));

    // Fetch user info
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);
  }, []);

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
      }}
    >
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => useContext(YouTubeContext);
