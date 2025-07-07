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
      description: "Libro de búhos, lechuzas, flores y plumas. Hecho con acuarela y tinta. Sus páginas son una travesía interna que solo cada uno de nosotros podrá expresar.",
      images: ["obra1a.png", "obra1b.png", "obra1c.png", "obra1d.png", "obra1e.png"],
    },
    {
      title: "Miradas desde la osucridad",
      year: 2019,
      technique: "Acrílico",
      size: "120 cm x 120 cm",
      price: 18000,
      description: "Las oscuras profundidades del océano vibran con poderosas miradas de seres que los humanos se niegan a ver...",
      images: ["obra2a.png", "obra2b.png"],
    },
    {
      title: "TérrAq",
      year: 2024,
      technique: "Juego de Mesa",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Juego de mesa de estrategia sobre especies y medioambiente. Con ilustraciones dibujadas a mano, diseño y textos sobre cuestiones ambientales del planeta, este juego ha obtenido la Mención al Sello Buen Diseño argentino.",
      images: ["obra3a.png", "obra3b.png", "obra3c.png", "obra3d.png", "obra3e.png"],
    },
    {
      title: "El Panda del Mar",
      year: 2019,
      technique: "Acrílico",
      size: "90 cm x 100 cm",
      price: 90000,
      description: "Sólo quedamos 9 a 19... Cuántos son ustedes? Los que pescan...",
      images: ["obra4a.png", "obra4b.png"],
    },
    {
      title: "Cachorros en el Hielo",
      year: 2019,
      technique: "Acrílico",
      size: "1,36 m x 1,56 m",
      price: 90000,
      description: "Vida Polar... parecería imposible pensarla, sin embargo la vida triunfa y se abre paso bajo tremendas condiciones... insiste y sigue. Me pregunto si la Humanidad estará dispuesta a acompañarla...",
      images: ["obra5a.png", "obra5b.png"],
    },
    {
      title: "Siempre Azul",
      year: 2018,
      technique: "Acrílico",
      size: "1,05 m x 1,35 m",
      price: 90000,
      description: "Cuerpos diminutos albergan un sentido de felicidad absoluta con la pareja elegida. De por vida unidos por lazos invisbles e inquebrantables. Frágiles y poderosos. Combinación fascinante...",
      images: ["obra6a.png", "obra6b.png"],
    },
        {
      title: "Pack postales",
      year: 2024,
      technique: "Postales",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Pack de 4 postales.",
      images: ["obra7a.png", "obra7b.png", "obra7c.png", "obra7d.png", "obra7e.png"],
    },
    {
      title: "Libro Aruor",
      year: 2024,
      technique: "Libro",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Libro Aruor.",
      images: ["obra8a.png", "obra8b.png", "obra8c.png", "obra8d.png", "obra8e.png"],
    },
        {
      title: "Libro del Agua",
      year: 2023,
      technique: "Libro",
      size: "?",
      price: 50000,
      description: "Las páginas de este libro prometen sumergirnos en una travesía profunda para que el tiempo se detenga y las voces externas e internas se apacígüen en un mar de colores y formas.",
      images: ["obra9a.png"],
    },
    {
      title: "Burbujas Polares",
      year: 2016,
      technique: "Acrílico",
      size: "1,00 m x 1,20 m",
      price: 90000,
      description: "Burbujas de vida que desaparecerán si no tomamos conciencia de nuestras acciones respecto a la Naturaleza.",
      images: ["obra10a.png", "obra10b.png"],
    },
    {
      title: "Abrazo de Aletas",
      year: 2017,
      technique: "Acrílico",
      size: "0,80 m x o,90 m (medida bastidor) ; 1,25 m x 1,15 m (medida marco)",
      price: 90000,
      description: "Seis de las siete especies de tortugas marinas que existen están amenazadas, tres de ellas en forma crítica. Cómo protegerse con sólo un abrazo de aletas?",
      images: ["obra11a.png", "obra11b.png"],
    },
    {
      title: "Familia de Emperadores",
      year: 2020,
      technique: "Acrílico",
      size: "100 cm x 120 cm",
      price: 90000,
      description: "Largos inviernos antárticos son el desafío y a su vez el refugio de los magnificos emperadores del hielo.",
      images: ["obra12a.png", "obra12b.png"],
    },
    {
      title: "Infantes en la Antártida",
      year: 2021,
      technique: "Acrílico",
      size: "50 cm x 120 cm",
      price: 90000,
      description: "La seguridad del hielo firme da el tiempo necesario para la maduración física de una comunidad de seres adaptados a una de las regiones mas inhóspitas del planeta.",
      images: ["obra13a.png", "obra13b.png"],
    }
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
      <p><strong>Tamaño:</strong> ${obra.size}</p>
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