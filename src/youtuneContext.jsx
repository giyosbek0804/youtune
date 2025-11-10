import { createContext, useContext, useState } from "react";

const YouTubeContext = createContext();

export const YouTubeProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [videos, setVideos] = useState([]);

  return (
    <YouTubeContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        subscriptions,
        setSubscriptions,
        videos,
        setVideos,
      }}
    >
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTube = () => useContext(YouTubeContext);
