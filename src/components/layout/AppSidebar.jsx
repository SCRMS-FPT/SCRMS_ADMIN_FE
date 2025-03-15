"use client"
import { Activity, Home, Users, Building2, User, Package, CreditCard, Star, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
} from "@/components/ui/sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

const AppSidebar = ({ activeSection, handleSectionChange, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex">
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-2 py-3">
            <Activity className="h-6 w-6 text-sidebar-primary" />
            <span className="text-xl font-bold">Admin Portal</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleSectionChange("dashboard")}
                    isActive={activeSection === "dashboard"}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => handleSectionChange("users")} isActive={activeSection === "users"}>
                    <Users className="h-4 w-4" />
                    <span>User Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleSectionChange("courts")}
                    isActive={activeSection === "courts"}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Court Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleSectionChange("coaches")}
                    isActive={activeSection === "coaches"}
                  >
                    <User className="h-4 w-4" />
                    <span>Coach Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Services</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleSectionChange("packages")}
                    isActive={activeSection === "packages"}
                  >
                    <Package className="h-4 w-4" />
                    <span>Service Packages</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleSectionChange("payments")}
                    isActive={activeSection === "payments"}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Moderation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleSectionChange("reviews")}
                    isActive={activeSection === "reviews"}
                  >
                    <Star className="h-4 w-4" />
                    <span>Reviews & Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleSectionChange("settings")}
                    isActive={activeSection === "settings"}
                  >
                    <Settings className="h-4 w-4" />
                    <span>System Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
                <span className="text-sm font-medium">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70">admin@example.com</p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Log out</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Log out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <div className="flex flex-col h-full">
            <div className="border-b p-4 flex items-center gap-2">
              <Activity className="h-6 w-6" />
              <span className="text-xl font-bold">Admin Portal</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Main</h3>
                  <Button
                    variant={activeSection === "dashboard" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("dashboard")}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={activeSection === "users" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("users")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    User Management
                  </Button>
                  <Button
                    variant={activeSection === "courts" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("courts")}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Court Management
                  </Button>
                  <Button
                    variant={activeSection === "coaches" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("coaches")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Coach Management
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Services</h3>
                  <Button
                    variant={activeSection === "packages" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("packages")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Service Packages
                  </Button>
                  <Button
                    variant={activeSection === "payments" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("payments")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Management
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Moderation</h3>
                  <Button
                    variant={activeSection === "reviews" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("reviews")}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Reviews & Reports
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">System</h3>
                  <Button
                    variant={activeSection === "settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSectionChange("settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </div>
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <span className="text-sm font-medium">AD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@example.com</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default AppSidebar

