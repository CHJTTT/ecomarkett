// src/app/(public)/thank-you/page.tsx
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';

// Metadata para el título de la pestaña
export const metadata: Metadata = {
  title: 'Pedido Confirmado - EcoMarket',
};

export default function ThankYouPage() {
  return (
    // Contenedor principal para fondo y centrado vertical/horizontal
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center"> {/* Limita ancho y centra contenido */}
        {/* Tarjeta de Agradecimiento */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-5" /> {/* Aumentado margen inferior */}
          <h1 className="text-3xl font-bold text-white mb-4">¡Gracias por tu Compra!</h1>
          <p className="text-gray-300 mb-8"> {/* Aumentado margen inferior */}
            Tu pedido simulado ha sido recibido y está siendo procesado.
            {/* <br className="hidden sm:block" /> (Opcional: salto de línea en pantallas grandes) */}
            Agradecemos tu confianza en EcoMarket.
          </p>
          <Link
              href="/" // Enlace a la página principal
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800" // Añadido focus styles
          >
              Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}