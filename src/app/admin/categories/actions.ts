// src/app/admin/categories/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation'; // Importación eliminada o comentada (no se usa)

// Esquema de validación Zod (para Crear y Actualizar)
const CategorySchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
});

// Definir el tipo de estado esperado por useFormState
export interface CategoryFormState {
  message: string;
  errors?: {
    name?: string[];
    // Puedes añadir otros campos si tuvieras más inputs
  };
  success: boolean;
}

// --- Acción para Crear Categoría ---
export async function createCategory(
    prevState: CategoryFormState,
    formData: FormData
): Promise<CategoryFormState> {
    // 1. Validar los datos del formulario
    const validatedFields = CategorySchema.safeParse({
        name: formData.get('name'),
    });

    // 2. Si la validación falla, retornar errores
    if (!validatedFields.success) {
        console.log("Validation Errors:", validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error de validación. Por favor, corrige los campos.',
            success: false,
        };
    }

    const { name } = validatedFields.data;

    try {
        // 3. Intentar crear la categoría en la base de datos
        await prisma.category.create({
            data: {
                name: name,
            },
        });

        // 4. Si éxito: Revalidar caché y retornar estado de éxito
        revalidatePath('/admin/categories'); // Actualiza la lista de categorías
        return { message: 'Categoría creada con éxito.', success: true };

        // Alternativa con redirección (si prefieres no mostrar mensaje de éxito en el form)
        // revalidatePath('/admin/categories');
        // redirect('/admin/categories');

    } catch (error: unknown) {
        // 5. Manejar errores específicos (ej. nombre duplicado) u otros errores
        if (
            typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002' &&
            'meta' in error && typeof error.meta === 'object' && error.meta !== null && 'target' in error.meta &&
            Array.isArray(error.meta.target) && error.meta.target.includes('name')
        ) {
            console.error("Error: Nombre de categoría duplicado (P2002)");
            return { message: 'Ya existe una categoría con este nombre.', success: false, errors: { name: ['Este nombre ya está en uso.'] } };
        }

        if (error instanceof Error) {
            console.error("Error al crear categoría:", error);
            return { message: `Error al crear la categoría: ${error.message}`, success: false };
        }
        console.error("Error desconocido al crear categoría:", error);
        return { message: 'Ocurrió un error inesperado al crear la categoría.', success: false };
    }
}


// --- Acción para Actualizar Categoría ---
export async function updateCategory(
  id: number, // El ID viene del .bind() en el formulario
  prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> { // Asegurarse de que retorna el tipo de estado correcto

  // 1. Validar los datos del formulario con Zod
  const validatedFields = CategorySchema.safeParse({
    name: formData.get('name'),
  });

  // 2. Si la validación falla, retornar errores
  if (!validatedFields.success) {
    console.log("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrige los campos.',
      success: false,
    };
  }

  const { name } = validatedFields.data;

  try {
    // 3. Intentar actualizar la categoría en la base de datos
    await prisma.category.update({
      where: { id: id }, // Usar el ID pasado como argumento
      data: {
        name: name,
      },
    });

    // 4. Si éxito: Revalidar caché y retornar estado de éxito
    revalidatePath('/admin/categories'); // Actualiza la lista de categorías
    // Opcional: revalidar la propia página de edición si es necesario
    revalidatePath(`/admin/categories/${id}/edit`); // Revalida la pág. de edición actual

    return { message: 'Categoría actualizada con éxito.', success: true };

    // Alternativa: Redirigir a la lista después de éxito
    // revalidatePath('/admin/categories');
    // redirect('/admin/categories'); // Si rediriges, el estado de éxito no se usará para el toast en el formulario

  } catch (error: unknown) {
    // 5. Manejar errores específicos (ej. nombre duplicado) u otros errores
    // Verificar si es un error de Prisma (P2002 - Unique constraint failed) de forma más segura
    if (
        typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002' &&
        'meta' in error && typeof error.meta === 'object' && error.meta !== null && 'target' in error.meta &&
        Array.isArray(error.meta.target) && error.meta.target.includes('name')
       ) {
          console.error("Error: Nombre de categoría duplicado (P2002)");
          return { message: 'Ya existe una categoría con este nombre.', success: false, errors: { name: ['Este nombre ya está en uso.'] } };
    }

    // Manejar otros errores generales
    if (error instanceof Error) {
      console.error("Error al actualizar categoría:", error);
      return { message: `Error al actualizar la categoría: ${error.message}`, success: false };
    }

    // Error desconocido
    console.error("Error desconocido al actualizar categoría:", error);
    return { message: 'Ocurrió un error inesperado al actualizar la categoría.', success: false };
  }
}


// --- Acción para Eliminar Categoría ---
export async function deleteCategory(id: number) {
    if (!id) {
        throw new Error('Se requiere ID para eliminar la categoría.');
    }
    try {
        // Primero, verificar si hay productos asociados a esta categoría
        const productsInCategory = await prisma.product.count({
            where: { categoryId: id },
        });

        if (productsInCategory > 0) {
            // Si hay productos, no permitir eliminar y lanzar un error específico
             console.warn(`Intento de eliminar categoría ${id} con ${productsInCategory} productos asociados.`);
            return { success: false, message: `No se puede eliminar la categoría porque tiene ${productsInCategory} producto(s) asociado(s).` };
            // Alternativamente, podrías lanzar un error si prefieres manejarlo diferente en el cliente
            // throw new Error(`No se puede eliminar la categoría porque tiene ${productsInCategory} producto(s) asociado(s).`);
        }

        // Si no hay productos, proceder a eliminar la categoría
        await prisma.category.delete({
            where: { id },
        });
        revalidatePath('/admin/categories'); // Revalidar la página de lista
        console.log(`Categoría con ID ${id} eliminada.`);
        return { success: true, message: 'Categoría eliminada con éxito.' };

    } catch (error: unknown) {
         // Manejo genérico por si ocurre otro error inesperado durante la eliminación
        if (error instanceof Error) {
             console.error(`Error al eliminar categoría ${id}:`, error);
            return { success: false, message: `Error al eliminar la categoría: ${error.message}` };
        }
        console.error(`Error desconocido al eliminar categoría ${id}:`, error);
        return { success: false, message: 'Ocurrió un error inesperado al eliminar la categoría.' };
    }
}