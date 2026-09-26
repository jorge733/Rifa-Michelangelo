// ---------- Configuración ----------

const PRECIO = 2000;
const TOTAL_NUMEROS = 100;


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
    cantidad === 1
      ? "1 número"
      : `${cantidad} números`;


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
    [...seleccionados]
      .sort((a, b) => a - b)
      .map(formatoNumero)
      .join(", ");


  listaElemento.innerHTML =
    `<strong>Seleccionados:</strong> ${lista}`;

}


// ---------- Botón Continuar ----------

botonContinuar.addEventListener(
  "click",
  () => {

    const lista =
      [...seleccionados]
        .sort((a, b) => a - b)
        .map(formatoNumero)
        .join(", ");

    alert(
      "Números seleccionados: " +
      lista +
      "\n\nTotal: " +
      formatoDinero(
        seleccionados.size * PRECIO
      )
    );

  }
);


// ---------- Inicio ----------

crearNumeros();
