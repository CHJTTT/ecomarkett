// src/app/admin/categories/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
// --- 1. Importar el NUEVO componente botón ---
import DeleteCategoryButton from '@/components/DeleteCategoryButton'; // Ajusta la ruta si lo creaste en otro sitio
// --- 2. ELIMINAR la importación de la acción de aquí ---
// import { deleteCategory } from './actions';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
         {/* ... (Título y botón Nueva Categoría sin cambios) ... */}
         <h1 className="text-3xl font-bold text-gray-800">Gestionar Categorías</h1>
            <Link
            href="/admin/categories/new"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
            Nueva Categoría
            </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            {/* ... (thead sin cambios) ... */}
             <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                <th className="px-5 py-3 border-b-2 border-gray-200">ID</th>
                <th className="px-5 py-3 border-b-2 border-gray-200">Nombre</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-right">Acciones</th>
             </tr>
          </thead>
          <tbody className="text-gray-700">
            {categories.length === 0 ? (
              // ... (mensaje sin cambios) ...
               <tr>
                    <td colSpan={3} className="text-center py-10 px-5 border-b border-gray-200 text-gray-500">
                        No hay categorías creadas.
                    </td>
                </tr>
            ) : (
                categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                     {/* ... (celdas ID y Nombre sin cambios) ... */}
                     <td className="px-5 py-4 border-b border-gray-200 text-sm">{category.id}</td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">{category.name}</td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm text-right whitespace-nowrap">
                    {/* Enlace Editar (sin cambios) */}
                    <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 mr-4 font-medium"
                    >
                        Editar
                    </Link>
                    {/* --- 3. Usar el componente DeleteCategoryButton --- */}
                    <DeleteCategoryButton id={category.id} name={category.name} />
                   </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}