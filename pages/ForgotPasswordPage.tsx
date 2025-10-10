import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const { forgotPassword, loading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setMessage(null);
    if (!email) {
      setLocalError("Please enter your email address.");
      return;
    }
    try {
      await forgotPassword(email);
      setMessage("If an account with that email exists, a password reset link has been sent. Please check your console for the reset link.");
    } catch (error: any) {
      setLocalError(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <AuthLayout title="Forgot your password?">
      <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
        Enter your email address and we will send you a link to reset your password.
      </p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {!message ? (
          <>
            <Input
              id="email"
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {localError && <p className="text-sm text-red-500">{localError}</p>}
            <div>
              <Button type="submit" isLoading={loading}>
                Send Reset Link
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-600/30">
            {message}
          </p>
        )}
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Remembered your password?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};