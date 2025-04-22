// src/components/FeaturedCategories.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@prisma/client';

interface FeaturedCategoriesProps {
  categories: Category[];
}

const categoryImagePlaceholders: { [key: string]: string } = {
  'Frutas Orgánicas': '/images/placeholder-fruits.jpg',
  'Verduras Orgánicas': '/images/placeholder-vegetables.jpg',
  'Despensa Orgánica': '/images/placeholder-pantry.jpg',
};
const defaultCategoryImage = '/images/placeholder-image.png';

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const featured = categories.slice(0, 3);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-12 mb-12">
      <h2 className="text-3xl font-bold text-center text-white mb-8">
        Explora Nuestras Categorías
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((category) => {
          const categoryLink = `/?category=${encodeURIComponent(category.name)}`;
          const imageUrl = categoryImagePlaceholders[category.name] || defaultCategoryImage;

          return (
            <Link
              key={category.id}
              href={categoryLink}
              className="group block relative overflow-hidden rounded-lg shadow-md hover:shadow-xl border border-gray-700 hover:border-green-600 transition-all duration-300 ease-in-out"
            >
              {/* Contenedor de Imagen */}
              <div className="relative w-full aspect-video bg-gray-700">
                <Image
                  src={imageUrl}
                  alt={`Imagen de ${category.name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  priority={true}
                />
                {/* --- Overlay Comentado ---*/}
                {/*
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
                */}
                 {/* --- Fin Overlay Comentado ---*/}
              </div>

              {/* Nombre de la Categoría */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                 <h3 className="text-xl md:text-2xl font-semibold text-white text-center shadow-text">
                    {category.name}
                 </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Estilo para shadow-text (en globals.css si no lo tienes)
/*
@layer utilities {
  .shadow-text {
    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.7);
  }
}
*/