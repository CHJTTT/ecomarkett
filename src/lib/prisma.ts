import { PrismaClient } from '@prisma/client';

// Declaramos una variable global para almacenar la instancia de Prisma en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Creamos la instancia de Prisma.
// Si ya existe una instancia global (en desarrollo), la reutilizamos.
// Si no, creamos una nueva.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Opcional: Descomenta la siguiente línea si quieres ver las consultas SQL
    // que Prisma ejecuta en la consola de tu terminal donde corre `npm run dev`
    // log: ['query', 'info', 'warn', 'error'],
  });

// En entornos que no sean de producción (es decir, en desarrollo),
// asignamos la instancia creada a la variable global.
// Esto evita que se creen múltiples instancias durante el HMR.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Exportamos la instancia única para usarla en nuestra aplicación
// No es necesario exportarla como default, pero podemos hacerlo si queremos
// export default prisma; // Opcional