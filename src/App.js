import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/EventsPage";
import MenusPage from "./pages/MenusPage";
import BoissonsPage from "./pages/BoissonsPage";
import OffresPage from "./pages/OffresPage";
import PresentationsPage from "./pages/PresentationsPage";

// Client pages
import Home from "./pages/Home";
import EventsClient from "./pages/EventsClient";
import MenusClient from "./pages/MenusClient";
import BoissonsClient from "./pages/BoissonsClient";
import OffresClient from "./pages/OffresClient";
import PresentationsClient from "./pages/PresentationsClient";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router basename="/Menu">
      <Routes>
        {/* 🔐 Admin / Authenticated Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/menus" element={<MenusPage />} />
        <Route path="/boissons" element={<BoissonsPage />} />
        <Route path="/presentations" element={<PresentationsPage />} />
        <Route path="/offres" element={<OffresPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 🌍 Public / Client Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/events-client" element={<EventsClient />} />
        <Route path="/menus-client" element={<MenusClient />} />
        <Route path="/boissons-client" element={<BoissonsClient />} />
        <Route path="/offres-client" element={<OffresClient />} />
        <Route path="/presentations-client" element={<PresentationsClient />} />
      </Routes>
    </Router>
  );
}

export default App;
