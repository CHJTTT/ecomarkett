// src/app/admin/SidebarNavLinks.tsx
'use client'; // <-- Marcar como Client Component

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Hook para obtener la ruta actual
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  EnvelopeIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline'; // <-- Importar iconos

// Definir la estructura de nuestros enlaces
const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Productos', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Categorías', href: '/admin/categories', icon: TagIcon },
  { name: 'Mensajes', href: '/admin/messages', icon: EnvelopeIcon },
];

export default function SidebarNavLinks() {
  const pathname = usePathname(); // Obtener la ruta actual

  return (
    <nav className="flex-1 space-y-1 px-2 py-4"> {/* Añadido padding y espacio */}
      {navLinks.map((link) => {
        // Determinar si el enlace está activo
        // Es activo si la ruta actual empieza con la ruta del enlace
        // (Excepto para el Dashboard, que debe ser exacto)
        const isActive = link.href === '/admin'
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`
              group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
              ${
                isActive
                  ? 'bg-gray-900 text-white' // Estilo activo
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Estilo inactivo + hover
              }
            `}
          >
            <link.icon // Renderizar el icono
              className={`mr-3 h-6 w-6 flex-shrink-0 ${
                isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
              }`}
              aria-hidden="true"
            />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}