import type { Category, Product } from '@prisma/client'; // Añadido Product
import { saveProductAction } from './actions'; // Importamos la acción unificada

// --- Interfaz de Props Actualizada ---
interface ProductFormProps {
  categories: Category[];
  product?: Product & { category: Category }; // Hacemos 'product' opcional
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  // Determinamos si estamos editando para cambiar textos o lógica
  const isEditing = !!product; // True si 'product' tiene datos

  return (
    // Usamos la misma acción para crear y actualizar
    <form action={saveProductAction} className="space-y-6 bg-white p-8 rounded-lg shadow">

      {/* *** NUEVO: Input oculto para el ID si estamos editando *** */}
      {isEditing && (
        <input type="hidden" name="productId" value={product.id} />
      )}

      {/* Campo Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del Producto
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          // *** CAMBIO: Añadido defaultValue ***
          defaultValue={product?.name ?? ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
        />
      </div>

      {/* Campo Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          required
          // *** CAMBIO: Añadido defaultValue ***
          defaultValue={product?.description ?? ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
        ></textarea>
      </div>

      {/* Fila para Precio y Stock */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            step="0.01"
            min="0.01"
            // *** CAMBIO: Añadido defaultValue (convertido a string) ***
            defaultValue={product?.price?.toString() ?? ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock (Unidades)
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            required
            step="1"
            min="0"
             // *** CAMBIO: Añadido defaultValue (convertido a string) ***
            defaultValue={product?.stock?.toString() ?? ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
      </div>

      {/* Fila para SKU y URL Imagen */}
       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
              SKU (Código Único)
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              required
              // *** CAMBIO: Añadido defaultValue ***
              defaultValue={product?.sku ?? ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-gray-500 text-gray-900"
              placeholder="Ej: FRU-MAN-FUJI-01"
            />
          </div>
           <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              URL de la Imagen (Opcional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
               // *** CAMBIO: Añadido defaultValue (maneja null) ***
               defaultValue={product?.imageUrl ?? ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-gray-500 text-gray-900"
               placeholder="Ej: /images/producto.jpg"
            />
          </div>
       </div>


      {/* Campo Categoría */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          // *** CAMBIO: Añadido defaultValue (convertido a string) ***
          defaultValue={product?.categoryId?.toString() ?? ''}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
        >
          {/* Opción deshabilitada por defecto, solo si no estamos editando o no hay valor */}
          {!isEditing && <option value="" disabled>-- Selecciona una categoría --</option>}
          {/* Si estamos editando y no hay categoría, mostramos igual la opción disabled */}
          {isEditing && !product?.categoryId && <option value="" disabled>-- Selecciona una categoría --</option>}

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Botón de Envío */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
           {/* *** CAMBIO: Texto del botón dinámico *** */}
          {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
        </button>
      </div>

    </form>
  );
}