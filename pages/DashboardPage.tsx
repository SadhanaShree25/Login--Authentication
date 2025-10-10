
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

export const DashboardPage: React.FC = () => {
  const { user, logout, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-2xl w-full p-8 space-y-8 bg-white dark:bg-gray-800 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
          <p className="mt-2 text-lg text-indigo-600 dark:text-indigo-400 font-semibold">{user?.name}</p>
          <p className="mt-1 text-md text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
        
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-300">
                This is your protected dashboard. Only authenticated users can see this page.
                From here you can manage your account and access exclusive content.
            </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-xs">
            <Button onClick={logout} isLoading={loading}>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
