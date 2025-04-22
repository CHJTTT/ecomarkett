// src/app/admin/categories/[id]/edit/EditCategoryForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
// Asegúrate que la acción exista y se importe correctamente
import { updateCategory } from '@/app/admin/categories/actions';
import type { Category } from '@prisma/client';
import Link from 'next/link';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

// Estado inicial para useFormState
const initialState = {
  message: '',
  errors: {} as Record<string, string[] | undefined>, // Tipado más específico para errors
  success: false,
};

// Componente botón para mostrar estado pendiente
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ease-in-out ${
        pending
          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {pending ? 'Actualizando...' : 'Actualizar Categoría'}
    </button>
  );
}

// Props del formulario
interface EditCategoryFormProps {
  category: Category; // Recibe la categoría a editar
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
  // Vincular la acción con el ID de la categoría
  const updateCategoryWithId = updateCategory.bind(null, category.id);

  // Usar useFormState
  const [state, formAction] = useFormState(updateCategoryWithId, initialState);

  // Efecto para mostrar notificaciones toast
  useEffect(() => {
    if (state?.success === true) { // Verificar explícitamente true
      toast.success(state.message || 'Categoría actualizada con éxito!');
    } else if (state?.success === false && state.message) { // Verificar explícitamente false y que haya mensaje
        toast.error(state.message);
        // Opcional: Loggear errores de campo si existen
        if (state.errors) {
            console.error("Errores de validación:", state.errors);
        }
    }
  }, [state]); // Ejecutar cuando 'state' cambie

  return (
    <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {/* Campo Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Categoría
        </label>
        <input
          type="text"
          id="name"
          name="name" // Debe coincidir con el FormData esperado
          required
          defaultValue={category.name} // Pre-rellenar con el nombre actual
          aria-describedby="name-error"
          // --- CLASE AÑADIDA AQUÍ ---
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" // <-- Clase de color de texto añadida
        />
        {/* Mostrar errores de validación para 'name' */}
        {state?.errors?.name && (
          <div id="name-error" aria-live="polite" className="mt-1 text-sm text-red-600">
            {/* Asegúrate que errors.name sea un array antes de mapear */}
            {Array.isArray(state.errors.name) && state.errors.name.map((error: string) => <p key={error}>{error}</p>)}
          </div>
        )}
      </div>

      {/* Mensajes generales de error/éxito (opcionales si usas toasts) */}
       {state?.message && !state.success && !state.errors && (
         <div aria-live="polite" className="text-sm text-red-600">
           <p>{state.message}</p>
         </div>
       )}

      {/* Botones */}
      <div className="flex items-center justify-end space-x-4 pt-4 mt-4 border-t border-gray-200">
         <Link href="/admin/categories" className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors">
            Cancelar
         </Link>
        <SubmitButton />
      </div>
    </form>
  );
}