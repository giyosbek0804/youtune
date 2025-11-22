import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Pathes from "./routes/routeFile.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { YouTubeProvider } from "./youtuneContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
      <YouTubeProvider>
        <Pathes />
      </YouTubeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
