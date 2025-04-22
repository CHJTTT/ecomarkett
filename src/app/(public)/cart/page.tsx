// src/app/(public)/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    updateQuantity,
    getTotal,
    // getItemCount, // No lo usamos directamente aquí, pero podrías necesitarlo
  } = useCart(); // Se eliminó getCartCount

  const handleRemove = (productId: number) => {
    removeFromCart(productId);
    toast.success('Producto eliminado del carrito');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Carrito vaciado');
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    // Permitir bajar hasta 0 para eliminar, o usar >= 1 si prefieres que el botón - no elimine
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    } else {
      // Si la nueva cantidad es 0 o menos, eliminar el item
      handleRemove(productId);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Tu Carrito</h1>

      {/* --- Condición de Carrito Vacío --- */}
      {cartItems.length === 0 ? (
        // --- Estado Carrito Vacío Mejorado ---
        <div className="text-center py-16 px-6 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Tu carrito está vacío.</h2>
          <p className="text-gray-400 mb-6">
            Parece que aún no has añadido ningún producto. ¡Explora nuestro catálogo!
          </p>
          <Link
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded transition duration-300"
          >
            Ver Productos
          </Link>
        </div>
      ) : (
        // --- Layout Principal (Items + Resumen) ---
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Columna Izquierda: Items del Carrito */}
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items en tu carrito de compra
            </h2>

            <ul role="list" className="divide-y divide-gray-700 border-b border-t border-gray-700">
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-6 sm:py-8"> {/* Padding vertical por item */}
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    <Image
                      // Usa una imagen placeholder si imageUrl es null o undefined
                      src={item.imageUrl || '/images/placeholder.png'} // Asegúrate que la ruta al placeholder sea correcta
                      alt={item.name}
                      width={100} // Ajusta tamaño según necesites
                      height={100}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32 border border-gray-700 bg-gray-700" // Fondo por si la imagen falla
                      priority={false} // No prioritarias en el carrito usualmente
                    />
                  </div>

                  {/* Detalles del Producto */}
                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      {/* Nombre y Precio Unitario */}
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-white hover:text-gray-300">
                            <Link href={`/products/${item.id}`}>{item.name}</Link>
                          </h3>
                        </div>
                         {/* Mostrar precio unitario si es útil */}
                         <p className="mt-1 text-sm text-gray-400">
                            {typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'} € / unidad
                          </p>
                      </div>

                      {/* Selector Cantidad y Precio Total Item */}
                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="flex items-center justify-between">
                             {/* Precio Total Item */}
                             <p className="text-base font-medium text-white">
                                {typeof item.price === 'number' ? (item.price * item.quantity).toFixed(2) : 'N/A'} €
                             </p>
                              {/* Selector de Cantidad */}
                              <div className="flex items-center rounded border border-gray-600">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 rounded-l"
                                  // No deshabilitar si queremos que al pulsar en 1 se elimine
                                  // disabled={item.quantity <= 1}
                                >
                                  <span className="sr-only">Quitar uno</span>
                                  <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <span className="px-3 py-1 text-sm font-medium text-white border-x border-gray-600">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-r"
                                >
                                  <span className="sr-only">Añadir uno</span>
                                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                              </div>
                        </div>
                         {/* Botón Eliminar (ahora debajo del total del item) */}
                         <div className="mt-3 text-right">
                           <button
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              className="inline-flex items-center text-sm font-medium text-red-500 hover:text-red-400"
                            >
                              <TrashIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
                              <span>Eliminar</span>
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
             {/* Botón Vaciar Carrito (movido aquí) */}
              <div className="mt-6 text-right">
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Vaciar Carrito
                </button>
              </div>
          </section>

          {/* Columna Derecha: Resumen del Pedido */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-800 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 shadow-md" // Estilos de tarjeta
          >
            <h2 id="summary-heading" className="text-lg font-medium text-white">
              Resumen del Pedido
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-400">Subtotal</dt>
                {/* Asegurarse que getTotal() devuelve number */}
                <dd className="text-sm font-medium text-white">{typeof getTotal() === 'number' ? getTotal().toFixed(2) : 'N/A'} €</dd>
              </div>
              {/* Gastos de envío (ejemplo) */}
              {/* <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                <dt className="flex items-center text-sm text-gray-400">
                  <span>Gastos de envío</span>
                </dt>
                <dd className="text-sm font-medium text-white">0.00 €</dd>
              </div> */}
              <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                <dt className="text-base font-medium text-white">Total</dt>
                <dd className="text-base font-medium text-white">{typeof getTotal() === 'number' ? getTotal().toFixed(2) : 'N/A'} €</dd>
              </div>
            </dl>

            <div className="mt-8">
              <Link
                href="/checkout"
                className="w-full block text-center bg-green-600 hover:bg-green-700 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300"
              >
                Proceder al Pago
              </Link>
            </div>
            <div className="mt-4 text-center text-sm">
                <Link href="/" className="font-medium text-indigo-400 hover:text-indigo-300">
                    o Continuar Comprando
                    <span aria-hidden="true"> →</span>
                </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}