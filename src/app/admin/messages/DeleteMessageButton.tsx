// src/app/admin/messages/DeleteMessageButton.tsx
'use client';

import React, { useTransition } from 'react';
import { deleteMessage } from './actions'; // Importar la Server Action
import toast from 'react-hot-toast';

interface DeleteMessageButtonProps {
    id: number;
}

export default function DeleteMessageButton({ id }: DeleteMessageButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        // Pedir confirmación al usuario
        if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje? Esta acción no se puede deshacer.')) {
            startTransition(async () => {
                try {
                    const result = await deleteMessage(id);
                    if (result.success) {
                        toast.success(result.message);
                        // La revalidación en la acción debería actualizar la lista
                    } else {
                        toast.error(result.message);
                    }
                } catch (error) {
                    console.error("Error en la transición de eliminación:", error);
                    toast.error('Ocurrió un error al intentar eliminar el mensaje.');
                }
            });
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`font-medium transition-colors duration-200 ${
                isPending
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-red-600 hover:text-red-800'
            }`}
            aria-label={`Eliminar mensaje ${id}`}
        >
            {isPending ? 'Eliminando...' : 'Eliminar'}
        </button>
    );
}