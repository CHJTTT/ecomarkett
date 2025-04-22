// src/components/Footer.tsx
import React from 'react';
// import Link from 'next/link'; // Comentamos la importación ya que Link no se usa en el código activo

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Obtiene el año actual dinámicamente

  return (
    // Contenedor principal del footer
    <footer className="bg-gray-800 text-gray-300 mt-12"> {/* Fondo oscuro, texto gris claro, margen superior */}
      {/* Contenedor interno para centrar y padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6"> {/* Padding vertical */}

        {/* Sección superior con enlaces (opcional) */}
        {/*
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
          <div>
            <h4 className="font-semibold text-white mb-2">Tienda</h4>
            <ul>
              // Si descomentas esto, necesitarás descomentar la importación de Link arriba
              // <li><Link href="/#products" className="hover:text-green-400 transition duration-200">Productos</Link></li>
              // <li><Link href="/categories" className="hover:text-green-400 transition duration-200">Categorías</Link></li>
              // <li><Link href="/offers" className="hover:text-green-400 transition duration-200">Ofertas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Ayuda</h4>
            <ul>
              // <li><Link href="/contact" className="hover:text-green-400 transition duration-200">Contacto</Link></li>
              // <li><Link href="/faq" className="hover:text-green-400 transition duration-200">Preguntas Frecuentes</Link></li>
              // <li><Link href="/shipping" className="hover:text-green-400 transition duration-200">Envíos</Link></li>
            </ul>
          </div>
           // ... más columnas de enlaces si quieres ...
        </div>
        */}

        {/* Línea divisoria (opcional, si usas la sección de enlaces) */}
        {/* <div className="border-t border-gray-700 mb-6"></div> */}

        {/* Sección inferior con copyright */}
        <div className="text-center text-sm">
          <p>
            © {currentYear} EcoMarket. Todos los derechos reservados.
          </p>
          {/* Opcional: Enlace a política de privacidad o términos */}
          {/*
          <p className="mt-1">
            // Si descomentas esto, necesitarás descomentar la importación de Link arriba
            // <Link href="/privacy" className="hover:text-green-400 transition duration-200">Política de Privacidad</Link>
            // <span className="mx-2">|</span>
            // <Link href="/terms" className="hover:text-green-400 transition duration-200">Términos de Servicio</Link>
          </p>
          */}
           {/* Opcional: Puedes añadir iconos de redes sociales aquí */}
        </div>
      </div>
    </footer>
  );
}