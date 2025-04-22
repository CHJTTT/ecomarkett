// src/components/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // Necesitarás instalar esto

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(initialQuery);

  // Función para actualizar la URL con el término de búsqueda
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString()); // Clona los params actuales
    if (term) {
      params.set('search', term); // Establece el nuevo término
    } else {
      params.delete('search'); // Elimina el parámetro si el término está vacío
    }
    // Navega a la misma página pero con los nuevos parámetros de búsqueda
    // Usamos replace para no añadir al historial por cada letra tecleada
    router.replace(`/?${params.toString()}`);
  };

  // Usar debounce para evitar actualizar la URL en cada pulsación de tecla
  // Espera 300ms después de que el usuario deje de escribir
  const debouncedHandleSearch = useDebouncedCallback(handleSearch, 300);

  // Actualizar el estado local si el parámetro URL cambia externamente
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <div className="mb-6 w-full max-w-md mx-auto"> {/* Centrado y con ancho máximo */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          const newQuery = e.target.value;
          setQuery(newQuery); // Actualiza el estado local inmediatamente
          debouncedHandleSearch(newQuery); // Llama a la función debounced
        }}
        placeholder="Buscar productos por nombre..."
        className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      {/* Opcional: Botón para borrar búsqueda */}
      {query && (
         <button
            onClick={() => {
                setQuery('');
                handleSearch(''); // Llama directamente para borrar rápido
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            style={{right: '0.75rem'}} // Ajuste fino de posición si es necesario
         >
            X
         </button>
      )}
    </div>
    /* Nota: El botón X requiere que el div contenedor tenga position: relative; */
    /* Ajusta el estilo del input/botón según necesites */
  );
}