import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bars3Icon, XMarkIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Logo from '../assets/logo-trailrun.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between p-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="h-full w-14" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors">
              Home
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors">
              Events
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors">
              FAQ
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors flex items-center">
                  <UserIcon className="h-5 w-5 mr-1" />
                  {user.name}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors flex items-center">
                    <Cog6ToothIcon className="h-5 w-5 mr-1" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-outline text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link to="/events" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
              Events
            </Link>
            <Link to="/faq" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
              FAQ
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;