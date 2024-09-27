import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ContentList from "./pages/ContentList";
import ProfilePage from "./pages/ProfilePage";
import GenrePage from "./components/GenrePage";
import RecommendationPage from "./components/RecommendationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:category" element={<ContentList />} />
        <Route path="/:category/:title" element={<ProfilePage />} />
        <Route path="/:category/genre/:genre" element={<GenrePage />} />
        <Route
          path="/:category/:title/recommendations"
          element={<RecommendationPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
