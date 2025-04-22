// src/app/(public)/contact/page.tsx
import ContactForm from './ContactForm';
import { Metadata } from 'next'; // Importar Metadata

// Añadir Metadata para el título de la pestaña
export const metadata: Metadata = {
  title: 'Contacto - EcoMarket',
  description: 'Ponte en contacto con EcoMarket.',
};

export default function ContactPage() {
  return (
    // Aplicar fondo oscuro, padding y altura mínima
    <main className="bg-gray-900 min-h-screen px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        {/* Ajustar colores de texto para tema oscuro */}
        <h1 className="text-4xl font-bold text-center mb-6 text-white">
          Contáctanos
        </h1>
        <p className="text-lg text-gray-300 text-center mb-10">
          ¿Tienes alguna pregunta, sugerencia o comentario? Nos encantaría escucharte.
          Rellena el siguiente formulario y nos pondremos en contacto contigo lo antes posible.
        </p>

        {/* El formulario se renderiza aquí */}
        <ContactForm />

      </div>
    </main>
  );
}