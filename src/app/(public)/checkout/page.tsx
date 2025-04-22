// src/app/(public)/checkout/page.tsx
'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // Usaremos toast para la confirmación (opcional)

// Asumiendo que tienes o crearás esta utilidad, o puedes usar toFixed(2) directamente
// import { formatPrice } from '@/lib/utils';
// Alternativa simple si no tienes formatPrice:
const formatPrice = (price: number | undefined | null): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'N/A'; // O '0.00 €' o como prefieras manejar precios inválidos
  }
  return price.toFixed(2) + ' €';
};


export default function CheckoutPage() {
  const { cartItems, getTotal, clearCart } = useCart();
  const total = getTotal();
  const router = useRouter();

  // --- Estado Carrito Vacío (mismo estilo que en /cart) ---
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center py-16 px-6 bg-gray-800 rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-semibold text-gray-300 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-400 mb-6">
            No puedes finalizar la compra sin productos en el carrito.
          </p>
          <Link
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded transition duration-300"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  // --- Lógica de Confirmación ---
  const handleConfirmOrder = () => {
    console.log('Pedido confirmado (simulación):', cartItems);
    console.log('Total:', formatPrice(total));
    toast.success('¡Gracias por tu compra! (Simulación)'); // Notificación

    clearCart(); // Limpiar el carrito
    router.push('/thank-you'); // Redirigir
  };

  // --- Renderizado Principal del Checkout ---
  return (
    <div className="bg-gray-900 min-h-screen py-12 text-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-10 text-center">Finalizar Compra</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          {/* Columna Izquierda: Formularios (Placeholders) */}
          <div className="lg:col-span-7 mb-10 lg:mb-0">
             <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 space-y-8">

                {/* Sección Contacto (Placeholder) */}
                <section>
                    <h2 className="text-lg font-medium text-white border-b border-gray-700 pb-2 mb-4">Información de Contacto</h2>
                    <p className="text-sm text-gray-400">
                        (Aquí iría un formulario para el email o para iniciar sesión)
                    </p>
                    {/* Ejemplo visual de campo (opcional) */}
                    <div className="mt-4 h-10 w-full rounded border border-gray-600 bg-gray-700 flex items-center px-3">
                         <span className="text-sm text-gray-500">Email (placeholder)...</span>
                    </div>
                </section>

                {/* Sección Envío (Placeholder) */}
                <section>
                    <h2 className="text-lg font-medium text-white border-b border-gray-700 pb-2 mb-4">Dirección de Envío</h2>
                    <p className="text-sm text-gray-400">
                        (Aquí iría un formulario completo para la dirección: nombre, calle, ciudad, CP, país...)
                    </p>
                     {/* Ejemplo visual de campo (opcional) */}
                     <div className="mt-4 space-y-3">
                         <div className="h-10 w-full rounded border border-gray-600 bg-gray-700 flex items-center px-3"><span className="text-sm text-gray-500">Nombre completo...</span></div>
                         <div className="h-10 w-full rounded border border-gray-600 bg-gray-700 flex items-center px-3"><span className="text-sm text-gray-500">Dirección...</span></div>
                         {/* ... más campos placeholder */}
                     </div>
                </section>

                {/* Sección Pago (Placeholder) */}
                <section>
                    <h2 className="text-lg font-medium text-white border-b border-gray-700 pb-2 mb-4">Método de Pago</h2>
                    <p className="text-sm text-gray-400">
                        (Aquí iría la selección de método de pago: tarjeta, PayPal, etc., con sus respectivos campos)
                    </p>
                     {/* Ejemplo visual de campo (opcional) */}
                     <div className="mt-4 h-10 w-full rounded border border-gray-600 bg-gray-700 flex items-center px-3">
                        <span className="text-sm text-gray-500">Número de tarjeta (placeholder)...</span>
                     </div>
                </section>
             </div>
          </div>

          {/* Columna Derecha: Resumen del Pedido */}
          <div className="lg:col-span-5">
             <section
                aria-labelledby="summary-heading"
                className="rounded-lg bg-gray-800 px-4 py-6 sm:p-6 lg:p-8 shadow-md border border-gray-700" // Mismo estilo que en /cart
             >
                <h2 id="summary-heading" className="text-lg font-medium text-white">
                Resumen del Pedido
                </h2>

                {/* Lista de Items (opcional, se puede simplificar) */}
                <ul role="list" className="mt-6 divide-y divide-gray-700 text-sm">
                    {cartItems.map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-3">
                            <span className="text-gray-300">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                            <span className="font-medium text-white">{formatPrice(item.price * item.quantity)}</span>
                        </li>
                    ))}
                </ul>


                {/* Totales */}
                <dl className="mt-6 space-y-4 border-t border-gray-700 pt-6">
                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-400">Subtotal</dt>
                    <dd className="text-sm font-medium text-white">{formatPrice(total)}</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-400">Envío (Estimado)</dt>
                    <dd className="text-sm font-medium text-white">{formatPrice(0)}</dd> {/* Placeholder */}
                </div>
                <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                    <dt className="text-base font-medium text-white">Total</dt>
                    <dd className="text-base font-medium text-white">{formatPrice(total)}</dd>
                </div>
                </dl>

                {/* Botón Confirmar */}
                <div className="mt-8">
                    <button
                      type="button" // Importante: type="button" si no está en un <form>
                      onClick={handleConfirmOrder}
                      className="w-full bg-green-600 hover:bg-green-700 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300"
                    >
                      Confirmar Pedido (Simulación)
                    </button>
                </div>
             </section>
          </div>

        </div>
      </div>
    </div>
  );
}