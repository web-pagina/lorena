document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Detección de base (raíz vs /docs) ---------- */
  let BASE = "";                    // se setea en loadObras() tras detectar desde dónde carga
  const BASE_CANDIDATES = ["", "docs/"]; // probamos primero raíz y luego /docs/

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
    console.warn("⚠️ Swiper hero no disponible:", err);
  }

  /* ----------------- Utilidades ----------------- */
  const PLACEHOLDER_SM = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400";
  const PLACEHOLDER_LG = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800";

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
  }

  function formatPrice(p) {
    if (p === null || p === undefined || p === "") return "Consultar precio";
    if (typeof p === "number") return `$${p.toLocaleString("es-AR")}`;
    const str = String(p).trim();
    if (str.toLowerCase().includes("consultar")) return "Consultar precio";
    if (/(usd|dólar|dolar)/i.test(str)) {
      const num = Number(str.replace(/[^\d.-]/g, ""));
      return isNaN(num) ? str : `USD ${num}`;
    }
    const num = Number(str.replace(/[^\d.-]/g, ""));
    return !isNaN(num) && /\d/.test(str) ? `$${num.toLocaleString("es-AR")}` : str;
  }

  function normalize(str) {
    if (!str && str !== 0) return "";
    return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/\s+/g, " ").trim();
  }

  /* ---------- Resolver ruta/https de imagen ---------- */
  function resolveImagePath(imageName) {
    if (!imageName) return PLACEHOLDER_SM;
    let trimmed = String(imageName).trim();

    // Forzar https si viene con http (evita contenido mixto en GitHub Pages)
    if (/^http:\/\//i.test(trimmed)) trimmed = trimmed.replace(/^http:\/\//i, "https://");

    // URL absoluta o ruta absoluta del servidor
    if (/^https?:\/\//i.test(trimmed) || /^\//.test(trimmed)) return trimmed;

    // Ruta relativa -> usar BASE detectada + img/
    return `${BASE}img/${trimmed}`;
  }

  /* ----------------- Cargar JSON (sin caché + auto base) ----------------- */
  async function loadObras() {
    const jsonFiles = ["obras_cleaned.json", "obras_clean.json", "obras.json"];
    const bust = `?v=${Date.now()}`; // cache-buster
    let data = null;

    console.log("🔍 Buscando archivo de obras…");

    // probamos combinaciones de BASE y filename hasta encontrar uno válido
    for (const base of BASE_CANDIDATES) {
      for (const filename of jsonFiles) {
        const url = `${base}${filename}${bust}`;
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            data = await res.json();
            BASE = base; // fijamos la base detectada para imágenes locales
            console.log(`✅ Datos cargados desde: ${url} (BASE="${BASE}")`);
            break;
          }
        } catch (e) {
          // ignoramos y seguimos probando
        }
      }
      if (data) break;
    }

    if (!data || !Array.isArray(data)) {
      console.error("❌ No se pudo cargar ningún archivo JSON válido");
      return [];
    }

    // Filtrar entradas inválidas
    const validObras = data.filter((r) => {
      const title = r.title;
      if (!title) return false;
      const t = String(title).toLowerCase();
      return !['link','agregar','instagram','youtube','instructivo','http'].some(k => t.includes(k));
    });

    console.log(`📊 Obras válidas: ${validObras.length}`);

    // Normalización
    return validObras.map((obra, idx) => {
      const images = Array.isArray(obra.images)
        ? obra.images.filter(Boolean)
        : (obra.images ? String(obra.images).split(",").map(s => s.trim()).filter(Boolean) : []);
      return {
        _idx: idx,
        title: obra.title || "Sin título",
        tecnica: obra.tecnica || obra.technique || null,
        tipo_original: obra.tipo_original || null,
        size: obra.size || null,
        size_total: obra.size_total || null,
        panels: obra.panels || null,
        price: obra.price || null,
        description: obra.description || null,
        images,
        category: obra.category || "Obra pictórica",
        raw: obra.raw || obra._original_row || {}
      };
    });
  }

  /* ----------------- Render galería ----------------- */
  let currentObras = [];

  function renderObras(obrasArray) {
    const cont = document.getElementById("obras-container");
    if (!cont) { console.error("❌ Falta #obras-container"); return; }
    cont.innerHTML = "";

    if (!obrasArray || obrasArray.length === 0) {
      cont.innerHTML = `
        <div style="text-align:center;padding:60px 20px;color:#666;grid-column:1/-1;">
          <h3 style="margin-bottom:10px;">No hay obras disponibles</h3>
          <p>Verifica que el archivo JSON esté correctamente cargado.</p>
        </div>`;
      return;
    }

    obrasArray.forEach((obra, displayIndex) => {
      const firstImage = obra.images?.[0] || null;
      const imageSrc = resolveImagePath(firstImage);

      const imageIndicator = obra.images && obra.images.length > 1
        ? `<div class="image-count-indicator">${obra.images.length} fotos</div>` : "";

      const priceText = formatPrice(obra.price);

      const card = document.createElement("div");
      card.className = "obra-card";
      card.setAttribute("data-display-index", displayIndex);
      card.setAttribute("data-category", obra.category || "");
      card.innerHTML = `
        <div class="obra-image-container">
          <img src="${imageSrc}" 
               alt="${escapeHtml(obra.title)}" 
               loading="lazy"
               referrerpolicy="no-referrer"
               onerror="this.onerror=null; this.src='${PLACEHOLDER_SM}';">
          ${imageIndicator}
        </div>
        <h3>${escapeHtml(obra.title)}</h3>
        <p>${escapeHtml(obra.tecnica || obra.category || "")}</p>
        <p class="price">${escapeHtml(priceText)}</p>
      `;
      cont.appendChild(card);
    });

    console.log(`✅ ${obrasArray.length} obras renderizadas`);
  }

  /* ----------------- Filtros ----------------- */
  function setupFilters(obrasArr) {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const nf = normalize(btn.dataset.filter || "");
        const filtered = (!nf || nf === "todas" || nf === "all")
          ? obrasArr
          : obrasArr.filter(o => normalize(o.category) === nf);

        currentObras = filtered;
        renderObras(filtered);
        console.log(`🔍 Filtro: "${btn.dataset.filter}" -> ${filtered.length} obras`);
      });
    });
  }

  /* ----------------- Tamaños/panels ----------------- */
  function renderSizeBlock(obra) {
    const escape = (s) => escapeHtml(s);
    let html = "";

    if (obra.size_total) {
      html += `<p><strong>Medida total:</strong> ${escape(obra.size_total)}</p>`;
    }

    if (Array.isArray(obra.panels) && obra.panels.length) {
      if (obra.size_total || obra.panels.length > 1) {
        html += `<div style="margin-top:6px;"><strong>Medidas individuales:</strong>
          <ul class="panels-list" style="margin:8px 0 0 18px; text-align:left;">`;
        obra.panels.forEach((p, idx) => {
          const label = p.label || `Panel ${idx + 1}`;
          const size = p.size || "No especificado";
          const note = p.note ? ` — ${escape(p.note)}` : "";
          html += `<li><strong>${escape(label)}:</strong> ${escape(size)}${note}</li>`;
        });
        html += `</ul></div>`;
      } else {
        const p = obra.panels[0];
        html += `<p><strong>Tamaño:</strong> ${escape(p.size || "No especificado")}</p>`;
      }
    } else if (obra.size) {
      html += `<p><strong>Tamaño:</strong> ${escape(obra.size)}</p>`;
    }

    if (!html) html = `<p><strong>Tamaño:</strong> No especificado</p>`;
    return `<div class="obra-size">${html}</div>`;
  }

  /* ----------------- Modal dinámico ----------------- */
  function generateModalHTML(obra) {
    const row = (label, value) => value ? `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>` : "";
    const titleHtml = `<h2>${escapeHtml(obra.title)}</h2>`;

    const imagesHtml = (obra.images && obra.images.length) ? obra.images.map((img, i) => {
      const parts = [];
      if (Array.isArray(obra.panels) && obra.panels[i]) {
        const p = obra.panels[i];
        if (p.label) parts.push(p.label);
        if (p.size) parts.push(p.size);
        if (p.note) parts.push(p.note);
      }
      const caption = parts.length ? `<div class="slide-caption">${escapeHtml(parts.join(" — "))}</div>` : "";
      const imgSrc = resolveImagePath(img);
      return `<div class="swiper-slide" style="position:relative;">
                <img src="${imgSrc}" alt="${escapeHtml(obra.title)}"
                     referrerpolicy="no-referrer"
                     onerror="this.onerror=null; this.src='${PLACEHOLDER_LG}';">
                ${caption}
              </div>`;
    }).join("") : "";

    const sliderSection = (obra.images && obra.images.length > 1) ? `
      <div class="modal-image-section">
        <div class="swiper modal-swiper">
          <div class="swiper-wrapper">${imagesHtml}</div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
      </div>` : (obra.images && obra.images.length === 1 ? `
      <div class="single-image">
        <img src="${resolveImagePath(obra.images[0])}" alt="${escapeHtml(obra.title)}"
             referrerpolicy="no-referrer"
             onerror="this.onerror=null; this.src='${PLACEHOLDER_LG}';">
      </div>` : `
      <div class="single-image">
        <img src="${PLACEHOLDER_LG}" alt="Arte">
      </div>`);

    let detailsHtml = "";
    const cat = (obra.category || "").trim();

    if (cat === "Obra pictórica" || cat === "Acuarelas e Ilustraciones") {
      detailsHtml = `
        <div class="obra-details">
          ${row("Técnica", obra.tecnica)}
          ${renderSizeBlock(obra)}
          ${row("Precio", formatPrice(obra.price))}
        </div>
        ${obra.description ? `<p class="obra-description">${escapeHtml(obra.description)}</p>` : ""}
        <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent("Hola Lorena, me interesa la obra: " + obra.title)}" target="_blank">Consultar por WhatsApp</a>
      `;
    } else if (cat === "TerrAqEcoJuego") {
      const ig = (obra.raw && (obra.raw.Instagram || obra.raw.instagram)) || "";
      const yt = (obra.raw && (obra.raw.YouTube || obra.raw.youtube || obra.raw.Video)) || "";
      detailsHtml = `
        <div class="obra-details">
          ${obra.description ? `<p>${escapeHtml(obra.description)}</p>` : ""}
          ${renderSizeBlock(obra)}
          ${row("Precio", formatPrice(obra.price))}
        </div>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:12px; flex-wrap:wrap;">
          ${ig ? `<a href="${escapeHtml(ig)}" target="_blank" class="btn-whatsapp">Instagram Terraq</a>` : ""}
          ${yt ? `<a href="${escapeHtml(yt)}" target="_blank" class="btn-whatsapp">Ver video de juego</a>` : ""}
          <a href="https://wa.me/5491167852021?text=${encodeURIComponent("Hola Lorena, quiero info sobre el juego: " + obra.title)}" target="_blank" class="btn-whatsapp">Consultar por WhatsApp</a>
        </div>
      `;
    } else if (cat === "Libros & Postales") {
      const isLibro = obra.tipo_original && String(obra.tipo_original).toLowerCase().includes("libro");
      if (isLibro) {
        detailsHtml = `
          <div class="obra-details">
            ${renderSizeBlock(obra)}
            ${row("Precio", formatPrice(obra.price))}
            ${row("Descripción", obra.description)}
          </div>
          <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent("Hola Lorena, me interesa el libro: " + obra.title)}" target="_blank">Consultar por WhatsApp</a>
        `;
      } else {
        detailsHtml = `
          <div class="obra-details">
            ${row("Descripción", obra.description)}
            ${row("Precio", formatPrice(obra.price))}
            ${renderSizeBlock(obra)}
          </div>
          <p style="font-style:italic; margin-top:10px;">Las postales se venden en packs y se coordina selección por WhatsApp.</p>
          <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent("Hola Lorena, me interesan las postales: " + obra.title)}" target="_blank">Consultarme por packs</a>
        `;
      }
    } else {
      detailsHtml = `
        <div class="obra-details">
          ${row("Técnica", obra.tecnica)}
          ${renderSizeBlock(obra)}
          ${row("Precio", formatPrice(obra.price))}
        </div>
        ${obra.description ? `<p class="obra-description">${escapeHtml(obra.description)}</p>` : ""}
        <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent("Hola Lorena, me interesa la obra: " + obra.title)}" target="_blank">Consultar por WhatsApp</a>
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

  /* ----------------- Modal setup ----------------- */
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

      const modalSwiperEl = modalBody.querySelector(".modal-swiper");
      if (modalSwiperEl) {
        setTimeout(() => {
          try {
            new Swiper(modalSwiperEl, {
              loop: obra.images && obra.images.length > 2,
              navigation: {
                nextEl: modalSwiperEl.querySelector(".swiper-button-next"),
                prevEl: modalSwiperEl.querySelector(".swiper-button-prev"),
              },
              pagination: {
                el: modalSwiperEl.querySelector(".swiper-pagination"),
                clickable: true,
                dynamicBullets: true
              },
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
    console.log("🚀 Iniciando aplicación…");
    const obras = await loadObras();

    if (obras.length === 0) {
      const cont = document.getElementById("obras-container");
      if (cont) cont.innerHTML = `
        <div style="text-align:center;padding:40px;color:#d00;grid-column:1/-1;">
          <h3>Error al cargar las obras</h3>
          <p>Revisá que <code>obras_cleaned.json</code> esté en la carpeta correcta.</p>
        </div>`;
      return;
    }

    obras.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    currentObras = obras;
    renderObras(obras);
    setupFilters(obras);
    setupModal();
    window.currentObras = currentObras;

    const allBtn = Array.from(document.querySelectorAll(".filter-btn"))
      .find(b => ["todas","all"].includes(normalize(b.dataset.filter || "")));
    if (allBtn) allBtn.classList.add("active");

    console.log(`✅ App lista con ${obras.length} obras (BASE="${BASE}")`);
  })();
});
