// src/components/PaginationControls.tsx
'use client'; // Necesita hooks de cliente (useSearchParams)

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Iconos

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const searchParams = useSearchParams(); // Para mantener otros filtros

  // Función helper para crear la URL con el nuevo filtro de página
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    // Establece el parámetro 'page'. Si es 1, podríamos optar por quitarlo,
    // pero mantenerlo simplifica la lógica aquí.
    params.set('page', pageNumber.toString());
    return `/?${params.toString()}`; // Devuelve la ruta raíz con los parámetros actualizados
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      {/* Botón Anterior */}
      <Link
        href={canGoPrevious ? createPageURL(currentPage - 1) : '#'}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          canGoPrevious
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            : 'bg-gray-800 text-gray-600 cursor-not-allowed' // Estilo deshabilitado
        }`}
        aria-disabled={!canGoPrevious} // Accesibilidad
        tabIndex={canGoPrevious ? undefined : -1} // Evita foco si está deshabilitado
        onClick={(e) => !canGoPrevious && e.preventDefault()} // Previene navegación si está deshabilitado
      >
        <ChevronLeftIcon className="h-5 w-5 mr-1" />
        Anterior
      </Link>

      {/* Indicador de Página */}
      <span className="text-sm font-medium text-gray-400">
        Página {currentPage} de {totalPages}
      </span>

      {/* Botón Siguiente */}
      <Link
        href={canGoNext ? createPageURL(currentPage + 1) : '#'}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          canGoNext
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            : 'bg-gray-800 text-gray-600 cursor-not-allowed' // Estilo deshabilitado
        }`}
        aria-disabled={!canGoNext}
        tabIndex={canGoNext ? undefined : -1}
        onClick={(e) => !canGoNext && e.preventDefault()}
      >
        Siguiente
        <ChevronRightIcon className="h-5 w-5 ml-1" />
      </Link>
    </div>
  );
}