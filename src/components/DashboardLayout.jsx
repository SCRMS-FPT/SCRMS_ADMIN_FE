import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  CreditCard,
  Home,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { cn } from "../lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Calendar, label: "My Reservations", href: "/reservations" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: CreditCard, label: "Payment History", href: "/payments" },
  { icon: Users, label: "User Management", href: "/users" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 bg-white shadow-md lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-center border-b">
            <h1 className="text-2xl font-bold text-blue-600">Sports Courts</h1>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <span
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100",
                    location.pathname === item.href
                      ? "bg-blue-100 text-blue-600"
                      : ""
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Sports Courts</SheetTitle>
            <SheetDescription>Manage your reservations</SheetDescription>
          </SheetHeader>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100",
                    location.pathname === item.href
                      ? "bg-blue-100 text-blue-600"
                      : ""
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b bg-white px-6">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">John Doe</span>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
