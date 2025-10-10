
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!name || !email || !password) {
        setLocalError("Please fill in all fields.");
        return;
    }
    if (password.length < 8) {
        setLocalError("Password must be at least 8 characters long.");
        return;
    }
    try {
      await register(name, email, password);
      navigate('/');
    } catch (error: any) {
      setLocalError(error.message || 'Failed to register.');
    }
  };

  return (
    <AuthLayout title="Create a new account">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          id="name"
          label="Full Name"
          type="text"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Input
          id="password"
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {localError && <p className="text-sm text-red-500">{localError}</p>}

        <div>
          <Button type="submit" isLoading={loading}>
            Create Account
          </Button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
