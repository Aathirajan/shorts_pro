'use client';

import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Crown, Mail, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" />

      <div className="flex-1 p-6 overflow-auto">
        <PageHeader
          title="Account Settings"
          description="Manage your account preferences and settings"
        />

        <div className="max-w-2xl space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center">
                  <span className="text-2xl font-display">U</span>
                </div>
                <Button variant="secondary" size="sm">
                  Change Avatar
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="User" />
                <Input label="Last Name" defaultValue="Name" />
              </div>

              <Input
                label="Email"
                type="email"
                defaultValue="user@example.com"
                icon={<Mail className="w-4 h-4" />}
              />

              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Plan Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-surface-2 rounded-card">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Pro Plan</h3>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-sm text-text-muted mt-1">
                    $44/month · Renews on Apr 21, 2026
                  </p>
                </div>
                <Button variant="secondary">Manage</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Email me when a video is ready',
                'Email me about weekly analytics',
                'Email me about Trust Score changes',
                'Push notifications for mobile',
              ].map((label) => (
                <label
                  key={label}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm">{label}</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-border text-text focus:ring-accent-blue"
                  />
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="secondary">Change Password</Button>
              <Button variant="secondary">Enable 2FA</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
