import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Courts from "@/pages/Courts";
import Coaches from "@/pages/Coaches";
import Packages from "@/pages/Packages";
import Payments from "@/pages/Payments";
import Reviews from "@/pages/Reviews";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  // return token ? children : <Navigate to="/login" replace />;
  return children;
};

const MainLayout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/${section}`);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full">
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
            <Route path="/courts" element={<Courts />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/settings" element={<Settings />} />
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
