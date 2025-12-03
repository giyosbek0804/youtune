import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Pathes from "./routes/routeFile.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { YouTubeProvider } from "./youtuneContext.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <YouTubeProvider>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Pathes />
      </YouTubeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
