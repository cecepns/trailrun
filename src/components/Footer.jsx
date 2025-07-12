import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary-400">KebonKito</span>
              <span className="text-2xl font-bold text-secondary-400 ml-1">TrailRun</span>
            </div>
            <p className="text-gray-300 mb-4">
              Bergabunglah dengan komunitas trail running terbesar di Indonesia. 
              Rasakan sensasi berlari di alam terbuka dengan pemandangan yang menakjubkan.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/trailrunkebonkito" className="text-gray-300 hover:text-primary-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className="text-gray-300 hover:text-primary-400 transition-colors">Events</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-primary-400 transition-colors">FAQ</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-primary-400 transition-colors">Register</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-primary-400 transition-colors">Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Kebon kito, Lubuklinggau
              </li>
              <li className="flex items-center text-gray-300">
                <PhoneIcon className="h-5 w-5 mr-2" />
                +62 812 3456 7890
              </li>
              <li className="flex items-center text-gray-300">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                info@kebonkitotrailrun.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 KebonKito TrailRun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;