
/**
 * Construye una URL completa para el enlace público de reservas
 * @param relativePath Ruta relativa (ej. '/booking/user_123')
 * @returns URL completa con el dominio actual
 */
export const getPublicBookingUrl = (relativePath: string): string => {
  const baseUrl = window.location.origin;
  
  // Si ya es una ruta completa (comienza con el origin), devolverla tal cual
  if (relativePath.startsWith(baseUrl)) {
    return relativePath;
  }
  
  // Asegurarnos de que la ruta comience con /
  const normalizedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Copia un texto al portapapeles
 * @param text Texto a copiar
 * @returns Promise que se resuelve cuando se ha copiado
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error al copiar al portapapeles:", error);
    return false;
  }
};
