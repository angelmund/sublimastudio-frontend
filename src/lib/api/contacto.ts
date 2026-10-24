export async function enviarMensaje(datos: {
  nombre: string;
  email: string;
  asunto: string | null;
  mensaje: string;
}): Promise<boolean> {

  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log('Mensaje enviado:', datos);
  return true;
}