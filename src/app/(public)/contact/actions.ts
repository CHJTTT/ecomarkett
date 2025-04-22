'use server';

import { prisma } from '@/lib/prisma';

import { redirect } from 'next/navigation'; // Podríamos redirigir o simplemente mostrar mensaje

export async function submitContactAction(formData: FormData) {
  // 1. Extraer datos
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string || null; // Asunto es opcional
  const message = formData.get('message') as string;

  // 2. Validación básica
  if (!name || !email || !message) {
    // Idealmente, devolver un error específico al formulario
    throw new Error("Nombre, Email y Mensaje son requeridos.");
  }
  // Validación simple de email (podría ser más robusta)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Formato de correo electrónico inválido.");
  }

  // 3. Guardar en la base de datos
  try {
    console.log("Attempting to save contact message:", { name, email, subject });
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        // isRead es false por defecto, createdAt es automático
      },
    });
    console.log("Contact message saved successfully!");
  } catch (error: unknown) {
    console.error("Error saving contact message:", error);
    // Devolver un error genérico por ahora
    throw new Error("Ocurrió un error al guardar el mensaje. Inténtalo de nuevo.");
  }

  // 4. ¿Qué hacer después? Opciones:
  // Opción A: Redirigir a una página de "Gracias" (necesitaríamos crearla)
  // redirect('/contact/thank-you');

  // Opción B: Revalidar la propia página de contacto (útil si mostráramos un mensaje de éxito)
  // revalidatePath('/contact');
  // (Sin un mensaje de éxito visible, la revalidación no hace mucho aquí)

  // Opción C (Simple para MVD): Redirigir a la página principal
  redirect('/');

  // Opción D (Más avanzada, requiere Client Component): Devolver un estado de éxito
  // return { success: true, message: '¡Mensaje enviado con éxito!' };
}