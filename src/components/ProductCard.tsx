// src/components/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  id: number;
  name: string;
  price: string; // Formatted price string (e.g., "2,50 €")
  originalPrice: number; // Unformatted price for adding to cart
  imageUrl: string | null;
  categoryName?: string | null;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  categoryName,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price: originalPrice,
      imageUrl,
    });
    toast.success(`${name} añadido al carrito!`);
  };

  return (
    // Contenedor principal con hover:shadow-xl
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-md hover:shadow-xl hover:border-green-600 transition-all duration-300 ease-in-out">

      {/* Imagen - VOLVEMOS A LA ESTRUCTURA CON h-56 */}
      <Link href={`/products/${id}`} className="block">
          {/* Contenedor con altura fija y fondo */}
          <div className="relative w-full h-56 bg-gray-700 overflow-hidden"> {/* Altura fija h-56 y overflow-hidden */}
              <Image
                  // Volvemos al placeholder original por si acaso
                  src={imageUrl || '/placeholder-image.png'}
                  alt={name}
                  fill // fill sigue funcionando con contenedor relativo y dimensiones fijas
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300 ease-in-out" // Efecto zoom
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
              />
          </div>
      </Link>

      {/* Detalles (sin cambios) */}
      <div className="p-4 flex flex-col flex-grow bg-gray-800">
        {categoryName && (
            <p className="text-xs font-medium text-gray-400 mb-1">{categoryName}</p>
        )}
        <h3 className="text-base font-semibold text-white mb-2 min-h-[3rem] line-clamp-2">
            <Link href={`/products/${id}`} className="hover:text-green-400 transition-colors duration-200">
                {name}
            </Link>
        </h3>
        <p className="text-lg font-bold text-green-400 mb-4">{price}</p>
        <div className="mt-auto">
            <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors duration-200"
            >
                Añadir al Carrito
            </button>
        </div>
      </div>
    </div>
  );
}