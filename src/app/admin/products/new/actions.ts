'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- Acción para Guardar (Crear o Actualizar) Producto ---
export async function saveProductAction(formData: FormData) {
  // 1. Extraer datos del FormData
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceStr = formData.get('price') as string;
  const sku = formData.get('sku') as string;
  const imageUrl = formData.get('imageUrl') as string || null;
  const stockStr = formData.get('stock') as string;
  const categoryIdStr = formData.get('categoryId') as string;
  const productIdStr = formData.get('productId') as string | null;

  // 2. Validación y Conversión
  if (!name || !description || !priceStr || !sku || !stockStr || !categoryIdStr) {
    console.error("Validation Error: Missing fields");
    throw new Error("Datos del formulario inválidos o incompletos. Todos los campos excepto URL de imagen son requeridos.");
  }

  const price = parseFloat(priceStr);
  const stock = parseInt(stockStr, 10);
  const categoryId = parseInt(categoryIdStr, 10);
  const productId = productIdStr ? parseInt(productIdStr, 10) : null;

  if (isNaN(price) || isNaN(stock) || isNaN(categoryId) || (productIdStr && isNaN(productId!))) {
      console.error("Validation Error: Invalid number format", { priceStr, stockStr, categoryIdStr, productIdStr });
      throw new Error("Formato de número inválido para Precio, Stock, Categoría o ID de Producto.");
  }
  if (price <= 0 || stock < 0) {
      console.error("Validation Error: Invalid number range", { price, stock });
      throw new Error("El precio debe ser positivo y el stock no puede ser negativo.");
  }

  const productData = {
    name,
    description,
    price,
    sku,
    imageUrl: imageUrl === "" ? null : imageUrl,
    stock,
    categoryId,
  };

  // 3. Decidir si Crear o Actualizar y ejecutar Prisma
  try {
    if (productId) {
      // --- UPDATE ---
      console.log(`Attempting to update product ID: ${productId} with data:`, productData);
      await prisma.product.update({
        where: { id: productId },
        data: productData,
      });
      console.log(`Product ID: ${productId} updated successfully!`);
    } else {
      // --- CREATE ---
      console.log("Attempting to create product with data:", productData);
      await prisma.product.create({
        data: productData,
      });
      console.log("Product created successfully!");
    }
  } catch (error: unknown) {
    console.error("Error saving product:", error);
    let errorMessage = 'Ocurrió un error desconocido al guardar el producto.';
    if (typeof error === 'object' && error !== null) {
        const prismaError = error as { code?: string; meta?: { target?: string[], field_name?: string, cause?: string }; message?: string };
        if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('sku')) {
            errorMessage = "Error: Ya existe un producto con ese SKU.";
        } else if (prismaError.code === 'P2003' && prismaError.meta?.field_name?.includes('categoryId')) {
            errorMessage = "Error: La categoría seleccionada no es válida.";
        } else if (prismaError.code === 'P2025') {
             errorMessage = `Error al actualizar: No se encontró el producto con ID ${productId}.`;
        } else if (prismaError.message) {
            errorMessage = `Ocurrió un error al guardar el producto: ${prismaError.message}`;
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }

  // 4. Revalidar y Redirigir
  revalidatePath('/admin/products');
  if (productId) { // Solo revalidar la página de edición si estamos editando
      revalidatePath(`/admin/products/${productId}/edit`);
  }
  redirect('/admin/products');
}


// *** NUEVA FUNCIÓN AÑADIDA AQUÍ ***
// --- Acción para Borrar Producto ---
export async function deleteProductAction(formData: FormData) {
  // 1. Extraer el ID del producto a borrar
  const productIdStr = formData.get('productId') as string | null;

  // 2. Validación y Conversión
  if (!productIdStr) {
    throw new Error("No se proporcionó ID de producto para borrar.");
  }
  const productId = parseInt(productIdStr, 10);
  if (isNaN(productId)) {
    throw new Error("ID de producto inválido para borrar.");
  }

  // 3. Intentar borrar el producto usando Prisma
  try {
    console.log(`Attempting to delete product ID: ${productId}`);
    await prisma.product.delete({
      where: { id: productId },
    });
    console.log(`Product ID: ${productId} deleted successfully!`);
  } catch (error: unknown) {
    console.error(`Error deleting product ID: ${productId}`, error);
    let errorMessage = 'Ocurrió un error desconocido al borrar el producto.';
    if (typeof error === 'object' && error !== null) {
        const prismaError = error as { code?: string; message?: string };
        // Error P2025: El registro a borrar no existe
        if (prismaError.code === 'P2025') {
             errorMessage = `Error al borrar: No se encontró el producto con ID ${productId}.`;
        } else if (prismaError.message) {
             errorMessage = `Ocurrió un error al borrar el producto: ${prismaError.message}`;
        }
    } else if (error instanceof Error) {
         errorMessage = error.message;
    }
    // En lugar de lanzar el error (que mostraría la página de error de Next),
    // podríamos simplemente loguearlo y continuar, o devolver un mensaje.
    // Por ahora, lo lanzaremos para ver si ocurre.
    // En una app real, quizás solo revalidarías y mostrarías un toast/mensaje.
    throw new Error(errorMessage);
  }

  // 4. Revalidar la ruta de la tabla para que se actualice
  revalidatePath('/admin/products');
  // No es estrictamente necesario redirigir, la revalidación actualizará la tabla.
  // redirect('/admin/products'); // Opcional: Descomentar si quieres forzar recarga completa
}