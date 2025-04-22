// src/app/(public)/contact/SubmitContactButton.tsx
'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitContactButton() {
  const { pending } = useFormStatus(); // Hook para saber si la acción del form está en progreso

  return (
    <button
      type="submit"
      disabled={pending} // Deshabilitar si está pendiente
      className={`inline-flex justify-center rounded-md border border-transparent py-2 px-6 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out
        ${pending
          ? 'bg-gray-500 cursor-not-allowed' // Estilo pendiente
          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-gray-800' // Estilo normal + foco oscuro
        }
      `}
    >
      {pending ? 'Enviando...' : 'Enviar Mensaje'}
    </button>
  );
}