"use client";
import {
  Activity,
  Home,
  Users,
  Building2,
  User,
  Package,
  Landmark,
  CreditCard,
  Star,
  Flag,
  LayoutGrid,
  Settings,
  LogOut,
  Volleyball,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import PropTypes from "prop-types";

// Reusable menu items configuration
const MENU_ITEMS = [
  {
    group: "Chính ",
    items: [
      {
        label: "Bảng điều khiển",
        icon: <Home className="h-5 w-5" />,
        section: "dashboard",
      },
      {
        label: "Quản lý người dùng",
        icon: <Users className="h-5 w-5" />,
        section: "users",
      },
      {
        label: "Quản lý cụm sân",
        icon: <Landmark className="h-5 w-5" />,
        section: "sportcenters",
      },
      {
        label: "Quản lý huấn luyện viên",
        icon: <User className="h-5 w-5" />,
        section: "coaches",
      },
      ,
      {
        label: "Quản lý các môn thể thao",
        icon: <Volleyball className="h-5 w-5" />,
        section: "sports",
      },
    ],
  },
  {
    group: "Dịch vụ",
    items: [
      {
        label: "Gói dịch vụ",
        icon: <Package className="h-5 w-5" />,
        section: "packages",
      },
      {
        label: "Yêu cầu rút tiền",
        icon: <CreditCard className="h-5 w-5" />,
        section: "withdrawalrequests",
      },
    ],
  },
  {
    group: "Kiểm duyệt",
    items: [
      {
        label: "Báo cáo đánh giá",
        icon: <Flag className="h-5 w-5" />,
        section: "flaggedreviews",
      },
    ],
  },
];

const AppSidebar = ({
  activeSection,
  onSectionChange,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogout,
}) => {
  // Reusable Sidebar Item Component
  const SidebarItem = ({ item, isActive, onClick }) => (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={onClick}
        isActive={isActive}
        asChild
        aria-label={item.label}
      >
        <Button
          variant={isActive ? "default" : "ghost"}
          className="w-full justify-start"
        >
          {item.icon}
          <span>{item.label}</span>
        </Button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex border-r">
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-2 py-3">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Trang quản lý website</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {MENU_ITEMS.map((group) => (
            <SidebarGroup key={group.group}>
              <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarItem
                      key={item.section}
                      item={item}
                      isActive={activeSection === item.section}
                      onClick={() => onSectionChange(item.section)}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <span className="text-sm font-medium">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium">Quản trị viên</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
          <SheetDescription className="sr-only">
            This is the mobile menu for the admin portal.
          </SheetDescription>
          <div className="flex flex-col h-full">
            <div className="border-b p-4 flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Trang quản lý website</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {MENU_ITEMS.map((group) => (
                  <div key={group.group} className="space-y-2">
                    <h3 className="text-sm font-medium">{group.group}</h3>
                    {group.items.map((item) => (
                      <Button
                        key={item.section}
                        variant={
                          activeSection === item.section ? "default" : "ghost"
                        }
                        className="w-full justify-start"
                        onClick={() => {
                          onSectionChange(item.section);
                          setIsMobileMenuOpen(false);
                        }}
                        aria-label={item.label}
                      >
                        {item.icon}
                        {item.label}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <span className="text-sm font-medium">AD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Quản trị viên</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

AppSidebar.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  isMobileMenuOpen: PropTypes.bool.isRequired,
  setIsMobileMenuOpen: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default AppSidebar;
