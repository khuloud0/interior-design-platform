import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SelectRole from "./pages/auth/SelectRole";
import DesignForm from "./components/DesignForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/design-form" element={<DesignForm />} />
      </Routes>
    </Router>
  );
}

export default App;
