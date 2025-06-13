document.addEventListener("DOMContentLoaded", () => {
  // Menú hamburguesa
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("navbar");
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
  });

  // Inicializar Swiper
  new Swiper(".swiper-container", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 5000,
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });

  // Datos de obras
  const obras = [
    {
      title: "Libro de Búhos y Lechuzas",
      year: 2023,
      technique: "Libro",
      price: 50000,
      description: "Libro de búhos, lechuzas, flores y plumas. Hecho con acuarela y tinta.",
      images: ["obra1a.jpg", "obra1b.jpg"],
    },
    {
      title: "Pingüinos",
      year: 2022,
      technique: "Acrílico",
      price: 18000,
      description: "Obra pingüinos.",
      images: ["obra2a.jpg", "obra2b.jpg"],
    },
    {
      title: "TérrAq",
      year: 2024,
      technique: "Juego de Mesa",
      price: 90000,
      description: "Juego de mesa de estrategia sobre especies y medioambiente. Con ilustraciones dibujadas a mano, diseño y textos sobre cuestiones ambientales del planeta, este juego ha obtenido la Mención al Sello Buen Diseño argentino.",
      images: ["obra3a.jpg", "obra3b.jpg", "obra3c.jpg", "obra3d.jpg"],
    },
    {
      title: "Zorro",
      year: 2024,
      technique: "Dibujo",
      price: 90000,
      description: "Pintura zorro hecho con lápiz acuarelable.",
      images: ["obra4a.jpg", "obra4b.jpg"],
    },
    {
      title: "León",
      year: 2024,
      technique: "Dibujo",
      price: 90000,
      description: "Dibujo de león.",
      images: ["obra5a.jpg", "obra5b.jpg"],
    },
    {
      title: "Tortuga",
      year: 2024,
      technique: "Acrílico",
      price: 90000,
      description: "Pintura de tortuga con acrílico.",
      images: ["obra6a.jpg", "obra6b.jpg"],
    },
  ];

  // Renderizar galería
  const contenedor = document.getElementById("obras-container");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.querySelector(".modal-close");

  function renderObras(filteredObras) {
    contenedor.innerHTML = filteredObras.map((obra) => `
      <div class="obra-card p-4" data-technique="${obra.technique}">
        <img src="img/${obra.images[0]}" alt="${obra.title}" class="mb-4" loading="lazy">
        <h3 class="text-lg font-semibold">${obra.title}</h3>
        <p>${obra.technique}</p>
        <p class="text-green-600 font-bold">$${obra.price}</p>
      </div>
    `).join("");
  }

  renderObras(obras);

  // Filtros
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      const filteredObras = filter === "all" ? obras : obras.filter((obra) => obra.technique === filter);
      renderObras(filteredObras);
    });
  });

  // Modal para detalles
  contenedor.addEventListener("click", (e) => {
    const card = e.target.closest(".obra-card");
    if (!card) return;
    const index = Array.from(contenedor.children).indexOf(card);
    const obra = obras[index];

    modalBody.innerHTML = `
      <div class="swiper-container-modal">
        <div class="swiper-wrapper">
          ${obra.images.map((img) => `<div class="swiper-slide"><img src="img/${img}" alt="${obra.title}" class="mx-auto"></div>`).join("")}
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
      <h2 class="text-2xl font-serif text-green-800 mt-4">${obra.title}</h2>
      <p><strong>Año:</strong> ${obra.year}</p>
      <p><strong>Técnica:</strong> ${obra.technique}</p>
      <p><strong>Precio:</strong> $${obra.price}</p>
      <p>${obra.description}</p>
      <a href="https://wa.me/5491167852021?text=Hola%20Lorena,%20estoy%20interesado/a%20en%20la%20obra%20'${encodeURIComponent(obra.title)}'" 
         target="_blank" 
         class="btn-whatsapp bg-green-500 text-white px-4 py-2 rounded-lg mt-4 inline-block">
         Consultar por WhatsApp
      </a>
    `;
    modal.classList.remove("hidden");
    new Swiper(".swiper-container-modal", {
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  });

  modalClose.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
});