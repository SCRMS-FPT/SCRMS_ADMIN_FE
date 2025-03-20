"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";

const Settings = () => {
  const { settings, updateSettings, isLoading } = useSettings();

  const handleSwitchChange = (field) => (checked) => {
    updateSettings({ [field]: checked });
  };

  const handleInputChange = (field) => (e) => {
    updateSettings({ [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Manage global system configuration parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Platform Fees</h3>
                <p className="text-sm text-muted-foreground">
                  Set the percentage fee charged on transactions
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.platformFee}
                    onChange={handleInputChange("platformFee")}
                    className="w-[100px]"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">System Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable system-wide notifications
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={handleSwitchChange("notificationsEnabled")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content Moderation</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-approve">Auto-approve Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve new reviews without moderation
                    </p>
                  </div>
                  <Switch
                    id="auto-approve"
                    checked={settings.autoApproveReviews}
                    onCheckedChange={handleSwitchChange("autoApproveReviews")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Maintenance</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the system in maintenance mode (users will see a
                      maintenance page)
                    </p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={handleSwitchChange("maintenanceMode")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for admin users
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={handleSwitchChange("twoFactorAuth")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Data Retention</h3>
                <p className="text-sm text-muted-foreground">
                  Set the number of days to retain user data
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.dataRetentionDays}
                    onChange={handleInputChange("dataRetentionDays")}
                    className="w-[100px]"
                  />
                  <span>days</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
