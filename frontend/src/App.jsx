import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import HomeownerDashboard from "./pages/homeowner/HomeownerDashboard";
import CreateRequest from "./pages/homeowner/CreateRequest";
import { RequestDetailsPage } from "./pages/homeowner/RequestDetails";
import ExploreDesigners from "./pages/designer/ExploreDesigners";
import DesignerProfile from "./pages/designer/DesignerProfile";
import DesignerRequestsDashboard from "./pages/designer/DesignerRequestsDashboard";
import MyProfile from "./pages/designer/MyProfile";

const ClientRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (user.role !== "client") return <Navigate to="/" />;
  return children;
};

const DesignerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (user.role !== "designer") return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/"                element={<Home />} />
        <Route path="/designers"       element={<ExploreDesigners />} />
        <Route path="/designers/:slug" element={<DesignerProfile />} />

        <Route
          path="/designer/requests"
          element={
            <DesignerRoute>
              <DesignerRequestsDashboard />
            </DesignerRoute>
          }
        />

        <Route
          path="/designer/MyProfile"
          element={
            <DesignerRoute>
              <MyProfile />
            </DesignerRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ClientRoute>
              <HomeownerDashboard />
            </ClientRoute>
          }
        />

        <Route
          path="/create-request"
          element={
            <ClientRoute>
              <CreateRequest />
            </ClientRoute>
          }
        />

        <Route
          path="/requests/:id"
          element={
            <ClientRoute>
              <RequestDetailsPage />
            </ClientRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
