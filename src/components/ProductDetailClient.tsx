// src/components/ProductDetailClient.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
// --- 1. Importar toast ---
import toast from 'react-hot-toast';


interface ProductDetailClientProps {
  id: number;
  name: string;
  description: string | null;
  price: string;
  originalPrice: number;
  imageUrl: string | null;
  categoryName?: string | null;
}

export default function ProductDetailClient({
  id,
  name,
  description,
  price,
  originalPrice,
  imageUrl,
  categoryName,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change: number) => {
     // ... (lógica sin cambios) ...
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id,
        name,
        price: originalPrice,
        imageUrl,
      },
      quantity
    );
    // --- 2. Usar toast.success ---
    // Reemplaza console.log o alert
    toast.success(`${quantity} x ${name} añadido al carrito.`);
  };

  // ... resto del componente sin cambios ...
   return (
        // Contenido de detalles...
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Columna Imagen */}
                <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-700 border border-gray-600 shadow-lg">
                    <Image
                        src={imageUrl || '/placeholder-image.png'}
                        alt={name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-opacity duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                {/* Columna Detalles */}
                <div className="flex flex-col space-y-4">
                    {categoryName && (
                        <p className="text-sm font-medium text-gray-400">{categoryName}</p>
                    )}
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">{name}</h1>
                    <p className="text-2xl lg:text-3xl font-semibold text-green-400">{price}</p>
                    {description ? (
                        <p className="text-base text-gray-300 leading-relaxed">{description}</p>
                    ) : (
                        <p className="text-base text-gray-500 italic">No hay descripción disponible.</p>
                    )}
                    {/* Selector Cantidad */}
                    <div className="flex items-center space-x-3 pt-4">
                         <label htmlFor={`quantity-${id}`} className="font-medium text-white text-sm">
                            Cantidad:
                        </label>
                        <div className="flex items-center border border-gray-600 rounded-md">
                           <button type="button" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="px-3 py-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors" aria-label="Disminuir cantidad">
                                <MinusIcon className="h-4 w-4" />
                           </button>
                           <input type="number" id={`quantity-${id}`} name="quantity" value={quantity} onChange={(e) => { const val = parseInt(e.target.value, 10); setQuantity(isNaN(val) || val < 1 ? 1 : val);}} min="1" className="w-12 border-x border-gray-600 bg-gray-800 text-white text-center font-medium focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none m-0" style={{ MozAppearance: 'textfield' }} aria-live="polite"/>
                           <button type="button" onClick={() => handleQuantityChange(1)} className="px-3 py-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors" aria-label="Aumentar cantidad">
                                <PlusIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    {/* Botón Añadir */}
                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleAddToCart} // Llama a la función actualizada
                            className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-md font-semibold shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors duration-200"
                        >
                             Añadir al Carrito ({formatPrice(originalPrice * quantity)})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}