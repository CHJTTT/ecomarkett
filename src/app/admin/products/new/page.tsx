import { prisma } from '@/lib/prisma';
import type { Category } from '@prisma/client';
import Link from 'next/link';
import ProductForm from './ProductForm'; // Importamos el componente del formulario

export default async function NewProductPage() {
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    // Obtenemos todas las categorías para el selector <select>
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.error("Error fetching categories for new product form:", e);
    error = "Error al cargar las categorías.";
  }

  // Si no se pudieron cargar las categorías, mostramos un error y no el formulario
  if (error || categories.length === 0) {
    return (
      <div>
        {/* *** CAMBIO AQUÍ: Añadido text-gray-900 *** */}
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Añadir Nuevo Producto</h1>
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded">
          <p>{error || 'No hay categorías disponibles.'} No se puede añadir un producto sin categorías.</p>
          <Link href="/admin/products" className="text-blue-600 hover:underline mt-2 inline-block">
            Volver a la lista de productos
          </Link>
          {/* Podrías añadir un enlace para crear categorías si no existen */}
        </div>
      </div>
    );
  }

  // Si hay categorías, renderizamos el componente del formulario
  // Pasaremos las categorías como prop al formulario
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         {/* *** CAMBIO AQUÍ: Añadido text-gray-900 *** */}
        <h1 className="text-3xl font-bold text-gray-900">Añadir Nuevo Producto</h1>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          Cancelar y volver a la lista
        </Link>
      </div>
      {/* Usamos el componente del formulario */}
      <ProductForm categories={categories} />
    </div>
  );
}