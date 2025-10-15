// index.js (reemplazar por completo)
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

  /* ----------------- Cargar datos desde JSON ----------------- */
  async function loadObras() {
    try {
      const resp = await fetch("../obras_cleaned.json", { cache: "no-store" });
      if (!resp.ok) throw new Error("No se pudo cargar obras_cleaned.json: " + resp.status);
      const data = await resp.json();
      // Normalizar estructuras mínimas
      return data.map((r, idx) => {
        // Intentar usar propiedades comunes con fallbacks
        const images = Array.isArray(r.images) ? r.images : (r.images ? [r.images] : (r._original_row && r._original_row['Foto (hay o no)'] ? String(r._original_row['Foto (hay o no)']).split(',').map(s=>s.trim()) : []));
        return {
          _idx: idx,
          title: r.title || (r._original_row && r._original_row['Titulo']) || "Sin título",
          category: r.category || "Obra pictórica",
          tipo_original: r.tipo_original || (r._original_row && r._original_row['Tipo']) || null,
          tecnica: r.tecnica || (r._original_row && r._original_row['Técnica']) || null,
          size: r.size || (r._original_row && r._original_row['Tamaño']) || null,
          price: r.price || (r._original_row && r._original_row['Precio']) || null,
          description: r.description || (r._original_row && r._original_row['Descripción']) || null,
          images: images.map(i => typeof i === "string" ? i.trim() : i).filter(Boolean),
          raw: r._original_row || r
        };
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  /* ----------------- Render galería ----------------- */
  let currentObras = [];
  function renderObras(obrasArray) {
    const cont = document.getElementById("obras-container");
    if (!cont) return console.error("Contenedor #obras-container no encontrado");
    cont.innerHTML = "";
    if (!obrasArray.length) {
      cont.innerHTML = `<div style="text-align:center;padding:40px;color:#666;grid-column:1/-1;">Coming soon...</div>`;
      return;
    }

    obrasArray.forEach((obra, displayIndex) => {
      const firstImage = obra.images && obra.images.length ? obra.images[0] : "placeholder.png";
      const imageIndicator = obra.images && obra.images.length > 1 ? `<div class="image-count-indicator">${obra.images.length} fotos</div>` : "";
      const priceText = obra.price && obra.price !== "consultar precio" ? `$${String(obra.price)}` : "Consultar precio";
      const card = document.createElement("div");
      card.className = "obra-card";
      card.setAttribute("data-display-index", displayIndex);
      card.setAttribute("data-category", obra.category);
      card.innerHTML = `
        <div class="obra-image-container">
          <img src="img/${firstImage}" alt="${escapeHtml(obra.title)}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/280'">
          ${imageIndicator}
        </div>
        <h3>${escapeHtml(obra.title)}</h3>
        <p>${escapeHtml(obra.tecnica || obra.category || "")}</p>
        <p class="price">${priceText}</p>
      `;
      cont.appendChild(card);
    });
  }

  /* ----------------- Filtros ----------------- */
  function setupFilters(obrasArr) {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        let filtered;
        if (!filter || filter === "Todas" || filter.toLowerCase() === "all") {
          filtered = obrasArr;
        } else {
          filtered = obrasArr.filter(o => o.category === filter);
        }
        currentObras = filtered;
        renderObras(filtered);
      });
    });
  }

  /* ----------------- Modal dinámico por categoría ----------------- */
  function generateModalHTML(obra) {
    const row = (label, value) => `<p><strong>${label}:</strong> ${value || "No especificado"}</p>`;
    const titleHtml = `<h2>${escapeHtml(obra.title)}</h2>`;

    // imágenes -> slides
    const imagesHtml = (obra.images && obra.images.length) ? obra.images.map(i =>
      `<div class="swiper-slide"><img src="img/${i}" alt="${escapeHtml(obra.title)}" onerror="this.src='https://via.placeholder.com/600x400'"></div>`
    ).join('') : "";

    const sliderSection = (obra.images && obra.images.length > 1) ? `
      <div class="modal-image-section">
        <div class="swiper modal-swiper">
          <div class="swiper-wrapper">
            ${imagesHtml}
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
      </div>` : (obra.images && obra.images.length === 1 ? `
      <div class="single-image"><img src="img/${obra.images[0]}" alt="${escapeHtml(obra.title)}" onerror="this.src='https://via.placeholder.com/600x400'"></div>` : `
      <div class="single-image"><img src="https://via.placeholder.com/600x400" alt="placeholder"></div>`);

    // Por categoría
    let detailsHtml = "";
    if (obra.category === "Obra pictórica" || obra.category === "Acuarelas e Ilustraciones") {
      detailsHtml = `
        <div class="obra-details">
          ${row("Técnica", obra.tecnica)}
          ${row("Tamaño", obra.size)}
          ${row("Precio", obra.price && obra.price !== "consultar precio" ? `$${obra.price}` : "Consultar precio")}
        </div>
        <p class="obra-description">${escapeHtml(obra.description || "")}</p>
        <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent('Hola Lorena, me interesa la obra: ' + obra.title)}" target="_blank">Consultar por WhatsApp</a>
      `;
    } else if (obra.category === "TerrAqEcoJuego") {
      const ig = (obra.raw && (obra.raw['Instagram'] || obra.raw['instagram'])) || ""; // si existiera en hoja
      const yt = (obra.raw && (obra.raw['YouTube'] || obra.raw['youtube'])) || "";
      detailsHtml = `
        <div class="obra-details">
          ${row("Descripción del juego", obra.description)}
          ${row("Tamaño", obra.size)}
          ${row("Precio", obra.price)}
        </div>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:12px;">
          ${ig ? `<a href="${ig}" target="_blank" class="btn-whatsapp">Instagram Terraq</a>` : ''}
          ${yt ? `<a href="${yt}" target="_blank" class="btn-whatsapp">Ver video de juego</a>` : ''}
          <a href="https://wa.me/5491167852021?text=${encodeURIComponent('Hola Lorena, quiero info sobre el juego: ' + obra.title)}" target="_blank" class="btn-whatsapp">Consultar por WhatsApp</a>
        </div>
      `;
    } else if (obra.category === "Libros & Postales") {
      // intentar detectar si es libro o postal
      const isLibro = obra.tipo_original && String(obra.tipo_original).toLowerCase().includes("libro");
      if (isLibro) {
        detailsHtml = `
          <div class="obra-details">
            ${row("Tamaño", obra.size)}
            ${row("Precio", obra.price)}
            ${row("Mini descripción (uso)", obra.raw && (obra.raw['Uso'] || obra.raw['Mini descripción']) || obra.description)}
            ${row("Material", obra.raw && (obra.raw['Material'] || "") )}
            ${row("Cantidad de páginas", obra.raw && (obra.raw['Cantidad de paginas'] || obra.raw['Páginas'] || ""))}
            ${row("Encuadernación", obra.raw && (obra.raw['Encuadernacion'] || ""))}
            ${row("Cantidad de hojas", obra.raw && (obra.raw['Cantidad de hojas'] || ""))}
          </div>
          <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent('Hola Lorena, me interesa el libro: ' + obra.title)}" target="_blank">Consultar por WhatsApp</a>
        `;
      } else {
        // postales
        detailsHtml = `
          <div class="obra-details">
            ${row("Descripción", obra.description)}
            ${row("Precio", obra.price)}
            ${row("Técnica", obra.tecnica)}
            ${row("Tamaño", obra.size)}
          </div>
          <p style="font-style:italic; margin-top:10px;">Las postales se venden en packs y se coordina selección por WhatsApp.</p>
          <a class="btn-whatsapp" href="https://wa.me/5491167852021?text=${encodeURIComponent('Hola Lorena, me interesan las postales: ' + obra.title)}" target="_blank">Consultarme por packs</a>
        `;
      }
    } else {
      // Baúles & Deco, Prints, etc.
      detailsHtml = `
        <div class="obra-details">
          ${row("Técnica", obra.tecnica)}
          ${row("Tamaño", obra.size)}
          ${row("Precio", obra.price)}
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

  /* ----------------- Modal listeners y Swiper init ----------------- */
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

      // Iniciar Swiper del modal si existe
      if (modalBody.querySelector(".modal-swiper")) {
        setTimeout(() => {
          try {
            new Swiper(".modal-swiper", {
              loop: obra.images && obra.images.length > 2,
              navigation: {
                nextEl: ".modal-swiper .swiper-button-next",
                prevEl: ".modal-swiper .swiper-button-prev",
              },
              pagination: { el: ".modal-swiper .swiper-pagination", clickable: true },
              slidesPerView: 1
            });
          } catch (err) { console.warn("Swiper modal init", err); }
        }, 80);
      }
    });

    modalClose.addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", (ev) => { if (ev.target === modal) modal.classList.remove("show"); });
    document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") modal.classList.remove("show"); });
  }

  /* ----------------- Utilities ----------------- */
  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  /* ----------------- Boot app ----------------- */
  (async function boot() {
    const obras = await loadObras();
    // Orden simple: por título (o por año si preferís)
    obras.sort((a,b) => (a.title || "").localeCompare(b.title || ""));
    currentObras = obras;
    renderObras(obras);
    setupFilters(obras);
    setupModal();
  })();

});
