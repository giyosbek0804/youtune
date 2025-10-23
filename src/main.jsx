import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Pathes from "./routes/routeFile.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Pathes />
    {/* <App /> */}
  </StrictMode>
);
