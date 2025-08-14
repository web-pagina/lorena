document.addEventListener("DOMContentLoaded", () => {
  // Menú mobile
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");
  
  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", navbar.classList.contains("open"));
    });
    
    // Cerrar menú al hacer click en un enlace
    navbar.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navbar.classList.remove("open");
      }
    });
  }

  // Inicializar Swiper
  new Swiper(".hero-swiper", {
    loop: true,
    effect: "fade",
    fadeEffect: { crossFade: true },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 0,
  });

  // Datos de obras - SOLO con imágenes que sabemos que existen
  const obras = [
    {
      title: "Libro de Búhos y Lechuzas",
      year: 2023,
      technique: "Libro",
      price: 50000,
      description: "Libro de búhos, lechuzas, flores y plumas. Hecho con acuarela y tinta. Sus páginas son una travesía interna que solo cada uno de nosotros podrá expresar.",
      images: ["obra1a.png"], // Usar solo la primera imagen por ahora
    },
    {
      title: "Miradas desde la oscuridad",
      year: 2019,
      technique: "Acrílico",
      size: "120 cm x 120 cm",
      price: 18000,
      description: "Las oscuras profundidades del océano vibran con poderosas miradas de seres que los humanos se niegan a ver...",
      images: ["obra2a.png"],
    },
    {
      title: "TérrAq",
      year: 2024,
      technique: "Juego de Mesa",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Juego de mesa de estrategia sobre especies y medioambiente. Con ilustraciones dibujadas a mano, diseño y textos sobre cuestiones ambientales del planeta, este juego ha obtenido la Mención al Sello Buen Diseño argentino.",
      images: ["obra3a.png"],
    },
    {
      title: "El Panda del Mar",
      year: 2019,
      technique: "Acrílico",
      size: "90 cm x 100 cm",
      price: 90000,
      description: "Sólo quedamos 9 a 19... Cuántos son ustedes? Los que pescan...",
      images: ["obra4a.png"],
    },
    {
      title: "Cachorros en el Hielo",
      year: 2019,
      technique: "Acrílico",
      size: "1,36 m x 1,56 m",
      price: 90000,
      description: "Vida Polar... parecería imposible pensarla, sin embargo la vida triunfa y se abre paso bajo tremendas condiciones... insiste y sigue. Me pregunto si la Humanidad estará dispuesta a acompañarla...",
      images: ["obra5a.png"], // Removí obra5b.png que da 404
    },
    {
      title: "Siempre Azul",
      year: 2018,
      technique: "Acrílico",
      size: "1,05 m x 1,35 m",
      price: 90000,
      description: "Cuerpos diminutos albergan un sentido de felicidad absoluta con la pareja elegida. De por vida unidos por lazos invisbles e inquebrantables. Frágiles y poderosos. Combinación fascinante...",
      images: ["obra6a.png"],
    },
    {
      title: "Pack postales (1)",
      year: 2024,
      technique: "Postales",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Pack de 4 postales.",
      images: ["obra7a.png"],
    },
    {
      title: "Libro Aruor",
      year: 2024,
      technique: "Libro",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Libro Aruor.",
      images: ["obra8a.png"],
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
      images: ["obra10a.png"],
    },
    {
      title: "Abrazo de Aletas",
      year: 2017,
      technique: "Acrílico",
      size: "0,80 m x o,90 m (medida bastidor) ; 1,25 m x 1,15 m (medida marco)",
      price: 90000,
      description: "Seis de las siete especies de tortugas marinas que existen están amenazadas, tres de ellas en forma crítica. Cómo protegerse con sólo un abrazo de aletas?",
      images: ["obra11a.png"],
    },
    {
      title: "Familia de Emperadores",
      year: 2020,
      technique: "Acrílico",
      size: "100 cm x 120 cm",
      price: 90000,
      description: "Largos inviernos antárticos son el desafío y a su vez el refugio de los magnificos emperadores del hielo.",
      images: ["obra12a.png"],
    },
    {
      title: "Infantes en la Antártida",
      year: 2021,
      technique: "Acrílico",
      size: "50 cm x 120 cm",
      price: 90000,
      description: "La seguridad del hielo firme da el tiempo necesario para la maduración física de una comunidad de seres adaptados a una de las regiones mas inhóspitas del planeta.",
      images: ["obra13a.png"],
    },
    {
      title: "Pack postales (2)",
      year: 2024,
      technique: "Postales",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Pack de 4 postales.",
      images: ["obra14a.png"],
    },
    {
      title: "Guardianes en el Oceano",
      year: 2018,
      technique: "Acrílico",
      size: "1,36 m x 1,52 m",
      price: 90000,
      description: "Los mal afamados tiburones, son los verdaderos protectores de las barreras coralinas y de la diversidad de especies del océano. Y esto es lo que no vemos en las películas... -Miedo- debería darnos su ausencia en los mares.",
      images: ["obra15a.png"],
    }
  ];

  // Renderizar galería
  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("obras-container");
    console.log("Contenedor encontrado:", contenedor);

    function renderObras(filteredObras) {
      if (!contenedor) {
        console.error("Contenedor no encontrado");
        return;
      }
      console.log("Renderizando obras:", filteredObras);
      contenedor.innerHTML = "";
      if (filteredObras.length === 0) {
        contenedor.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
            Próximamente...
          </div>
        `;
      } else {
        contenedor.innerHTML = filteredObras.map((obra, index) => {
          const firstImage = obra.images[0] || "placeholder.png"; // Fallback si la imagen falla
          return `
            <div class="obra-card p-4" data-technique="${obra.technique}" data-index="${index}">
              <img src="img/${firstImage}" alt="${obra.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/280'; console.log('Imagen ${firstImage} no encontrada, usando placeholder');">
              <h3 class="text-lg font-semibold">${obra.title}</h3>
              <p>${obra.technique}</p>
              <p class="text-green-600 font-bold">$${obra.price}</p>
            </div>
          `;
        }).join("");
      }
      console.log("Galería renderizada:", contenedor.innerHTML);
    }

    renderObras(obras);
  });

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
  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("obras-container");
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modal-body");
    const modalClose = modal ? modal.querySelector(".modal-close") : null;

    console.log("Elementos buscados:", { contenedor, modal, modalBody, modalClose });

    if (contenedor && modal && modalBody && modalClose) {
      console.log("Elementos del modal encontrados:", { contenedor, modal, modalBody, modalClose });
      contenedor.addEventListener("click", (e) => {
        console.log("Clic detectado en contenedor");
        const card = e.target.closest(".obra-card");
        if (!card) {
          console.log("No se encontró una .obra-card");
          return;
        }
        
        const index = card.getAttribute("data-index");
        if (!index) {
          console.log("No se encontró data-index en la card");
          return;
        }
        const obra = obras[index];

        modalBody.innerHTML = `
          <div class="modal-card p-4 bg-gray-50 rounded-lg shadow-md">
            <div class="modal-text mt-6 text-center">
              <h2 class="text-2xl font-serif text-green-800">${obra.title}</h2>
              <p><strong>Técnica:</strong> ${obra.technique}</p>
              <p><strong>Tamaño:</strong> ${obra.size || "No especificado"}</p>
              <p><strong>Precio:</strong> $${obra.price}</p>
              <p>${obra.description}</p>
              <a href="https://wa.me/5491167852021?text=Hola%20Lorena,%20estoy%20interesado/a%20en%20la%20obra%20'${encodeURIComponent(obra.title)}'" 
                target="_blank" 
                class="btn-whatsapp bg-green-500 text-white px-4 py-2 rounded-lg mt-4 inline-block">
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        `;
        
        modal.classList.add("show");
        console.log("Modal debería estar visible ahora", modal.classList);

        // Temporalmente deshabilitado Swiper para pruebas
        // if (obra.images.length > 0) {
        //   new Swiper(".swiper-container-modal", {
        //     loop: obra.images.length >= 3,
        //     pagination: { el: ".swiper-pagination", clickable: true },
        //     navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        //     slidesPerView: 1,
        //     spaceBetween: 10,
        //   });
        // }
      });

      // Cerrar modal
      modalClose.addEventListener("click", () => {
        modal.classList.remove("show");
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show");
        }
      });

      // Cerrar modal con tecla Escape
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
          modal.classList.remove("show");
        }
      });
    } else {
      console.error("Uno o más elementos del modal no se encontraron:", { contenedor, modal, modalBody, modalClose });
    }
  });
});