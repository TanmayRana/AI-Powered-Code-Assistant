"use client";

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Bell, Search, Zap, User } from 'lucide-react';

export function TopBar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 md:ml-72 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Welcome back! 👋
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ready to continue your coding journey?
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></div>
        </Button>

        {/* XP Badge */}
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md hover:shadow-lg transition-shadow">
          <Zap className="h-3 w-3 mr-1" />
          2,450 XP
        </Badge>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User Button */}
        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <User className="h-5 w-5" />
          </Button>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
        </div>
      </div>
    </header>
  );
}