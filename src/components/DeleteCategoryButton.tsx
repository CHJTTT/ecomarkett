// src/components/DeleteCategoryButton.tsx
'use client';

import { deleteCategory } from '@/app/admin/categories/actions';
import { useFormStatus } from 'react-dom';

interface DeleteCategoryButtonProps {
  id: number;
  name: string;
}

function DeleteButtonContent() {
    const { pending } = useFormStatus();
    return (
         <button
            type="submit"
            disabled={pending}
            className={`font-medium transition-colors duration-200 ${
                pending
                 ? 'text-gray-500 cursor-not-allowed'
                 : 'text-red-600 hover:text-red-800'
            }`}
        >
            {pending ? 'Eliminando...' : 'Eliminar'}
        </button>
    );
}


export default function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  const deleteCategoryWithId = deleteCategory.bind(null, id);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${name}"?`)) {
      event.preventDefault();
    }
  };

  return (
    // --- CORRECCIÓN: Eliminar method="POST" ---
    <form action={deleteCategoryWithId} onSubmit={handleSubmit} className="inline-block">
       <DeleteButtonContent />
    </form>
    // --- FIN CORRECCIÓN ---
  );
}