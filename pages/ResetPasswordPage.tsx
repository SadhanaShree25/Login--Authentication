import React, { useState, FormEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { resetPassword, loading } = useAuth();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!password || !confirmPassword) {
      setLocalError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }
    if (!token) {
      setLocalError("Reset token is missing.");
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccessMessage("Your password has been reset successfully! You will be redirected to the login page shortly.");
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setLocalError(error.message || 'Failed to reset password.');
    }
  };

  return (
    <AuthLayout title="Reset your password">
      {successMessage ? (
        <div className="text-center">
             <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-600/30">
                {successMessage}
            </p>
            <div className="mt-6">
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Go to Login
                </Link>
            </div>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="password"
            label="New Password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            id="confirm-password"
            label="Confirm New Password"
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          {localError && <p className="text-sm text-red-500">{localError}</p>}

          <div>
            <Button type="submit" isLoading={loading}>
              Reset Password
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};