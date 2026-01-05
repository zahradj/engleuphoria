import React from 'react';
import { Link } from 'react-router-dom';
import { SimpleAuthForm } from '@/components/auth/SimpleAuthForm';
import { ThemeModeToggle } from '@/components/ui/ThemeModeToggle';
import logoDark from '@/assets/logo-dark.png';

const Login = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-violet-500/20 to-purple-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mix-blend-screen filter blur-3xl" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoDark} alt="EnglEuphoria" className="w-10 h-10 object-contain bg-white/90 rounded-xl p-1" />
            <span className="text-xl font-bold text-white">
              EnglEuphoria
            </span>
          </Link>
          <ThemeModeToggle className="text-white/80 hover:text-white hover:bg-white/10" />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-20">
        <SimpleAuthForm mode="login" />
      </div>
    </div>
  );
};

export default Login;
