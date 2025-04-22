// src/app/(public)/contact/ContactForm.tsx
import { submitContactAction } from './actions';
// Importaremos el botón de envío con estado pendiente
import SubmitContactButton from './SubmitContactButton';

export default function ContactForm() {
  return (
    // Cambiar estilos del formulario: fondo oscuro, borde oscuro, sombra más sutil si es necesario
    <form
      action={submitContactAction}
      className="space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700" // Estilos de tarjeta oscura
    >
      {/* Campo Nombre */}
      <div>
        {/* Cambiar color del label */}
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Nombre Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="Tu nombre" // Añadir placeholder
          // Cambiar estilos del input: fondo, borde, texto, foco
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white placeholder-gray-400"
        />
      </div>

      {/* Campo Email */}
      <div>
        {/* Cambiar color del label */}
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          placeholder="tu@email.com" // Añadir placeholder
          // Cambiar estilos del input
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white placeholder-gray-400"
        />
      </div>

      {/* Campo Asunto (Opcional) */}
      <div>
        {/* Cambiar color del label */}
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
          Asunto <span className="text-xs text-gray-500">(Opcional)</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="Motivo de tu consulta" // Añadir placeholder
          // Cambiar estilos del input
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white placeholder-gray-400"
        />
      </div>

      {/* Campo Mensaje */}
      <div>
        {/* Cambiar color del label */}
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Escribe aquí tu mensaje..." // Añadir placeholder
          // Cambiar estilos del textarea
          className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white placeholder-gray-400"
        ></textarea>
      </div>

      {/* Botón de Envío (Usando componente separado) */}
      <div className="flex justify-end">
        <SubmitContactButton />
      </div>

      {/* Aquí podríamos añadir lógica para mostrar mensajes de éxito/error
          usando useFormState si quisiéramos feedback más integrado que solo un toast */}

    </form>
  );
}