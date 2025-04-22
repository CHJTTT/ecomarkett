// src/app/admin/categories/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditCategoryForm from './EditCategoryForm'; // <-- 1. Importar el formulario

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const categoryId = parseInt(params.id, 10);

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    notFound();
  }

  // Usamos un contenedor para centrar y dar padding
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Editar Categoría
        {/* Opcional: mostrar el nombre aquí también si quieres */}
        {/* : <span className="font-normal">{category.name}</span> */}
      </h1>

      {/* <-- 2. Renderizar el formulario y pasar la categoría --> */}
      <EditCategoryForm category={category} />

      {/* Se eliminaron los párrafos placeholder */}
    </div>
  );
}

// Metadata opcional para el título de la pestaña del navegador
export async function generateMetadata({ params }: EditCategoryPageProps) {
    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
        return { title: 'Categoría no encontrada' };
    }
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    return {
        title: category ? `Editar ${category.name}` : 'Editar Categoría',
    };
}