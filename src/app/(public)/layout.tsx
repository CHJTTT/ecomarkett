// src/app/(public)/layout.tsx

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
// --- 1. Importar Toaster ---
import { Toaster } from 'react-hot-toast';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider> {/* Es bueno tener el provider fuera */}
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100"> {/* Fondo oscuro base */}
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            {/* --- 2. Añadir el componente Toaster --- */}
            {/* Puedes ajustar su posición con props si lo deseas */}
            <Toaster
                position="bottom-center" // Posición común
                toastOptions={{
                    // Estilos base para tema oscuro (opcional, puedes personalizar más)
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        // Icono y duración específicos para éxito
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981', // Color verde
                            secondary: '#fff',
                        },
                    },
                    error: {
                         // Icono y duración específicos para error
                         iconTheme: {
                            primary: '#EF4444', // Color rojo
                            secondary: '#fff',
                        },
                    }
                }}
            />
            <Footer />
        </div>
    </CartProvider>
  );
}