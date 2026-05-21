import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

/* Public + Auth */
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SelectRole from "./pages/auth/SelectRole";

/* Homeowner */
import HomeownerDashboard from "./pages/homeowner/HomeownerDashboard";
import RequestForm from "./pages/homeowner/RequestForm";
import ExecutionPlanView from "./pages/homeowner/ExecutionPlanView";
import OffersPage from "./pages/homeowner/OffersPage";
import SelectionPage from "./pages/homeowner/SelectionPage";
import ProjectOverview from "./pages/homeowner/ProjectOverview";
import ProviderContact from "./pages/homeowner/ProviderContact";
import HomeownerProfile from "./pages/homeowner/HomeownerProfile";

/* Designer */
import DesignerDashboard from "./pages/designer/DesignerDashboard";
import RequestDetails from "./pages/designer/RequestDetails";
import CreatePlan from "./pages/designer/CreatePlan";
import ManageSteps from "./pages/designer/ManageSteps";
import ReviewOffers from "./pages/designer/ReviewOffers";
import DesignerProfile from "./pages/designer/DesignerProfile";

/* Provider */
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import StepDetails from "./pages/provider/StepDetails";
import SubmitOffer from "./pages/provider/SubmitOffer";
import ProviderProfile from "./pages/provider/ProviderProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public + Authentication */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/signup" element={<Signup />} />

        {/* Homeowner Flow */}
        <Route path="/homeowner/dashboard" element={<HomeownerDashboard />} />
        <Route path="/homeowner/request-form" element={<RequestForm />} />
        <Route
          path="/homeowner/request-form/:id"
          element={<RequestForm isEdit />}
        />
        <Route path="/homeowner/execution/:id" element={<ExecutionPlanView />} />
        <Route path="/homeowner/offers/:id" element={<OffersPage />} />
        <Route path="/homeowner/selection/:id" element={<SelectionPage />} />
        <Route path="/homeowner/project/:id" element={<ProjectOverview />} />
        <Route
          path="/homeowner/provider-contact/:id"
          element={<ProviderContact />}
        />
        <Route path="/homeowner/profile/:id" element={<HomeownerProfile />} />

        {/* Designer Flow */}
        <Route path="/designer/dashboard" element={<DesignerDashboard />} />
        <Route
          path="/designer/requests"
          element={<Navigate to="/designer/dashboard#pending-requests" replace />}
        />
        <Route
          path="/designer/available-requests"
          element={<Navigate to="/designer/dashboard#pending-requests" replace />}
        />
        <Route path="/designer/request/:id" element={<RequestDetails />} />
        <Route path="/designer/create-plan/:id" element={<CreatePlan />} />
        <Route path="/designer/manage-steps/:id" element={<ManageSteps />} />
        <Route path="/designer/review-offers/:id" element={<ReviewOffers />} />
        <Route path="/designer/profile/:id" element={<DesignerProfile />} />
        <Route path="/designers/:slug" element={<DesignerProfile />} />

        {/* Provider Flow */}
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route
          path="/provider/open-steps"
          element={<Navigate to="/provider/dashboard#open-steps" replace />}
        />
        <Route path="/provider/step/:id" element={<StepDetails />} />
        <Route path="/provider/submit-offer/:id" element={<SubmitOffer />} />
        <Route path="/provider/profile/:id" element={<ProviderProfile />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}