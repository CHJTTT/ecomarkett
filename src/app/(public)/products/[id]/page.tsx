// src/app/(public)/products/[id]/page.tsx
// NO debe tener "use client";

import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
// --- CORRECCIÓN: Eliminar 'Prisma,' si no se usa ---
import type { Product, Category } from '@prisma/client'; // Solo importar Product y Category si Prisma no se usa
// --- FIN CORRECCIÓN ---
import { formatPrice } from '@/lib/utils';

// --- Importamos nuestro componente Cliente ---
import ProductDetailClient from '@/components/ProductDetailClient';

// Interfaz de props que recibe la página (params)
interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

// Tipo para el producto con categoría incluida
type ProductWithCategory = Product & {
    category: Category | null;
};

// La función de la página sigue siendo async para obtener los datos del producto
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = parseInt(params.id, 10);

  if (isNaN(productId)) {
    console.error(`Invalid product ID received: ${params.id}`);
    notFound();
  }

  let product: ProductWithCategory | null = null;

  try {
    product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const numericPrice = product.price.toNumber();
  const formattedPrice = formatPrice(numericPrice);

  return (
    <ProductDetailClient
      id={product.id}
      name={product.name}
      description={product.description}
      price={formattedPrice}
      originalPrice={numericPrice}
      imageUrl={product.imageUrl}
      categoryName={product.category?.name ?? null}
    />
  );
}