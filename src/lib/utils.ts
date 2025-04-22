// src/lib/utils.ts

/**
 * Formatea un número o string numérico como moneda (Euros por defecto).
 * @param price El valor a formatear.
 * @param currency El código de moneda (ej: 'EUR', 'USD'). Por defecto 'EUR'.
 * @param locale El locale para el formato (ej: 'es-ES', 'en-US'). Por defecto 'es-ES'.
 * @returns El precio formateado como string o un mensaje de error.
 */
export function formatPrice(
    price: number | string | null | undefined,
    currency: string = 'EUR',
    locale: string = 'es-ES'
): string {
    // Manejar casos nulos o indefinidos
    if (price === null || typeof price === 'undefined') {
        // Puedes decidir devolver 'N/A', '€0.00', o un string vacío según tu preferencia
        return 'N/A';
        // O podrías lanzar un error si prefieres:
        // throw new Error('Price cannot be null or undefined');
    }

    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

    // Verificar si la conversión fue exitosa y no es NaN
    if (isNaN(numericPrice)) {
        console.error(`Invalid price value received: ${price}`);
        return 'Precio inválido'; // O un valor por defecto como '€---'
    }

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            // minimumFractionDigits: 2, // Opcional: asegura siempre 2 decimales
            // maximumFractionDigits: 2, // Opcional: asegura siempre 2 decimales
        }).format(numericPrice);
    } catch (error) {
        console.error(`Error formatting price: ${error}`);
        // Devolver el número original o un mensaje de error si el formato falla
        return `${numericPrice} ${currency}`;
    }
}

// Puedes añadir más funciones de utilidad aquí en el futuro