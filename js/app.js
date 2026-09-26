(function () {
  const $ = (id) => document.getElementById(id);
  const vendidos = new Set(RIFA.vendidos);
  const seleccion = new Set();
  const pesos = (n) => "$" + n.toLocaleString("es-CL");
  const fechaSorteo = new Date(RIFA.fechaSorteo);

  // --- Textos generales ---
  $("colegio").textContent = RIFA.colegio;
  $("curso").textContent = RIFA.curso;
  $("motivo").textContent = RIFA.motivo;
  $("precio").textContent = pesos(RIFA.precio);
  $("disponibles").textContent = RIFA.totalNumeros - vendidos.size;
  $("fecha").textContent = fechaSorteo.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
  $("lugar").textContent = "📍 " + RIFA.lugarSorteo;
  $("curso-footer").textContent = RIFA.curso;
  $("colegio-footer").textContent = RIFA.colegio;

  // --- Cuenta regresiva ---
  function tick() {
    const diff = Math.max(0, fechaSorteo - new Date());
    $("cd-dias").textContent = Math.floor(diff / 864e5);
    $("cd-horas").textContent = Math.floor(diff / 36e5) % 24;
    $("cd-min").textContent = Math.floor(diff / 6e4) % 60;
    $("cd-seg").textContent = Math.floor(diff / 1e3) % 60;
  }
  tick();
  setInterval(tick, 1000);

  // --- Premios ---
  const medallas = ["🥇", "🥈", "🥉", "🎁"];
  $("prizes").innerHTML = RIFA.premios.map((p, i) => `
    <article class="prize">
      <div class="medal">${medallas[Math.min(i, 3)]}</div>
      <div class="place">${p.lugar}</div>
      <h3>${p.nombre}</h3>
      <p>${p.detalle}</p>
    </article>`).join("");

  // --- Datos bancarios ---
  const t = RIFA.transferencia;
  $("bank").innerHTML = `
    <h3>Datos para transferir</h3>
    <dl>
      <dt>Nombre</dt><dd>${t.nombre}</dd>
      <dt>RUT</dt><dd>${t.rut}</dd>
      <dt>Banco</dt><dd>${t.banco}</dd>
      <dt>Tipo</dt><dd>${t.tipoCuenta}</dd>
      <dt>N° cuenta</dt><dd>${t.numero}</dd>
      <dt>Correo</dt><dd>${t.correo}</dd>
    </dl>`;

  // --- Grilla de números ---
  const grid = $("grid");
  const digitos = String(RIFA.totalNumeros).length;
  const etiqueta = (n) => String(n).padStart(digitos, "0");
  const frag = document.createDocumentFragment();
  for (let n = 1; n <= RIFA.totalNumeros; n++) {
    const b = document.createElement("button");
    b.className = "num";
    b.textContent = etiqueta(n);
    b.dataset.n = n;
    if (vendidos.has(n)) {
      b.disabled = true;
      b.title = "Vendido";
    }
    frag.appendChild(b);
  }
  grid.appendChild(frag);

  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".num");
    if (!b || b.disabled) return;
    toggle(Number(b.dataset.n), b);
  });

  function toggle(n, b) {
    b = b || grid.querySelector(`[data-n="${n}"]`);
    if (seleccion.has(n)) seleccion.delete(n); else seleccion.add(n);
    b.classList.toggle("selected", seleccion.has(n));
    b.setAttribute("aria-pressed", seleccion.has(n));
    actualizarCarro();
  }

  // --- Buscar ---
  $("buscar").addEventListener("input", (e) => {
    grid.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
    const n = parseInt(e.target.value, 10);
    const b = grid.querySelector(`[data-n="${n}"]`);
    if (b) {
      b.classList.add("highlight");
      b.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // --- Número al azar ---
  $("azar").addEventListener("click", () => {
    const libres = [];
    for (let n = 1; n <= RIFA.totalNumeros; n++) {
      if (!vendidos.has(n) && !seleccion.has(n)) libres.push(n);
    }
    if (!libres.length) return;
    const n = libres[Math.floor(Math.random() * libres.length)];
    toggle(n);
    grid.querySelector(`[data-n="${n}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // --- Carro ---
  $("limpiar").addEventListener("click", () => {
    seleccion.forEach((n) => grid.querySelector(`[data-n="${n}"]`).classList.remove("selected"));
    seleccion.clear();
    actualizarCarro();
  });

  function actualizarCarro() {
    const lista = [...seleccion].sort((a, b) => a - b);
    const total = lista.length * RIFA.precio;
    $("cart").classList.toggle("visible", lista.length > 0);
    $("cart-count").textContent = lista.length === 1 ? "1 número" : `${lista.length} números`;
    $("cart-total").textContent = pesos(total);
    const msg = `¡Hola! Quiero comprar ${lista.length === 1 ? "el número" : "los números"} ` +
      `${lista.map(etiqueta).join(", ")} de la rifa del ${RIFA.curso} (${RIFA.colegio}). ` +
      `Total: ${pesos(total)}. Mi nombre es: `;
    $("whatsapp").href = `https://wa.me/${RIFA.whatsapp}?text=${encodeURIComponent(msg)}`;
  }
})();
