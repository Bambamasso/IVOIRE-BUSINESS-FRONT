'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CiUser } from "react-icons/ci";
import { SlBasket } from "react-icons/sl";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // On est sûr d'être côté navigateur ici
    setIsClient(true);
    const stored = localStorage.getItem('token');
    let token = null;
    if (stored) {
      try {
        token = JSON.parse(stored);
      } catch {
        token = stored;
      }
    }
    setIsAuthenticated(!!token);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    const stored = localStorage.getItem('token');
    let token = null;
    if (stored) {
      try {
        token = JSON.parse(stored);
      } catch {
        token = stored;
      }
    }

    if (!token) {
      setIsAuthenticated(false);
      router.push('/login');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl + '/api/logout';

    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      
      if (response.data.status === 'success') {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push('/login');
      } else {
        console.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      // En cas d’erreur, on nettoie quand même le front
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-2xl dark:bg-gray-900 dark:shadow-2xl border-b-2 border-blue-100 dark:border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-white">
              MonLogo
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6 flex-1 ml-8">
            <Link
              href="/a-propos"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-500 transition-colors"
            >
              À Propos
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-500 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-500 transition-colors"
            >
              Contact
            </Link>

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="relative ml-4">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 w-40"
                />
                <button
                  type="submit"
                  className="ml-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
                >
                  <CiSearch size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Icônes à droite */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Panier */}
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-500 transition-colors"
              title="Panier"
            >
              <SlBasket size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Zone Connexion / Déconnexion : seulement après montage client */}
            {isClient && !isAuthenticated && (
              <Link
                href="/login"
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <CiUser size={20} />
                Connexion
              </Link>
            )}

            {isClient && isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Déconnexion
              </button>
            )}
          </div>

          {/* Burger mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              aria-expanded={isOpen}
            >
              {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={`
          md:hidden 
          overflow-hidden 
          transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-800
          ${isOpen ? 'max-h-96 opacity-100 shadow-xl' : 'max-h-0 opacity-0'}
        `}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col px-2 pt-4 pb-4 space-y-3 sm:px-3">
          {/* Barre de recherche mobile */}
          <form onSubmit={handleSearch} className="px-3 pb-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 flex-1"
              />
              <button
                type="submit"
                className="ml-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
              >
                <CiSearch size={20} />
              </button>
            </div>
          </form>

          <Link
            href="/a-propos"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            À Propos
          </Link>
          <Link
            href="/services"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            Contact
          </Link>

          {/* Panier mobile */}
          <Link
            href="/cart"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMenu}
          >
            <SlBasket size={20} />
            Panier
          </Link>

          {isClient && !isAuthenticated && (
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              onClick={toggleMenu}
            >
              Connexion
            </Link>
          )}

          {isClient && isAuthenticated && (
            <button
              onClick={async () => {
                await handleLogout();
                toggleMenu();
              }}
              className="block text-left w-full px-3 py-2 rounded-md text-base font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
