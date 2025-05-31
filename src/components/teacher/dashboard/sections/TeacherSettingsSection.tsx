
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Calendar, 
  CreditCard, 
  Shield, 
  Globe,
  Palette,
  Download
} from "lucide-react";

interface TeacherSettingsSectionProps {
  handlers: any;
}

export const TeacherSettingsSection = ({ handlers }: TeacherSettingsSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" defaultValue="Fátima Djamina" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="fatima.djamina@email.com" />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" defaultValue="Experienced English teacher specializing in children's education" />
            </div>
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input id="hourlyRate" type="number" defaultValue="11.00" />
            </div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive lesson reminders via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>New Student Alerts</Label>
                <p className="text-sm text-gray-600">Get notified when new students book lessons</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Parent Messages</Label>
                <p className="text-sm text-gray-600">Notifications for parent communications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Platform Updates</Label>
                <p className="text-sm text-gray-600">Updates about new features and changes</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="EST (UTC-5)" readOnly />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-accept bookings</Label>
                <p className="text-sm text-gray-600">Automatically accept lesson requests</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekend availability</Label>
                <p className="text-sm text-gray-600">Allow bookings on weekends</p>
              </div>
              <Switch />
            </div>
            <div>
              <Label htmlFor="bufferTime">Buffer time between lessons (minutes)</Label>
              <Input id="bufferTime" type="number" defaultValue="15" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment & Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Current balance</span>
              <span className="font-semibold text-green-600">$279.60</span>
            </div>
            <div className="flex justify-between items-center">
              <span>This month's earnings</span>
              <span className="font-semibold">$156.00</span>
            </div>
            <Separator />
            <div>
              <Label htmlFor="paypalEmail">PayPal Email</Label>
              <Input id="paypalEmail" type="email" placeholder="your-paypal@email.com" />
            </div>
            <div>
              <Label htmlFor="bankAccount">Bank Account (Last 4 digits)</Label>
              <Input id="bankAccount" placeholder="****1234" />
            </div>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Tax Documents
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-factor authentication</Label>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <Switch />
            </div>
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Input id="language" defaultValue="English" readOnly />
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Input id="theme" defaultValue="Light" readOnly />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Show student progress charts</Label>
                <p className="text-sm text-gray-600">Display progress visualization</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact view</Label>
                <p className="text-sm text-gray-600">Use condensed layout</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
