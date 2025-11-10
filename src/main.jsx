import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Pathes from "./routes/routeFile.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { YouTubeProvider } from "./youtuneContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="629199534004-8mtpqdn12sdibbe4qv9a5pkmv2041rnj.apps.googleusercontent.com">
      <YouTubeProvider>
        <Pathes />
      </YouTubeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
