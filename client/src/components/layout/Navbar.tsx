import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, LayoutDashboard, PlusCircle, History, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/app', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'New Advisory', path: '/app/advisory/new', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'History', path: '/app/advisories', icon: <History className="w-4 h-4" /> },
    { label: 'Profile', path: '/app/profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to={isAuthenticated ? '/app' : '/'} className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-sm group-hover:bg-agri-700 transition-colors">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
                AgriAdvisory
                <span className="text-[10px] uppercase font-semibold bg-agri-100 text-agri-800 px-1.5 py-0.2 rounded-md">
                  AI
                </span>
              </span>
              <p className="text-[11px] text-stone-500 font-medium -mt-1 hidden sm:block">
                Crop Health & Soil Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation for Authenticated Users */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-agri-50 text-agri-800 font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-stone-600">
              <a href="#features" className="hover:text-stone-900 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How It Works</a>
              <a href="#domains" className="hover:text-stone-900 transition-colors">Domains</a>
              <a href="#safety" className="hover:text-stone-900 transition-colors">AI Safety</a>
            </nav>
          )}

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/app/profile"
                  className="flex items-center space-x-2 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition-colors font-medium"
                >
                  <div className="w-5 h-5 rounded-full bg-agri-600 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                    {user?.fullName ? user.fullName[0] : 'U'}
                  </div>
                  <span className="truncate max-w-[120px]">{user?.fullName || user?.email}</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Crop Advisory
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 bg-stone-50 rounded-lg flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-agri-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user?.fullName ? user.fullName[0] : 'U'}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-stone-900">{user?.fullName || 'Farmer'}</div>
                  <div className="text-stone-500">{user?.email}</div>
                </div>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-stone-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Log out
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                How It Works
              </a>
              <a
                href="#domains"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                Domains
              </a>
              <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Get Crop Advisory
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
