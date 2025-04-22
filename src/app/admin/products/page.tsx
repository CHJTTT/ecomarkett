import { prisma } from '@/lib/prisma'; // Importamos nuestra instancia de Prisma
import Link from 'next/link';
import type { Product, Category } from '@prisma/client';
import { deleteProductAction } from './new/actions'; // <-- IMPORTACIÓN AÑADIDA

export default async function AdminProductsPage() {

    let products: (Product & { category: Category })[] = []; // Corregido doble ;;
    let error = null;

  try {
    // Obtenemos los productos, incluyendo su categoría
    products = await prisma.product.findMany({
      include: {
        category: true, // Para mostrar el nombre de la categoría
      },
      orderBy: [ // Podemos ordenar por múltiples campos
         { category: { name: 'asc'} }, // Primero por categoría
         { name: 'asc' }                // Luego por nombre de producto
      ]
    });
  } catch (e) {
    console.error("Error fetching products for admin:", e);
    error = "Error al cargar los productos.";
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6"> {/* Eliminado text-gray-900 redundante aquí */}
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Productos</h1> {/* Asegurado color en H1 */}
        {/* Enlace para añadir producto */}
        <Link
          href="/admin/products/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Añadir Producto
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Tabla de Productos */}
      {!error && (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span> {/* Para accesibilidad */}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toString()}</div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  {/* *** CELDA DE ACCIONES MODIFICADA *** */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Enlace Editar */}
                    <Link href={`/admin/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Editar
                    </Link>
                    {/* Formulario para Borrar */}
                    <form action={deleteProductAction} className="inline-block">
                      <input type="hidden" name="productId" value={product.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-900"
                        // Confirmación comentada por simplicidad en Server Component
                        // onClick={(e) => !window.confirm('¿Estás seguro?') && e.preventDefault()}
                      >
                        Borrar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
               {/* Fila si no hay productos */}
               {products.length === 0 && !error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No se encontraron productos.
                    </td>
                  </tr>
               )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}