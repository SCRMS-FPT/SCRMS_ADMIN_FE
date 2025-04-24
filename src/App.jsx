import {
  Routes,
  Route,
  Navigate,
  Outlet,
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
import SportCentersPage from "@/pages/SportCenter";
import SportCenterDetailPage from "@/pages/SportCenterDetail";
import NotFound from "@/pages/NotFoundPage";
import Sports from "./pages/Sports";

// Protect routes by checking for token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

// Layout with Sidebar + Header
const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/${section}`);
  };

  useEffect(() => {
    const mainPath = location.pathname.split("/")[1];
    setActiveSection(mainPath || "dashboard");
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
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Main App Routes
const App = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/notfound" element={<NotFound />} />

    {/* Protected routes with layout */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="sports" element={<Sports />} />
      <Route path="users" element={<Users />} />
      <Route path="coaches" element={<Coaches />} />
      <Route path="packages" element={<Packages />} />
      <Route path="payments" element={<Payments />} />
      <Route path="sportcenters" element={<SportCentersPage />} />
      <Route path="sportcenters/:id" element={<SportCenterDetailPage />} />
      <Route path="sportcenters/create" element={<SportCenterDetailPage />} />
      <Route path="withdrawalrequests" element={<WithdrawalRequests />} />
      <Route path="flaggedreviews" element={<FlaggedReviews />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
