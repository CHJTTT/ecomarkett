// src/app/admin/messages/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Definir un tipo simple para la respuesta de la acción
interface DeleteMessageResponse {
    success: boolean;
    message: string;
}

export async function deleteMessage(id: number): Promise<DeleteMessageResponse> {
    if (!id || typeof id !== 'number') {
        return { success: false, message: 'ID de mensaje inválido.' };
    }

    try {
        // Intentar eliminar el mensaje de la base de datos
        await prisma.contactMessage.delete({
            where: { id: id },
        });

        // Revalidar la ruta para que la lista se actualice
        revalidatePath('/admin/messages');

        console.log(`Mensaje con ID ${id} eliminado.`);
        return { success: true, message: 'Mensaje eliminado con éxito.' };

    } catch (error: unknown) {
        // --- INICIO CORRECCIÓN ---
        // Verificar de forma segura si es el error P2025 de Prisma
        // (Registro a eliminar no encontrado)
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error && // Comprueba si la propiedad 'code' existe
            error.code === 'P2025' // Comprueba el valor del código
        ) {
            console.warn(`Intento de eliminar mensaje con ID ${id} que no fue encontrado (P2025).`);
            return { success: false, message: 'Error: El mensaje no fue encontrado (puede que ya haya sido eliminado).' };
        }
        // --- FIN CORRECCIÓN ---

        // Manejar otros errores generales que sí son instancias de Error
        if (error instanceof Error) {
             console.error(`Error al eliminar mensaje ${id}:`, error);
            return { success: false, message: `Error al eliminar el mensaje: ${error.message}` };
        }

        // Manejar errores desconocidos (no son instancias de Error)
        console.error(`Error desconocido al eliminar mensaje ${id}:`, error);
        return { success: false, message: 'Ocurrió un error inesperado al eliminar el mensaje.' };
    }
}