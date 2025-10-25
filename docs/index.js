// docs/index.js (reemplazar por completo)
document.addEventListener("DOMContentLoaded", () => {

  /* ----------------- Menú mobile ----------------- */
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");
  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", navbar.classList.contains("open"));
    });
    navbar.addEventListener("click", (e) => {
      if (e.target.tagName === "A") navbar.classList.remove("open");
    });
  }

  /* ----------------- Hero Swiper ----------------- */
  try {
    new Swiper(".hero-swiper", {
      loop: true,
      effect: "fade",
      fadeEffect: { crossFade: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      pagination: { el: ".swiper-pagination", clickable: true },
      slidesPerView: 1,
      spaceBetween: 0,
    });
  } catch (err) {
    console.warn("Swiper hero init error:", err);
  }

  /* ----------------- Utilidades ----------------- */
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
  }

  function formatPrice(p) {
    if (p === null || p === undefined || p === "") return "Consultar precio";
    if (typeof p === "number") return `$${p.toLocaleString()}`;
    const num = Number(String(p).replace(/[^\d.-]/g, ""));
    if (!Number.isNaN(num) && String(p).match(/\d/)) return `$${num.toLocaleString()}`;
    return String(p);
  }

  function normalize(str) {
    if (!str && str !== 0) return "";
    return String(str)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function includesAnyCI(source, keywords = []) {
    if (!source) return false;
    const s = normalize(source);
    return keywords.some(k => s.includes(normalize(k)));
  }

  /* ----------------- Cargar y normalizar JSON ----------------- */
  /* ----------------- Cargar y normalizar JSON (versión robusta) ----------------- */
  async function loadObras() {
    try {
      // nombres posibles (el repo mostró "obras_cleaned.json")
      const nameCandidates = ['obras_cleaned.json', 'obras_clean.json', 'obras.json'];

      // bases posibles; usar new URL con location.href asegura que resolvemos correctamente
      const baseCandidates = [
        './',                           // relativo (mejor cuando index y json están juntos)
        window.REPO_BASE || './',       // si has expuesto REPO_BASE desde index.html (opcional)
        location.pathname.replace(/\/(?:index\.html)?$/, '/') // /carpeta/ si aplica
      ].filter((v,i,a) => a.indexOf(v) === i); // quitar duplicados

      let data = null;
      let lastAttempt = null;

      // helper para intentar fetch y devolver json
      async function tryFetchCandidate(base, name) {
        // construye URL absoluta correctamente respecto a la página actual
        const url = new URL(name, new URL(base, location.href)).href;
        console.info('Intentando cargar obras desde:', url);
        const resp = await fetch(url, { cache: 'no-store' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText} (${url})`);
        return await resp.json();
      }

      for (const base of baseCandidates) {
        for (const name of nameCandidates) {
          try {
            data = await tryFetchCandidate(base, name);
            window.OBRAS_SOURCE = new URL(name, new URL(base, location.href)).href;
            break;
          } catch (err) {
            lastAttempt = { base, name, err: String(err) };
            console.warn('No se pudo cargar:', name, 'desde base', base, err);
          }
        }
        if (data) break;
      }

      if (!data) {
        console.error('No se pudo cargar ningún JSON de obras. Último intento:', lastAttempt);
        return []; // devolvemos array vacío para que el resto del app no explote
      }

      // Normalizar registros (usa tu lógica original)
      return data.map((r, idx) => {
        const original = r._original_row || r || {};
        let images = [];
        if (Array.isArray(r.images)) images = r.images;
        else if (r.images && typeof r.images === "string") images = r.images.split(",").map(s => s.trim());
        else if (original && original['Foto (hay o no)']) images = String(original['Foto (hay o no)']).split(",").map(s => s.trim());

        const title = r.title || original['Titulo'] || original['Título'] || "Sin título";
        const tecnica = r.tecnica || r.technique || original['Técnica'] || original['Tecnica'] || null;
        const tipo_original = r.tipo_original || original['Tipo'] || original['Tipo obra'] || null;
        const size = r.size || original['Tamaño'] || original['Tamaño (cm)'] || null;
        const price = r.price || original['Precio'] || original['Valor'] || null;
        const description = r.description || original['Descripción'] || original['Mini descripción'] || null;

        // detectar categoría por heurísticas si no viene
        let category = r.category || original['Category'] || original['Categoría'] || null;
        if (!category) {
          const joined = [title, tecnica, tipo_original, description, original['Tipo'], original['Categoria'], original['Categoría']].filter(Boolean).join(" ");
          if (includesAnyCI(joined, ["acuarela","acuarelas","ilustración","ilustraciones","ilustracion"])) category = "Acuarelas e Ilustraciones";
          else if (includesAnyCI(joined, ["libro","libros","postal","postales"])) category = "Libros & Postales";
          else if (includesAnyCI(joined, ["baúl","baul","arcon","baules","baúles","deco","decor"])) category = "Baúles & Deco";
          else if (includesAnyCI(joined, ["juego","juegos","terraq","terraq","terraqecojuego"])) category = "TerrAqEcoJuego";
          else if (includesAnyCI(joined, ["print","réplica","replica","réplicas","replicas"])) category = "Prints";
          else category = "Obra pictórica";
        }

        images = images.map(i => typeof i === "string" ? i.trim() : i).filter(Boolean);

        return {
          _idx: idx,
          title,
          tecnica,
          tipo_original,
          size,
          price,
          description,
          images,
          category,
          raw: original
        };
      });
    } catch (err) {
      console.error("Error loadObras (fatal):", err);
      return [];
    }
  }

  /* ----------------- Render galería ----------------- */
  let currentObras = [];

  function renderObras(obrasArray) {
    const cont = document.getElementById("obras-container");
    if (!cont) return console.error("Contenedor #obras-container no encontrado");
    cont.innerHTML = "";

    if (!obrasArray || obrasArray.length === 0) {
      cont.innerHTML = `<div style="text-align:center;padding:40px;color:#666;grid-column:1/-1;">Coming soon...</div>`;
      return;
    }

    obrasArray.forEach((obra, displayIndex) => {
      const firstImage = (obra.images && obra.images.length) ? obra.images[0] : null;

      // Si la ruta ya es absoluta (http(s)://) o empieza con '/' la respetamos.
      // Si es solo un nombre de archivo (p.ej. "obra1.jpg") lo resolvemos a img/<nombre>
      let imageSrc = "https://via.placeholder.com/280";
      if (firstImage) {
        const trimmed = String(firstImage).trim();
        if (/^https?:\/\//i.test(trimmed)) {
          imageSrc = trimmed;
        } else if (/^\//.test(trimmed)) {
          // ruta absoluta en el servidor (empieza con '/')
          imageSrc = trimmed;
        } else {
          // ruta relativa dentro de la carpeta img/
          imageSrc = `img/${trimmed}`;
        }
      }

      const imageIndicator = obra.images && obra.images.length > 1 ? `<div class="image-count-indicator">${obra.images.length} fotos</div>` : "";
      const priceText = formatPrice(obra.price);


      const card = document.createElement("div");
      card.className = "obra-card";
      card.setAttribute("data-display-index", displayIndex);
      card.setAttribute("data-category", obra.category || "");
      card.innerHTML = `
        <div class="obra-image-container">
          <img src="${imageSrc}" alt="${escapeHtml(obra.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/280'">
          ${imageIndicator}
        </div>
        <h3>${escapeHtml(obra.title)}</h3>
        <p>${escapeHtml(obra.tecnica || obra.category || "")}</p>
        <p class="price">${escapeHtml(priceText)}</p>
      `;
      cont.appendChild(card);
    });
  }

  /* ----------------- Filtros (comparación normalizada) ----------------- */
  function setupFilters(obrasArr) {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filterRaw = btn.dataset.filter || "";
        const nf = normalize(filterRaw);
        let filtered;
        if (!filterRaw || nf === "todas" || nf === "all") {
          filtered = obrasArr;
        } else {
          filtered = obrasArr.filter(o => normalize(o.category) === nf);
        }
        currentObras = filtered;
        renderObras(filtered);
      });
    });
  }

    /* ----------------- Render tamaño (size_total + panels) ----------------- */
  function renderSizeBlock(obra) {
    // usa escapeHtml disponible en el scope
    const escape = (s) => escapeHtml(s);
    let html = "";

    if (obra.size_total) {
      html += `<p><strong>Medida total:</strong> ${escape(obra.size_total)}</p>`;
    }

    if (Array.isArray(obra.panels) && obra.panels.length) {
      // Si hay medida total o más de 1 panel, mostrar encabezado y lista
      if (obra.size_total || obra.panels.length > 1) {
        html += `<div style="margin-top:6px;"><strong>Medidas individuales:</strong><ul class="panels-list" style="margin:8px 0 0 18px; text-align:left;">`;
        obra.panels.forEach((p, idx) => {
          const label = p.label || `Panel ${idx + 1}`;
          const size = p.size || "No especificado";
          const note = p.note ? ` — ${escape(p.note)}` : "";
          html += `<li><strong>${escape(label)}:</strong> ${escape(size)}${note}</li>`;
        });
        html += `</ul></div>`;
      } else {
        // solo 1 panel en panels[], mostrar simple
        const p = obra.panels[0];
        html += `<p><strong>Tamaño:</strong> ${escape(p.size || "No especificado")}</p>`;
      }
    } else if (obra.size) {
      // fallback al campo size antiguo
      html += `<p><strong>Tamaño:</strong> ${escape(obra.size)}</p>`;
    }

    if (!html) html = `<p><strong>Tamaño:</strong> No especificado</p>`;

    return `<div class="obra-size">${html}</div>`;
  }

  /* ----------------- Modal dinámico (mejorado con panels y captions) ----------------- */
  function generateModalHTML(obra) {
    const row = (label, value) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value || "No especificado")}</p>`;
    const titleHtml = `<h2>${escapeHtml(obra.title)}</h2>`;

    // Construir slides: si hay panels intentamos agregar caption por índice
    const imagesHtml = (obra.images && obra.images.length) ? obra.images.map((img, i) => {
      const captionParts = [];
      if (Array.isArray(obra.panels) && obra.panels[i]) {
        const p = obra.panels[i];
        if (p.label) captionParts.push(p.label);
        if (p.size) captionParts.push(p.size);
        if (p.note) captionParts.push(p.note);
      }
      const captionHtml = captionParts.length ? `<div class="slide-caption">${escapeHtml(captionParts.join(" — "))}</div>` : "";
      return `<div class="swiper-slide" style="position:relative;">
                <img src="img/${img}" alt="${escapeHtml(obra.title)}" onerror="this.src='https://via.placeholder.com/600x400'">
                ${captionHtml}
              </div>`;
    }).join('') : "";

    const sliderSection = (obra.images && obra.images.length > 1) ? `
      <div class="modal-image-section">
        <div class="swiper modal-swiper">
          <div class="swiper-wrapper">${imagesHtml}</div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
      </div>` : (obra.images && obra.images.length === 1 ? `
      <div class="single-image"><img src="img/${obra.images[0]}" alt="${escapeHtml(obra.title)}" onerror="this.src='https://via.placeholder.com/600x400'"></div>` : `
      <div class="single-image"><img src="https://via.placeholder.com/600x400" alt="placeholder"></div>`);

    let detailsHtml = "";
    const cat = (obra.category || "").trim();

    if (cat === "Obra pictórica" || cat === "Acuarelas e Ilustraciones") {
      detailsHtml = `
        <div class="obra-details">
          ${row("Técnica", obra.tecnica)}
          ${renderSizeBlock(obra)}
          ${row("Precio", formatPrice(obra.price))}
        </div>
        <p class="obra-description">${escapeHtml(obra.description || (obra.raw && obra.raw['Descripción']) || "")}</p>
        <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent('Hola Lorena, me interesa la obra: ' + obra.title)}" target="_blank">Consultar por WhatsApp</a>
      `;
    } else if (cat === "TerrAqEcoJuego") {
      const ig = (obra.raw && (obra.raw['Instagram'] || obra.raw['instagram'])) || "";
      const yt = (obra.raw && (obra.raw['YouTube'] || obra.raw['youtube'] || obra.raw['Video'])) || "";
      detailsHtml = `
        <div class="obra-details">
          ${row("Descripción del juego", obra.description || (obra.raw && (obra.raw['Descripción'] || obra.raw['Descripcion']) ) )}
          ${renderSizeBlock(obra)}
          ${row("Precio", formatPrice(obra.price))}
        </div>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:12px; flex-wrap:wrap;">
          ${ig ? `<a href="${escapeHtml(ig)}" target="_blank" class="btn-whatsapp">Instagram Terraq</a>` : ''}
          ${yt ? `<a href="${escapeHtml(yt)}" target="_blank" class="btn-whatsapp">Ver video de juego</a>` : ''}
          <a href="https://wa.me/5491167852021?text=${encodeURIComponent('Hola Lorena, quiero info sobre el juego: ' + obra.title)}" target="_blank" class="btn-whatsapp">Consultar por WhatsApp</a>
        </div>
      `;
    } else if (cat === "Libros & Postales") {
      const isLibro = obra.tipo_original && String(obra.tipo_original).toLowerCase().includes("libro");
      if (isLibro) {
        detailsHtml = `
          <div class="obra-details">
            ${renderSizeBlock(obra)}
            ${row("Precio", formatPrice(obra.price))}
            ${row("Mini descripción (uso)", obra.raw && (obra.raw['Uso'] || obra.raw['Mini descripción'] || obra.description))}
            ${row("Material", obra.raw && (obra.raw['Material'] || ""))}
            ${row("Cantidad de páginas", obra.raw && (obra.raw['Cantidad de paginas'] || obra.raw['Páginas'] || obra.raw['Paginas'] || ""))}
            ${row("Encuadernación", obra.raw && (obra.raw['Encuadernacion'] || obra.raw['Encuadernación'] || ""))}
            ${row("Cantidad de hojas", obra.raw && (obra.raw['Cantidad de hojas'] || ""))}
          </div>
          <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent('Hola Lorena, me interesa el libro: ' + obra.title)}" target="_blank">Consultar por WhatsApp</a>
        `;
      } else {
        detailsHtml = `
          <div class="obra-details">
            ${row("Descripción", obra.description)}
            ${row("Precio", formatPrice(obra.price))}
            ${row("Técnica", obra.tecnica)}
            ${renderSizeBlock(obra)}
          </div>
          <p style="font-style:italic; margin-top:10px;">Las postales se venden en packs y se coordina selección por WhatsApp.</p>
          <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent('Hola Lorena, me interesan las postales: ' + obra.title)}" target="_blank">Consultarme por packs</a>
        `;
      }
    } else {
      detailsHtml = `
        <div class="obra-details">
          ${row("Técnica", obra.tecnica)}
          ${renderSizeBlock(obra)}
          ${row("Precio", formatPrice(obra.price))}
        </div>
        <p class="obra-description">${escapeHtml(obra.description || "")}</p>
        <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent('Hola Lorena, me interesa la obra: ' + obra.title)}" target="_blank">Consultar por WhatsApp</a>
      `;
    }

    return `
      <div class="modal-card">
        ${sliderSection}
        <div class="modal-text">
          ${titleHtml}
          ${detailsHtml}
        </div>
      </div>
    `;
  }

  /* ----------------- Modal y Swiper del modal ----------------- */
  function setupModal() {
    const contenedor = document.getElementById("obras-container");
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modal-body");
    const modalClose = modal ? modal.querySelector(".modal-close") : null;
    if (!contenedor || !modal || !modalBody || !modalClose) return;

    contenedor.addEventListener("click", (e) => {
      const card = e.target.closest(".obra-card");
      if (!card) return;
      const displayIndex = Number(card.getAttribute("data-display-index"));
      const obra = currentObras[displayIndex];
      if (!obra) return;

      modalBody.innerHTML = generateModalHTML(obra);
      modal.classList.add("show");

      if (modalBody.querySelector(".modal-swiper")) {
        setTimeout(() => {
          try {
            new Swiper(".modal-swiper", {
              loop: obra.images && obra.images.length > 2,
              navigation: {
                nextEl: ".modal-swiper .swiper-button-next",
                prevEl: ".modal-swiper .swiper-button-prev",
              },
              pagination: { el: ".modal-swiper .swiper-pagination", clickable: true, dynamicBullets: true },
              slidesPerView: 1,
              spaceBetween: 0,
            });
          } catch (err) {
            console.warn("Swiper modal init:", err);
          }
        }, 80);
      }
    });

    modalClose.addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", (ev) => { if (ev.target === modal) modal.classList.remove("show"); });
    document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") modal.classList.remove("show"); });
  }

  /* ----------------- App boot ----------------- */
  (async function boot() {
    const obras = await loadObras();
    // ordenar por título para consistencia
    obras.sort((a,b) => (a.title || "").localeCompare(b.title || ""));
    currentObras = obras;
    renderObras(obras);
    setupFilters(obras);
    setupModal();
    window.currentObras = currentObras; // debug
  })();

});
