// ---------- Configuración ----------

const PRECIO = 2000;
const TOTAL_NUMEROS = 100;

const TEXTO_BOTON = {
  numeros: "Continuar",
  datos: "Revisar reserva",
  resumen: "Confirmar reserva"
};


// ---------- Estado ----------

const seleccionados = new Set();

/*
  Números vendidos de ejemplo.
  Después vendrán desde Firebase.
*/

const vendidos = new Set([
  4,
  12,
  27,
  38,
  55,
  71,
  88
]);

let pasoActual = "numeros";

// Posición del scroll en la grilla, para volver al mismo lugar
let scrollNumeros = 0;

// Los errores del formulario se muestran solo después del primer intento
let intentoEnviar = false;


// ---------- Elementos de la página ----------

const contenedor =
  document.getElementById("numeros");

const totalElemento =
  document.getElementById("total");

const cantidadElemento =
  document.getElementById("cantidad");

const listaElemento =
  document.getElementById("seleccionLista");

const botonContinuar =
  document.getElementById("continuar");

const portada =
  document.getElementById("portada");

const barraCompra =
  document.getElementById("barraCompra");

const pasos =
  document.querySelectorAll(".paso");

const formDatos =
  document.getElementById("formDatos");

const campos = {
  nombre: document.getElementById("nombre"),
  telefono: document.getElementById("telefono"),
  correo: document.getElementById("correo")
};

const errores = {
  nombre: document.getElementById("errorNombre"),
  telefono: document.getElementById("errorTelefono"),
  correo: document.getElementById("errorCorreo")
};


// ---------- Formatos ----------

function formatoNumero(numero) {

  return String(numero).padStart(3, "0");

}


function formatoDinero(valor) {

  return new Intl.NumberFormat(
    "es-CL",
    {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }
  ).format(valor);

}


function formatoCantidad(cantidad) {

  return cantidad === 1
    ? "1 número"
    : `${cantidad} números`;

}


function formatoTelefono(digitos) {

  return `+56 ${digitos[0]} ${digitos.slice(1, 5)} ${digitos.slice(5)}`;

}


function numerosOrdenados() {

  return [...seleccionados].sort((a, b) => a - b);

}


// ---------- Grilla de números ----------

function crearNumeros() {

  for (
    let numero = 1;
    numero <= TOTAL_NUMEROS;
    numero++
  ) {

    const boton =
      document.createElement("button");

    boton.className = "numero";

    boton.textContent =
      formatoNumero(numero);


    if (vendidos.has(numero)) {

      boton.classList.add("vendido");

      boton.disabled = true;

    } else {

      boton.addEventListener(
        "click",
        () => seleccionarNumero(
          numero,
          boton
        )
      );

    }

    contenedor.appendChild(boton);

  }

}


function seleccionarNumero(
  numero,
  boton
) {

  if (seleccionados.has(numero)) {

    seleccionados.delete(numero);

    boton.classList.remove("activo");

  } else {

    seleccionados.add(numero);

    boton.classList.add("activo");

  }

  actualizarResumen();

}


// ---------- Resumen y barra inferior ----------

function actualizarResumen() {

  const cantidad =
    seleccionados.size;

  const total =
    cantidad * PRECIO;


  cantidadElemento.textContent =
    formatoCantidad(cantidad);


  totalElemento.textContent =
    formatoDinero(total);


  botonContinuar.disabled =
    cantidad === 0;


  if (cantidad === 0) {

    listaElemento.textContent =
      "Aún no has seleccionado números.";

    return;

  }


  const lista =
    numerosOrdenados()
      .map(formatoNumero)
      .join(", ");


  listaElemento.innerHTML =
    `<strong>Seleccionados:</strong> ${lista}`;

}


function pintarChips(contenedorChips) {

  contenedorChips.innerHTML = "";

  numerosOrdenados().forEach((numero) => {

    const chip =
      document.createElement("span");

    chip.className = "chip";

    chip.textContent =
      formatoNumero(numero);

    contenedorChips.appendChild(chip);

  });

}


