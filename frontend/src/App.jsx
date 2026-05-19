import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login                   from "./pages/auth/Login";
import Signup                  from "./pages/auth/Signup";
import Home                    from "./pages/Home";
import HomeownerDashboard      from "./pages/homeowner/HomeownerDashboard";
import CreateRequest           from "./pages/homeowner/CreateRequest";
import { RequestDetailsPage }  from "./pages/homeowner/RequestDetails";
import ExploreDesigners        from "./pages/designer/ExploreDesigners";
import DesignerProfile         from "./pages/designer/DesignerProfile";
import DesignerRequests        from "./pages/designer/DesignerRequestsDashboard";
import DesignerRequestDetails  from "./pages/designer/DesignerRequestDetails";
import MyProfile               from "./pages/designer/MyProfile";
import CreatePlan              from "./pages/designer/CreatePlan";
import ManageRequests          from "./pages/designer/ManageRequests";
import ProviderAvailableOffers from "./pages/provider/ProviderAvailableOffers";
import ProviderOfferDetails    from "./pages/provider/ProviderOfferDetails";
import ProviderMyProjects      from "./pages/provider/ProviderMyProjects";

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

const ProviderRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (user.role !== "provider") return <Navigate to="/" />;
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

        {/* Designer routes */}
        <Route path="/designer/dashboard"    element={<DesignerRoute><DesignerRequests /></DesignerRoute>} />
        <Route path="/designer/requests"     element={<DesignerRoute><DesignerRequests /></DesignerRoute>} />
        <Route path="/designer/requests/:id" element={<DesignerRoute><DesignerRequestDetails /></DesignerRoute>} />
        <Route path="/designer/MyProfile"    element={<DesignerRoute><MyProfile /></DesignerRoute>} />
        <Route path="/designer/requests/:id/create-plan" element={<DesignerRoute><CreatePlan /></DesignerRoute>} />
        <Route path="/designer/manage"       element={<DesignerRoute><ManageRequests /></DesignerRoute>} />

        {/* Client routes */}
        <Route path="/dashboard"      element={<ClientRoute><HomeownerDashboard /></ClientRoute>} />
        <Route path="/create-request" element={<ClientRoute><CreateRequest /></ClientRoute>} />
        <Route path="/requests/:id"   element={<ClientRoute><RequestDetailsPage /></ClientRoute>} />

        {/* Provider routes */}
        <Route path="/provider/offers" element={<ProviderRoute><ProviderAvailableOffers /></ProviderRoute>} />
        <Route path="/provider/offers/:id" element={<ProviderRoute><ProviderOfferDetails /></ProviderRoute>} />
        <Route path="/provider/projects" element={<ProviderRoute><ProviderMyProjects /></ProviderRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
