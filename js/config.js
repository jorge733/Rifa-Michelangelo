// ===========================================================
//  CONFIGURACIÓN DE LA RIFA — edita solo este archivo
// ===========================================================
const RIFA = {
  curso: "Segundo Medio",
  colegio: "Colegio Waldorf Michelangelo",
  motivo: "Reunimos fondos para nuestro viaje de estudios y actividades de curso.",

  // Precio por número (en pesos chilenos)
  precio: 2000,

  // Cantidad total de números a la venta
  totalNumeros: 300,

  // Fecha y hora del sorteo (formato AAAA-MM-DDTHH:MM:SS, hora local)
  fechaSorteo: "2026-11-28T18:00:00",
  lugarSorteo: "Colegio Waldorf Michelangelo (transmisión en vivo por Instagram)",

  // Números ya vendidos (agrégalos aquí a medida que se vendan)
  vendidos: [7, 13, 21, 42, 77, 100, 123, 150, 201, 250],

  // Premios, en orden
  premios: [
    { lugar: "1er premio", nombre: "Canasta artesanal de productos locales", detalle: "Quesos, mermeladas, miel y pan hecho por las familias del curso." },
    { lugar: "2do premio", nombre: "Gift card de $50.000", detalle: "Para usar en un comercio de la comuna." },
    { lugar: "3er premio", nombre: "Obra de arte hecha por el curso", detalle: "Acuarela original creada en la clase de arte." }
  ],

  // Contacto para comprar números
  // WhatsApp: código de país + número, sin "+" ni espacios (ej: 56912345678)
  whatsapp: "56900000000",
  transferencia: {
    banco: "Banco Ejemplo",
    tipoCuenta: "Cuenta Corriente",
    numero: "00-000-00000-00",
    rut: "11.111.111-1",
    nombre: "Apoderados Segundo Medio",
    correo: "rifa.segundomedio@ejemplo.cl"
  }
};
