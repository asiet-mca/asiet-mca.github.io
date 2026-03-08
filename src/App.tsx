import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
