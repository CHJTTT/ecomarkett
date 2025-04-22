import { prisma } from '@/lib/prisma';
import type { Category, Product } from '@prisma/client';
import Link from 'next/link';
// Importaremos el MISMO componente de formulario, pero lo adaptaremos
import ProductForm from '../../new/ProductForm'; // Reutilizamos el formulario de 'new'

// La interfaz para las props de esta página, incluyendo los parámetros de la ruta
interface EditProductPageProps {
  params: {
    productId: string; // El ID viene como string desde la URL
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = parseInt(params.productId, 10); // Convertimos el ID a número

  let product: (Product & { category: Category }) | null = null;
  let categories: Category[] = [];
  let error: string | null = null;

  // Validar que productId sea un número válido
  if (isNaN(productId)) {
    error = "ID de producto inválido.";
  } else {
    try {
      // Usamos Promise.all para ejecutar ambas consultas en paralelo
      [product, categories] = await Promise.all([
        // 1. Buscar el producto específico por ID, incluyendo su categoría
        prisma.product.findUnique({
          where: { id: productId },
          include: { category: true }, // Incluimos categoría para pre-seleccionar
        }),
        // 2. Obtener todas las categorías para el selector <select>
        prisma.category.findMany({
          orderBy: { name: 'asc' },
        }),
      ]);

      // Verificar si el producto fue encontrado
      if (!product) {
        error = "Producto no encontrado.";
      }

    } catch (e) {
      console.error("Error fetching data for edit product form:", e);
      error = "Error al cargar los datos para editar el producto.";
    }
  }


  // --- Renderizado Condicional ---

  // Si hubo error o no se encontró el producto o no hay categorías
  if (error || !product || categories.length === 0) {
    // Si el error es solo por no encontrar el producto, mostramos ese mensaje específico
    if (!error && !product) error = "Producto no encontrado.";
    // Si no hay categorías y no había otro error, establecemos ese error
    if (!error && categories.length === 0) error = "No hay categorías disponibles.";

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Editar Producto</h1>
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded">
          <p>{error || 'No se pudieron cargar los datos necesarios.'}</p>
          <Link href="/admin/products" className="text-blue-600 hover:underline mt-2 inline-block">
            Volver a la lista de productos
          </Link>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizamos el formulario pasándole el producto y las categorías
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Producto: {product.name}</h1>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          Cancelar y volver a la lista
        </Link>
      </div>
      {/* Pasamos el 'product' encontrado al formulario */}
      {/* Necesitaremos modificar ProductForm para que acepte y use este 'product' */}
      <ProductForm categories={categories} product={product} />
    </div>
  );
}