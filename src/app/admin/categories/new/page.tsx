// src/app/admin/categories/new/page.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createCategory } from '../actions';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-6 py-2 rounded text-white font-semibold transition duration-200 ${
        pending
          ? 'bg-gray-400 cursor-not-allowed' // Botón deshabilitado gris
          : 'bg-green-600 hover:bg-green-700' // Botón normal verde
      }`}
    >
      {pending ? 'Guardando...' : 'Crear Categoría'}
    </button>
  );
}

export default function NewCategoryPage() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createCategory, initialState);

  return (
    <div className="p-6 md:p-8 max-w-lg mx-auto">
       {/* Título oscuro */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nueva Categoría</h1>

      <form action={dispatch} className="space-y-4">
        <div>
           {/* Label oscura */}
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Categoría
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
             // --- CAMBIO: Quitar text-white, añadir text-gray-900 ---
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500" // Texto oscuro, placeholder gris
            placeholder="Ej: Lácteos" // Añadir un placeholder
            aria-describedby="name-error"
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-1 text-sm text-red-600" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Mensaje de error (rojo está bien) */}
        {state.message && (
          <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-600">{state.message}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center justify-end space-x-4 pt-2">
            {/* Enlace Cancelar oscuro */}
           <Link href="/admin/categories" className="text-gray-600 hover:text-gray-800">
                Cancelar
           </Link>
           <SubmitButton />
        </div>
      </form>
    </div>
  );
}