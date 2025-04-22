// src/app/admin/layout.tsx
import Link from 'next/link';
import SidebarNavLinks from './SidebarNavLinks'; // <-- 1. Importar el nuevo componente
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'; // Importar icono para "Volver"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen bg-gray-100">
      {/* Sidebar Mejorada */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col"> {/* Hacer el aside flex container */}
        {/* Encabezado del Sidebar */}
        <div className="p-4 border-b border-gray-700"> {/* Padding y borde inferior */}
          <h2 className="text-xl font-semibold text-center"> {/* Título centrado */}
            <Link href="/admin">EcoMarket Admin</Link>
          </h2>
        </div>

        {/* Navegación Principal (Componente Cliente) */}
        <SidebarNavLinks /> {/* <-- 2. Usar el componente aquí */}

        {/* Enlace para Volver (en la parte inferior) */}
        <div className="mt-auto p-4 border-t border-gray-700"> {/* Padding y borde superior */}
          <Link
             href="/"
             className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 ease-in-out"
          >
             <ArrowUturnLeftIcon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
             Volver a la Tienda
          </Link>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto"> {/* Añadido overflow */}
        {children}
      </main>
    </section>
  );
}