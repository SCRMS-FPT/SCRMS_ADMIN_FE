import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Coaches from "@/pages/Coaches";
import Packages from "@/pages/Packages";
import Payments from "@/pages/Payments";
import Reviews from "@/pages/Reviews";
import Login from "@/pages/Login";
import WithdrawalRequests from "@/pages/WithdrawalRequests";
import FlaggedReviews from "@/pages/FlaggedReviews"; // Add this line
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SportCentersPage from "./pages/SportCenter";
import SportCenterDetailPage from "./pages/SportCenterDetail";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

const MainLayout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const location = useLocation();

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/${section}`);
  };

  const getActiveSectionFromURL = () => {
    const path = location.pathname.split("/")[1];
    return path || "dashboard";
  };

  const getSideURL = () => {
    try {
      const path = location.pathname.split("/")[2];
      return path || undefined;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    const mainPath = getActiveSectionFromURL();
    setActiveSection(mainPath);
  }, [location.pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full">
      <ToastContainer position="bottom-right" />
      <AppSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <Header
          activeSection={activeSection}
          toggleMobileMenu={toggleMobileMenu}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/flaggedreviews" element={<FlaggedReviews />} />{" "}
            {/* Add this line */}
            <Route path="/sportcenters" element={<SportCentersPage />} />
            <Route
              path="/sportcenters/:id"
              element={<SportCenterDetailPage />}
            />
            <Route
              path="/sportcenters/create"
              element={<SportCenterDetailPage />}
            />
            <Route
              path="/withdrawalrequests"
              element={<WithdrawalRequests />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/*"
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
