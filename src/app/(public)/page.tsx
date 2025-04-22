// src/app/(public)/page.tsx

import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
// Asegúrate de que las rutas de importación sean correctas para tu estructura
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import PaginationControls from '@/components/PaginationControls';
import FeaturedCategories from '@/components/FeaturedCategories'; // Tu componente
import type { Prisma, Product, Category } from '@prisma/client';
import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react'; // <-- Importar Suspense

// --- Metadata para la página ---
export const metadata: Metadata = {
  title: 'EcoMarket - Productos Orgánicos Frescos',
  description: 'Encuentra la mejor selección de productos orgánicos en EcoMarket.',
};

const ITEMS_PER_PAGE = 8; // Asegúrate de que este sea el número correcto que quieres

// --- Interfaz para el tipo de producto extendido ---
type ProductWithCategory = Product & {
  category: Category | null;
};

// --- Interfaz para las props de la página ---
interface HomePageProps {
  searchParams?: {
    search?: string;
    category?: string;
    page?: string;
  };
}

// --- [NUEVO] Componente Skeleton para el fallback de Suspense ---
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
        <div key={index} className="border border-neutral-700 rounded-lg p-4 bg-neutral-800">
          <div className="w-full h-48 bg-neutral-600 rounded mb-4"></div> {/* Imagen */}
          <div className="h-6 bg-neutral-600 rounded mb-2 w-3/4"></div>   {/* Nombre */}
          <div className="h-4 bg-neutral-600 rounded mb-4 w-1/2"></div>   {/* Precio */}
          <div className="h-10 bg-neutral-600 rounded w-full"></div>      {/* Botón */}
        </div>
      ))}
    </div>
  );
}

// --- [NUEVO] Componente Asíncrono para la Cuadrícula de Productos y Paginación ---
async function ProductGrid({
  searchTerm,
  selectedCategoryName,
  currentPage, // Usaremos currentPage validado (validPage desde HomePage)
}: {
  searchTerm: string;
  selectedCategoryName: string;
  currentPage: number; // Recibe la página validada
}) {
  // Validar la página aquí también por si acaso
  const validPage = Math.max(1, currentPage);
  const take = ITEMS_PER_PAGE;
  const skip = (validPage - 1) * ITEMS_PER_PAGE;

  // Construcción de la cláusula WHERE
  const whereCondition: Prisma.ProductWhereInput = {
     published: true  
  };
  if (searchTerm) {
    // Búsqueda solo en el nombre (o ajusta si buscas en descripción también)
    whereCondition.name = { contains: searchTerm, mode: 'insensitive' };
    // Ejemplo búsqueda en nombre Y descripción:
    // whereCondition.OR = [
    //   { name: { contains: searchTerm, mode: 'insensitive' } },
    //   { description: { contains: searchTerm, mode: 'insensitive' } },
    // ];
  }
  if (selectedCategoryName) {
    // Filtrar por nombre de categoría
    whereCondition.category = { name: selectedCategoryName };
  }

  // Obtener productos y el conteo total en paralelo
  const productsPromise = prisma.product.findMany({
    where: whereCondition,
    include: { category: true }, // Incluir categoría
    orderBy: { createdAt: 'desc' },
    take: take,
    skip: skip,
  });
  const totalProductsPromise = prisma.product.count({ where: whereCondition });

  // Esperar ambas promesas
  const [products, totalProducts] = await Promise.all([
    productsPromise,
    totalProductsPromise,
  ]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div> {/* Contenedor para productos y paginación */}
      {products.length === 0 ? (
        // Mensaje "No encontrado"
        <div className="text-center py-10 px-6 bg-gray-800 rounded-lg shadow-md my-8">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">No se encontraron productos</h2>
          <p className="text-gray-400">
            {totalProducts > 0 // Mensaje diferente si hay productos en otras páginas
              ? `No hay productos en la página ${validPage} que coincidan con tu búsqueda. Intenta en otra página o ajusta los filtros.`
              : `No hay productos que coincidan ${searchTerm ? `con '${searchTerm}'` : ''} ${selectedCategoryName ? `en la categoría '${selectedCategoryName}'` : ''}. Intenta ajustar tu búsqueda o filtros.`
            }
          </p>
        </div>
      ) : (
        // Cuadrícula de productos
        <div id="products" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {/* Usando tu tipo ProductWithCategory */}
          {(products as ProductWithCategory[]).map((product) => {
            const numericPrice = product.price.toNumber();
            const formattedPrice = formatPrice(numericPrice);
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={formattedPrice}
                // Asegúrate que esta ruta sea correcta en tu carpeta public
                imageUrl={product.imageUrl || '/images/placeholder-image.png'}
                originalPrice={numericPrice}
                categoryName={product.category?.name ?? null}
              />
            );
          })}
        </div>
      )}

      {/* Controles de paginación (solo si hay más de una página) */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={validPage} // Pasar la página validada
          totalPages={totalPages}
          // Pasa los searchParams actuales para que los enlaces de paginación los conserven
          // Asegúrate de que tu componente PaginationControls acepte y use esta prop
          searchParams={{ search: searchTerm, category: selectedCategoryName }}
        />
      )}
    </div>
  );
}


// --- Componente Principal de la Página ---
export default async function HomePage({ searchParams }: HomePageProps) {
  // Extraer parámetros de forma segura ANTES de pasarlos
  const searchTerm = searchParams?.search ?? '';
  const selectedCategoryName = searchParams?.category ?? '';
  const currentPageRaw = parseInt(searchParams?.page ?? '1', 10);
  // Validar la página aquí ANTES de pasarla a ProductGrid
  const validPage = Math.max(1, currentPageRaw);

  // Obtener categorías para los filtros (fuera de Suspense, carga rápida)
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <>
      {/* Sección Hero */}
      <section className="text-center bg-gradient-to-r from-gray-800 to-gray-700 text-white py-16 px-6 mb-12 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Bienvenido a EcoMarket
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Tu tienda online de confianza para productos orgánicos frescos y de calidad, directamente a tu puerta.
          </p>
          <Link
             // Asegúrate que 'Verduras Orgánicas' exista y esté codificado si es necesario
             href="/?category=Verduras%20Org%C3%A1nicas"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Descubre Nuestras Verduras
          </Link>
        </div>
      </section>

      {/* Contenedor principal */}
      <div className="container mx-auto px-4 pb-12">

        {/* Renderizar Categorías Destacadas (si no hay filtros activos) */}
        {!selectedCategoryName && !searchTerm && (
            <FeaturedCategories categories={categories} />
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="mb-8"> {/* Contenedor simple para filtros/búsqueda */}
            {/* Asegúrate de que SearchBar acepte y use initialValue */}
            <SearchBar initialValue={searchTerm}/>
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategoryName}
            />
        </div>

        {/* Suspense para la cuadrícula de productos */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid
            searchTerm={searchTerm}
            selectedCategoryName={selectedCategoryName}
            currentPage={validPage} // Pasar la página ya validada
          />
        </Suspense>

      </div>
    </>
  );
}