// ---------- Navegación entre pasos ----------

/*
  Cada paso se guarda en el historial del navegador.
  Así el botón "Atrás" del celular vuelve al paso anterior
  en lugar de salir de la página.
*/

function mostrarPaso(paso) {

  // Sin números elegidos no tiene sentido estar en otro paso
  if (paso !== "numeros" && seleccionados.size === 0) {
    paso = "numeros";
  }

  if (pasoActual === "numeros" && paso !== "numeros") {
    scrollNumeros = window.scrollY;
  }

  pasoActual = paso;


  pasos.forEach((elemento) => {
    elemento.hidden =
      elemento.dataset.paso !== paso;
  });

  portada.hidden =
    paso !== "numeros";

  barraCompra.hidden =
    paso === "listo";

  if (TEXTO_BOTON[paso]) {
    botonContinuar.textContent =
      TEXTO_BOTON[paso];
  }


  if (paso === "datos") {
    pintarPasoDatos();
  }

  if (paso === "resumen") {
    pintarPasoResumen();
  }


  window.scrollTo(
    0,
    paso === "numeros" ? scrollNumeros : 0
  );

}


function irAPaso(paso) {

  history.pushState({ paso }, "");

  mostrarPaso(paso);

}


window.addEventListener(
  "popstate",
  (evento) => {

    const paso =
      evento.state && evento.state.paso
        ? evento.state.paso
        : "numeros";

    mostrarPaso(paso);

  }
);


document
  .querySelectorAll('[data-accion="volver"]')
  .forEach((boton) => {
    boton.addEventListener(
      "click",
      () => history.back()
    );
  });


document
  .getElementById("cambiarDesdeResumen")
  .addEventListener(
    "click",
    () => history.go(-2)
  );


// ---------- Paso 2: datos del comprador ----------

function pintarPasoDatos() {

  pintarChips(
    document.getElementById("chipsDatos")
  );

  document.getElementById("lineaTotalDatos").innerHTML =
    `${formatoCantidad(seleccionados.size)} · Total ` +
    `<strong>${formatoDinero(seleccionados.size * PRECIO)}</strong>`;

}


/*
  Acepta el celular escrito de distintas formas:
  912345678, 9 1234 5678, +56 9 1234 5678, 56912345678.
  Devuelve los 9 dígitos, o null si no es válido.
*/

function normalizarTelefono(texto) {

  let digitos =
    texto.replace(/\D/g, "");

  if (digitos.length === 11 && digitos.startsWith("56")) {
    digitos = digitos.slice(2);
  }

  return /^9\d{8}$/.test(digitos)
    ? digitos
    : null;

}


function leerDatos() {

  return {
    nombre: campos.nombre.value.trim().replace(/\s+/g, " "),
    telefono: normalizarTelefono(campos.telefono.value),
    correo: campos.correo.value.trim()
  };

}


function errorDeCampo(campo, datos) {

  if (campo === "nombre") {

    if (datos.nombre === "") {
      return "Escribe tu nombre y apellido.";
    }

    if (datos.nombre.split(" ").length < 2) {
      return "Agrega también tu apellido.";
    }

  }

  if (campo === "telefono") {

    if (campos.telefono.value.trim() === "") {
      return "Escribe tu número de celular.";
    }

    if (!datos.telefono) {
      return "Revisa el número. Debe tener 9 dígitos y empezar con 9, por ejemplo 9 1234 5678.";
    }

  }

  if (campo === "correo") {

    const correoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (datos.correo !== "" && !correoValido.test(datos.correo)) {
      return "Revisa el correo, por ejemplo nombre@gmail.com. También puedes dejarlo vacío.";
    }

  }

  return "";

}


function mostrarError(campo, mensaje) {

  errores[campo].textContent = mensaje;

  campos[campo].setAttribute(
    "aria-invalid",
    mensaje ? "true" : "false"
  );

}


