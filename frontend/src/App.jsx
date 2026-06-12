import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login                   from "./pages/auth/Login";
import Signup                  from "./pages/auth/Signup";
import LandingPage             from "./pages/LandingPage";
import Home                    from "./pages/Home";
import HomeownerDashboard      from "./pages/homeowner/HomeownerDashboard";
import CreateRequest           from "./pages/homeowner/CreateRequest";
import { RequestDetailsPage }  from "./pages/homeowner/RequestDetails";
import ExploreDesigners        from "./pages/designer/ExploreDesigners";
import DesignerProfile         from "./pages/designer/DesignerProfile";
import DesignerRequests        from "./pages/designer/DesignerRequestsDashboard";
import RequestDetails          from "./pages/designer/RequestDetails";
import MyProfile               from "./pages/designer/MyProfile";
import CreatePlan              from "./pages/designer/CreatePlan";
import ManageProjects          from "./pages/designer/ManageProjects";
import ProviderAvailableOffers from "./pages/provider/Provideravailableoffers";
import ProviderOfferDetails    from "./pages/provider/Providerofferdetails";
import ProviderMyProjects      from "./pages/provider/ProviderMyProjects";
import ProviderSettings        from "./pages/provider/Providersettings";
import ClientSettings          from "./pages/homeowner/clientsettings";
import DesignerSettings        from "./pages/designer/Designersettings";
import ProviderMyProfile       from "./pages/provider/MyProfile";
import BlogPage                from "./pages/Blog";
import BlogArticlePage         from "./pages/BlogArticle";

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
        <Route path="/platform"        element={<LandingPage />} />
        <Route path="/designers"       element={<ExploreDesigners />} />
        <Route path="/designers/:slug" element={<DesignerProfile />} />
        <Route path="/blog"            element={<BlogPage />} />
        <Route path="/blog/:slug"      element={<BlogArticlePage />} />

        {/* Designer routes */}
        <Route path="/designer/dashboard"    element={<DesignerRoute><DesignerRequests /></DesignerRoute>} />
        <Route path="/designer/requests"     element={<DesignerRoute><DesignerRequests /></DesignerRoute>} />
        <Route path="/designer/requests/:id" element={<DesignerRoute><RequestDetails /></DesignerRoute>} />
        <Route path="/designer/MyProfile"    element={<DesignerRoute><Navigate to="/designer/edit-profile" replace /></DesignerRoute>} />
        <Route path="/designer/profile"      element={<DesignerRoute><Navigate to="/designer/edit-profile" replace /></DesignerRoute>} />
        <Route path="/designer/edit-profile" element={<DesignerRoute><MyProfile /></DesignerRoute>} />
        <Route path="/designer/requests/:id/create-plan" element={<DesignerRoute><CreatePlan /></DesignerRoute>} />
        <Route path="/designer/manage"       element={<DesignerRoute><ManageProjects /></DesignerRoute>} />
        <Route path="/designer/settings"     element={<DesignerRoute><DesignerSettings /></DesignerRoute>} />

        {/* Client routes */}
        <Route path="/dashboard"      element={<ClientRoute><HomeownerDashboard /></ClientRoute>} />
        <Route path="/create-request" element={<ClientRoute><CreateRequest /></ClientRoute>} />
        <Route path="/requests/:id"   element={<ClientRoute><RequestDetailsPage /></ClientRoute>} />
        <Route path="/settings"       element={<ClientRoute><ClientSettings /></ClientRoute>} />

        {/* Provider routes */}
        <Route path="/provider/offers" element={<ProviderRoute><ProviderAvailableOffers /></ProviderRoute>} />
        <Route path="/provider/offers/:id" element={<ProviderRoute><ProviderOfferDetails /></ProviderRoute>} />
        <Route path="/provider/projects" element={<ProviderRoute><ProviderMyProjects /></ProviderRoute>} />
        <Route path="/provider/settings" element={<ProviderRoute><ProviderSettings /></ProviderRoute>} />
        <Route path="/provider/profile" element={<ProviderRoute><ProviderMyProfile /></ProviderRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
