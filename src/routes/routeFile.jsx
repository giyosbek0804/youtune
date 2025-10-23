import { Route, Routes, BrowserRouter } from "react-router-dom";
import Shorts from "../pages/main/shorts";
import HomePage from "../pages/main/homePage";
function Pathes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<h2>Welcome to Home</h2>} />
          <Route path="shorts" element={<Shorts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default Pathes;
