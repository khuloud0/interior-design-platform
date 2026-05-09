import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyPhone from "./pages/auth/VerifyPhone";
import HomeownerDashboard from "./pages/homeowner/HomeownerDashboard";
import CreateRequest from "./pages/homeowner/CreateRequest";
import { RequestDetailsPage } from "./pages/homeowner/RequestDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-phone" element={<VerifyPhone />} />
        <Route path="/dashboard" element={<HomeownerDashboard />} />
        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/requests/:id" element={<RequestDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