function validarDatos() {

  intentoEnviar = true;

  const datos = leerDatos();

  let primerCampoConError = null;


  Object.keys(campos).forEach((campo) => {

    const mensaje =
      errorDeCampo(campo, datos);

    mostrarError(campo, mensaje);

    if (mensaje && !primerCampoConError) {
      primerCampoConError = campo;
    }

  });


  if (primerCampoConError) {

    campos[primerCampoConError].focus();

    campos[primerCampoConError].scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    return false;

  }

  return true;

}


// Después del primer intento, el error desaparece apenas se corrige
Object.keys(campos).forEach((campo) => {

  campos[campo].addEventListener(
    "input",
    () => {

      if (intentoEnviar) {
        mostrarError(
          campo,
          errorDeCampo(campo, leerDatos())
        );
      }

    }
  );

});


// "Siguiente" en el teclado del celular pasa al campo siguiente
formDatos.addEventListener(
  "keydown",
  (evento) => {

    if (evento.key !== "Enter") {
      return;
    }

    evento.preventDefault();

    const lista =
      Object.values(campos);

    const indice =
      lista.indexOf(evento.target);

    if (indice >= 0 && indice < lista.length - 1) {
      lista[indice + 1].focus();
    } else {
      evento.target.blur();
      avanzar();
    }

  }
);


formDatos.addEventListener(
  "submit",
  (evento) => evento.preventDefault()
);


// ---------- Paso 3: resumen ----------

function pintarPasoResumen() {

  const reserva =
    obtenerReserva();

  document.getElementById("resumenNombre").textContent =
    reserva.comprador.nombre;

  document.getElementById("resumenTelefono").textContent =
    formatoTelefono(reserva.comprador.telefono);


  const tieneCorreo =
    reserva.comprador.correo !== "";

  document.getElementById("resumenCorreoTitulo").hidden =
    !tieneCorreo;

  document.getElementById("resumenCorreo").hidden =
    !tieneCorreo;

  document.getElementById("resumenCorreo").textContent =
    reserva.comprador.correo;


  pintarChips(
    document.getElementById("chipsResumen")
  );

  document.getElementById("resumenCantidad").textContent =
    formatoCantidad(reserva.cantidad);

  document.getElementById("resumenPrecio").textContent =
    formatoDinero(PRECIO);

  document.getElementById("resumenTotal").textContent =
    formatoDinero(reserva.total);

}


/*
  Reúne todo lo que se enviará al reservar.
  Cuando conectemos Firebase, este objeto es el que se guardará.
*/

function obtenerReserva() {

  const numeros =
    numerosOrdenados();

  return {
    numeros,
    cantidad: numeros.length,
    total: numeros.length * PRECIO,
    comprador: leerDatos()
  };

}


function confirmarReserva() {

  // Aquí se guardará la reserva en Firebase en la próxima etapa

  irAPaso("listo");

}


// ---------- Botón principal de la barra ----------

function avanzar() {

  if (pasoActual === "numeros") {
    irAPaso("datos");
    return;
  }

  if (pasoActual === "datos") {
    if (validarDatos()) {
      irAPaso("resumen");
    }
    return;
  }

  if (pasoActual === "resumen") {
    confirmarReserva();
  }

}


botonContinuar.addEventListener(
  "click",
  avanzar
);


// ---------- Volver al inicio ----------

function reiniciar() {

  seleccionados.clear();

  contenedor
    .querySelectorAll(".activo")
    .forEach((boton) => boton.classList.remove("activo"));

  formDatos.reset();

  intentoEnviar = false;

  Object.keys(campos).forEach((campo) => mostrarError(campo, ""));

  actualizarResumen();

  scrollNumeros = 0;

  history.pushState({ paso: "numeros" }, "");

  mostrarPaso("numeros");

}


document
  .getElementById("volverInicio")
  .addEventListener(
    "click",
    reiniciar
  );


// ---------- Inicio ----------

history.replaceState({ paso: "numeros" }, "");

crearNumeros();
