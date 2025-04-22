// src/app/admin/messages/page.tsx
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import DeleteMessageButton from './DeleteMessageButton'; // <-- 1. Importar el botón

export const metadata: Metadata = {
  title: 'Mensajes de Contacto - Admin EcoMarket',
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mensajes de Contacto</h1>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 border-b-2 border-gray-200">ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Nombre</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Mensaje</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Enviado el</th>
              {/* --- 2. Añadir cabecera Acciones --- */}
              <th className="px-5 py-3 border-b-2 border-gray-200 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {messages.length === 0 ? (
              <tr>
                 {/* --- 5. Ajustar colSpan --- */}
                <td colSpan={6} className="text-center py-10 px-5 border-b border-gray-200 text-gray-500">
                  No hay mensajes recibidos.
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">{message.id}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">{message.name}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">{message.email}</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm max-w-sm">
                    <p className="line-clamp-3" title={message.message}>
                        {message.message}
                    </p>
                  </td>
                   <td className="px-5 py-4 border-b border-gray-200 text-sm whitespace-nowrap">
                     {message.createdAt.toLocaleString('es-ES', { /* ... formato ... */ })}
                   </td>
                   {/* --- 4. Añadir celda con el botón --- */}
                   <td className="px-5 py-4 border-b border-gray-200 text-sm text-right whitespace-nowrap">
                       <DeleteMessageButton id={message.id} />
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