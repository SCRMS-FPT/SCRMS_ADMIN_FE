// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");
  // return token ? children : <Navigate to="/login" replace />;
  return children;
}

function MainLayout() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar
        activeSection={activeSection}
        handleSectionChange={handleSectionChange}
      />
      <div className="flex-1 flex flex-col">
        <Header
          activeSection={activeSection}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "users" && <Users />}
          {activeSection === "courts" && <Courts />}
          {activeSection === "coaches" && <Coaches />}
          {activeSection === "packages" && <Packages />}
          {activeSection === "payments" && <Payments />}
          {activeSection === "reviews" && <Reviews />}
          {activeSection === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
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
}
