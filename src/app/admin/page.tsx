// src/app/admin/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { ShoppingBagIcon, TagIcon, EnvelopeIcon } from '@heroicons/react/24/outline'; // Usaremos iconos

// Metadata para el título de la pestaña del navegador
export const metadata: Metadata = {
  title: 'Dashboard - Admin EcoMarket',
  description: 'Panel de administración de la tienda EcoMarket.',
};

export default function AdminDashboardPage() {
  return (
    <div className="p-6 md:p-8"> {/* Padding general */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Panel de Administración</h1>
      <p className="text-gray-600 mb-8">
        Bienvenido al panel de gestión de EcoMarket. Selecciona una sección para empezar.
      </p>

      {/* Sección de Enlaces Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Tarjeta Productos */}
        <Link href="/admin/products" className="block p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <div className="flex items-center space-x-4">
            <ShoppingBagIcon className="h-10 w-10 text-blue-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Productos</h2>
              <p className="text-sm text-gray-500 mt-1">Gestiona el catálogo de productos.</p>
            </div>
          </div>
        </Link>

        {/* Tarjeta Categorías */}
        <Link href="/admin/categories" className="block p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <div className="flex items-center space-x-4">
            <TagIcon className="h-10 w-10 text-green-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Categorías</h2>
              <p className="text-sm text-gray-500 mt-1">Organiza los productos por categorías.</p>
            </div>
          </div>
        </Link>

        {/* Tarjeta Mensajes */}
        <Link href="/admin/messages" className="block p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <div className="flex items-center space-x-4">
            <EnvelopeIcon className="h-10 w-10 text-purple-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Mensajes</h2>
              <p className="text-sm text-gray-500 mt-1">Revisa las consultas de contacto.</p>
            </div>
          </div>
        </Link>

        {/* Puedes añadir más tarjetas aquí en el futuro (ej. Usuarios, Pedidos) */}

      </div>

      {/* Podrías añadir aquí más secciones en el futuro, como estadísticas rápidas */}
    </div>
  );
}