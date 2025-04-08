import { useTheme } from "../../contexts/theme_context";
import { Menu, Sun, Moon, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardData } from "@/hooks/useDashboardData";
import PropTypes from "prop-types";

// Menu titles as a constant to avoid hardcoding in the component
const SECTION_TITLES = {
  dashboard: "Trang tổng quan",
  users: "Quản lý người dùng",
  courts: "Quản lý sân",
  coaches: "Quản lý huấn luyện viên",
  packages: "Quản lý gói dịch vụ",
  payments: "Quản lý thanh toán",
  reviews: "Quản lý đánh giá & báo cáo",
  settings: "Cài đặt hệ thống",
  sportcenters: "Quản lý cụm sân",
};

const Header = ({ activeSection, toggleMobileMenu }) => {
  const { theme, setTheme } = useTheme();
  const { data: dashboardData } = useDashboardData();

  const getSectionTitle = () => SECTION_TITLES[activeSection] || "Dashboard";

  const handleThemeToggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        type="button"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Bật menu cho điện thoại</span>
      </Button>

      {/* Section Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">
          {getSectionTitle()}
        </h1>
      </div>

      {/* Right-side Controls */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={handleThemeToggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Bật chế độ đêm</span>
        </Button>

        {/* Notifications Dropdown */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="View notifications"
              >
                <Flag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {dashboardData?.notifications?.length || 0}
                </span>
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {dashboardData?.notifications?.length > 0 ? (
              dashboardData.notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start"
                >
                  <div className="flex w-full justify-between">
                    <span className="font-medium">{notification.message}</span>
                    <Badge
                      variant={
                        notification.type === "alert"
                          ? "destructive"
                          : notification.type === "warning"
                          ? "warning"
                          : "default"
                      }
                    >
                      {notification.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>No notifications available</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* User Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full"
              aria-label="User account options"
            >
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <span className="text-sm font-medium">AD</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
            <DropdownMenuItem>Cài đặt</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Thoát</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

Header.propTypes = {
  activeSection: PropTypes.string.isRequired,
  toggleMobileMenu: PropTypes.func.isRequired,
};

export default Header;
