// src/components/CategoryFilter.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Category } from '@prisma/client'; // Importa el tipo

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null; // Nombre de la categoría seleccionada actualmente
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const searchParams = useSearchParams(); // Hook para leer parámetros actuales

  // Función helper para crear la URL con el nuevo filtro de categoría
  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name); // Elimina el parámetro si el valor es null (para "Todas")
    }
    return params.toString();
  };

  return (
    // Contenedor del filtro: margen inferior, scroll horizontal si hay muchas categorías
    <div className="mb-8 overflow-x-auto pb-2">
      {/* Lista de categorías: flex para horizontal, espacio entre items */}
      <nav className="flex space-x-4">
        {/* Enlace "Todas" */}
        <Link
          href={`/?${createQueryString('category', null)}`} // Elimina el parámetro 'category'
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
            !selectedCategory // Está activo si NO hay categoría seleccionada
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
        >
          Todas
        </Link>

        {/* Mapea las categorías obtenidas */}
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/?${createQueryString('category', category.name)}`} // Establece el parámetro 'category' con el nombre
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              selectedCategory === category.name // Está activo si coincide con la seleccionada
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            {category.name} {/* Muestra el nombre de la categoría */}
          </Link>
        ))}
      </nav>
    </div>
  );
}