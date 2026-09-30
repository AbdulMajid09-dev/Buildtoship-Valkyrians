import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Sprout, Lock, Mail, User, Globe, ArrowRight } from 'lucide-react';
import { RegisterSchema } from '@shared';

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

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const validation = RegisterSchema.safeParse({
      fullName,
      email,
      password,
      preferredLanguage,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path[0] as string;
        if (path) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName,
        email,
        password,
        preferredLanguage,
      });
      navigate('/app', { replace: true });
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-11 h-11 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-stone-900 tracking-tight">AgriAdvisory</span>
        </Link>
        <h2 className="mt-4 text-xl font-bold text-stone-900">Create your farmer profile</h2>
        <p className="mt-1 text-xs text-stone-500">
          Start receiving structured agricultural intelligence for your fields
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            {generalError && (
              <Alert type="error" className="mb-4">
                {generalError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                placeholder="e.g. Maria Gonzalez"
                value={fullName}
                error={errors.fullName}
                leftIcon={<User className="w-4 h-4" />}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
              />

              <Input
                label="Email Address"
                type="email"
                required
                autoComplete="email"
                placeholder="farmer@example.com"
                value={email}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4" />}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
              />

              <Input
                label="Password (min 8 characters)"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
              />

              <Select
                label="Preferred Advisory Language"
                value={preferredLanguage}
                options={LANGUAGES}
                onChange={(e) => setPreferredLanguage(e.target.value)}
              />

              <Button
                type="submit"
                size="md"
                className="w-full mt-2"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account & Continue
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-agri-700 hover:text-agri-800">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
