// Anulamos temporalmente la conexión con OpenAI
export async function getImageDescription(imageFile: File): Promise<string> {
  // Simulamos un pequeño retraso para imitar el proceso de análisis
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "Esta es una imagen fascinante con colores vibrantes y detalles interesantes.";
}