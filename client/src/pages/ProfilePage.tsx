import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { User, Mail, Globe, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ProfileUpdateSchema } from '@shared';

const LANGUAGES = [
  'English',
  'Spanish (Español)',
  'Hindi (हिन्दी)',
  'French (Français)',
  'Portuguese (Português)',
  'Swahili (Kiswahili)',
  'Arabic (العربية)',
  'Other',
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload: any = {
      fullName: fullName.trim(),
      preferredLanguage,
    };

    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const validation = ProfileUpdateSchema.safeParse(payload);
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0]?.message || 'Invalid input data.');
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile(payload);
      setSuccessMessage('Profile and preferences updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
          Farmer Profile & Field Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Manage your contact credentials, advisory language preference, and security keys.
        </p>
      </div>

      {successMessage && (
        <Alert type="success" title="Success">
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert type="error" title="Error">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader
            icon={<User className="w-5 h-5 text-agri-600" />}
            title="Personal & Language Information"
            subtitle="Used to personalize agricultural reports"
          />
          <CardContent className="space-y-4">
            <Input
              label="Email Address (Account Identifier)"
              disabled
              value={user?.email || ''}
              leftIcon={<Mail className="w-4 h-4 text-stone-400" />}
              hint="Email addresses cannot be changed once verified."
            />

            <Input
              label="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-stone-400" />}
            />

            <Select
              label="Preferred Advisory Language"
              value={preferredLanguage}
              options={LANGUAGES}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              hint="Determines default terminology for generated summaries."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            icon={<Lock className="w-5 h-5 text-stone-600" />}
            title="Security & Password"
            subtitle="Leave blank if you do not wish to change your password"
          />
          <CardContent className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              hint="Required only when setting a new password"
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              hint="Minimum 8 characters"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="md" isLoading={isUpdating}>
            Save Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
