import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Sprout, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { LoginSchema } from '@shared';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/app';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoFill = () => {
    setEmail('demo.farmer@agriadvisory.org');
    setPassword('DemoPassword123!');
    setErrors({});
    setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const validation = LoginSchema.safeParse({ email, password });
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
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setGeneralError(err.message || 'Invalid email or password.');
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
        <h2 className="mt-4 text-xl font-bold text-stone-900">Sign in to your farmer portal</h2>
        <p className="mt-1 text-xs text-stone-500">Access your historical crop telemetry and advisories</p>
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
                label="Password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
              />

              <Button
                type="submit"
                size="md"
                className="w-full mt-2"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <button
                type="button"
                onClick={handleDemoFill}
                className="inline-flex items-center text-agri-700 hover:text-agri-800 font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Fill Demo Credentials
              </button>
              <Link to="/register" className="font-semibold text-stone-700 hover:text-agri-700">
                Create new account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
