// src/components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition duration-200">
              EcoMarket
            </Link>
          </div>

          {/* Navegación Principal */}
          <nav className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-200">
              Inicio
            </Link>
            <Link href="/#products" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-200">
              Productos
            </Link>
            <Link href="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-200">
              Contacto
            </Link>
             {/* --- Separador Visual Opcional --- */}
            <span className="text-gray-600">|</span>
             {/* --- Enlaces de Admin --- */}
            <Link href="/admin/products" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-200">
              Admin Prod.
            </Link>
             {/* --- AÑADIDO: Enlace a Categorías --- */}
            <Link href="/admin/categories" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-200">
              Categorías
            </Link>
          </nav>

          {/* Iconos Derecha */}
          <div className="flex items-center space-x-2">
            {/* Carrito */}
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-700 transition duration-200">
              <span className="sr-only">Ver carrito</span>
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 text-white text-xs flex items-center justify-center ring-2 ring-gray-800">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Botón Hamburguesa */}
            <div className="sm:hidden">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Abrir menú principal</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      <div
        className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
          <Link href="/" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">
            Inicio
          </Link>
          <Link href="/#products" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
            Productos
          </Link>
          <Link href="/contact" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
            Contacto
          </Link>
           {/* --- Separador Visual Móvil Opcional --- */}
          <div className="border-t border-gray-700 my-1"></div>
           {/* --- Enlaces Admin Móvil --- */}
          <Link href="/admin/products" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
            Admin Productos
          </Link>
           {/* --- AÑADIDO: Enlace Categorías Móvil --- */}
          <Link href="/admin/categories" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
            Admin Categorías
          </Link>
        </div>
      </div>
    </header>
  );
}