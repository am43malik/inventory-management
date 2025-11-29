
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Animated Logo */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg animate-pulse"></div>
            </div>
            <div className="absolute -inset-2 border-4 border-blue-200 border-t-blue-600 rounded-3xl animate-spin"></div>
          </div>
          
          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">StockFlow</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Loading your dashboard...</p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 text-slate-900 dark:text-white">
      <Navbar />
      <div className="flex">
        <Sidebar userRole={user.role as 'admin' | 'cashier'} />
        <main className="flex-1 pt-16 md:ml-64 transition-all duration-300 w-full">
          <div className="w-full max-w-full px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}