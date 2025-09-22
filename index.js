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

  // Inicializar Swiper del hero
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

  // Datos de obras - ACTUALIZADOS con múltiples imágenes
  const obras = [
    {
      title: "Libro de Búhos y Lechuzas",
      year: 2023,
      technique: "Libro",
      price: 50000,
      description: "Libro de búhos, lechuzas, flores y plumas. Hecho con acuarela y tinta. Sus páginas son una travesía interna que solo cada uno de nosotros podrá expresar.",
      images: [ "obra1f.png", "obra1a.png", "obra1b.png", "obra1c.png", "obra1d.png", "obra1e.png"], // Múltiples imágenes
    },
    {
      title: "Miradas desde la oscuridad",
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
      images: ["obra5a.png", "obra5a.png"], 
    },
    {
      title: "Siempre Azul",
      year: 2018,
      technique: "Acrílico",
      size: "1,05 m x 1,35 m",
      price: 90000,
      description: "Cuerpos diminutos albergan un sentido de felicidad absoluta con la pareja elegida. De por vida unidos por lazos invisbles e inquebrantables. Frágiles y poderosos. Combinación fascinante...",
      images: ["obra6a.png", "obra6b.png", "obra6c.png"],
    },
    {
      title: "Pack postales (1)",
      year: 2024,
      technique: "Postales",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Pack de 4 postales.",
      images: ["obra7a.png", "obra7b.png"],
    },
    {
      title: "Libro Aruor",
      year: 2024,
      technique: "Libro",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Libro Aruor.",
      images: ["obra8a.png", "obra8b.png"],
    },
    {
      title: "Libro del Agua",
      year: 2023,
      technique: "Libro",
      size: "?",
      price: 50000,
      description: "Las páginas de este libro prometen sumergirnos en una travesía profunda para que el tiempo se detenga y las voces externas e internas se apacígüen en un mar de colores y formas.",
      images: ["obra9a.png", "obra9b.png"],
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
      images: ["obra11a.png" , "obra11b.png"],
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
      images: ["obra13a.png", "obra13b.png", "obra13c.png"],
    },
    {
      title: "Pack postales (2)",
      year: 2024,
      technique: "Postales",
      size: "120 cm x 120 cm",
      price: 90000,
      description: "Pack de 4 postales.",
      images: ["obra14a.png", "obra14b.png", "obra14c.png", "obra14d.png"],
    },
    {
      title: "Guardianes en el Oceano",
      year: 2018,
      technique: "Acrílico",
      size: "1,36 m x 1,52 m",
      price: 90000,
      description: "Los mal afamados tiburones, son los verdaderos protectores de las barreras coralinas y de la diversidad de especies del océano. Y esto es lo que no vemos en las películas... -Miedo- debería darnos su ausencia en los mares.",
      images: ["obra15a.png", "obra15b.png"],
    },
    // Obras con técnicas adicionales
  /*   {
      title: "Flores del Mar",
      year: 2022,
      technique: "Acuarelas",
      size: "30 cm x 40 cm",
      price: 25000,
      description: "Delicadas acuarelas que capturan la esencia de la vida marina.",
      images: ["obra1a.png", "obra2a.png"], // Usando imágenes existentes como placeholder
    },
    {
      title: "Baúl de los Tesoros Marinos",
      year: 2023,
      technique: "Baúles y arcones",
      size: "50 cm x 30 cm x 25 cm",
      price: 75000,
      description: "Baúl artístico decorado con motivos marinos.",
      images: ["obra2a.png", "obra3a.png"],
    },
    {
      title: "Ilustración Coral",
      year: 2023,
      technique: "Ilustraciones",
      size: "A4",
      price: 15000,
      description: "Ilustración detallada de un arrecife de coral.",
      images: ["obra3a.png", "obra4a.png", "obra5a.png"],
    } */
  ];

  // Variable global para guardar el índice de la obra en el array original
  let obraIndexMap = [];

  // Función renderObras actualizada
  function renderObras(filteredObras) {
    const contenedor = document.getElementById("obras-container");
    if (!contenedor) {
      console.error("Contenedor no encontrado");
      return;
    }
    
    console.log("Renderizando obras:", filteredObras);
    contenedor.innerHTML = "";
    
    // Limpiar el mapeo de índices
    obraIndexMap = [];
    
    if (filteredObras.length === 0) {
      contenedor.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
          Coming soon...
        </div>
      `;
    } else {
      contenedor.innerHTML = filteredObras.map((obra, displayIndex) => {
        const firstImage = obra.images[0] || "placeholder.png";
        // Encontrar el índice original de la obra
        const originalIndex = obras.findIndex(o => o.title === obra.title && o.year === obra.year);
        obraIndexMap[displayIndex] = originalIndex;
        
        // Mostrar indicador si hay múltiples imágenes
        const imageIndicator = obra.images.length > 1 ? 
          `<div class="image-count-indicator">${obra.images.length} fotos</div>` : '';
        
        return `
          <div class="obra-card" data-technique="${obra.technique}" data-display-index="${displayIndex}">
            <div class="obra-image-container">
              <img src="img/${firstImage}" alt="${obra.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/280'; console.log('Imagen ${firstImage} no encontrada, usando placeholder');">
              ${imageIndicator}
            </div>
            <h3>${obra.title}</h3>
            <p>${obra.technique}</p>
            <p class="price">$${obra.price.toLocaleString()}</p>
          </div>
        `;
      }).join("");
    }
  }

  // Renderizar todas las obras inicialmente
  renderObras(obras);

  // Filtros
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("Filtro clickeado:", btn.dataset.filter);
      
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      
      const filter = btn.dataset.filter;
      let filteredObras;
      
      if (filter === "all") {
        filteredObras = obras;
      } else {
        // Dividir el filtro por comas para manejar múltiples categorías
        const categories = filter.split(',');
        filteredObras = obras.filter((obra) => 
          categories.includes(obra.technique)
        );
      }
      
      console.log("Obras filtradas:", filteredObras);
      renderObras(filteredObras);
    });
  });


  // Modal con carrusel de imágenes
  const contenedor = document.getElementById("obras-container");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = modal ? modal.querySelector(".modal-close") : null;

  if (contenedor && modal && modalBody && modalClose) {
    contenedor.addEventListener("click", (e) => {
      const card = e.target.closest(".obra-card");
      if (!card) return;
      
      const displayIndex = card.getAttribute("data-display-index");
      if (displayIndex === null) return;
      
      // Obtener el índice original de la obra
      const originalIndex = obraIndexMap[displayIndex];
      const obra = obras[originalIndex];
      
      if (!obra) return;
      
      // Crear el HTML del modal con carrusel de imágenes
      const swiperSlides = obra.images.map(image => `
        <div class="swiper-slide">
          <img src="img/${image}" alt="${obra.title}" onerror="this.src='https://via.placeholder.com/600x400';">
        </div>
      `).join('');
      
      modalBody.innerHTML = `
        <div class="modal-card">
          <!-- Carrusel de imágenes -->
          <div class="modal-image-section">
            ${obra.images.length > 1 ? `
              <div class="swiper modal-swiper">
                <div class="swiper-wrapper">
                  ${swiperSlides}
                </div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-pagination"></div>
              </div>
            ` : `
              <div class="single-image">
                <img src="img/${obra.images[0]}" alt="${obra.title}" onerror="this.src='https://via.placeholder.com/600x400';">
              </div>
            `}
          </div>
          
          <!-- Información de la obra -->
          <div class="modal-text">
            <h2>${obra.title}</h2>
            <div class="obra-details">
              <p><strong>Técnica:</strong> ${obra.technique}</p>
              <p><strong>Año:</strong> ${obra.year}</p>
              <p><strong>Tamaño:</strong> ${obra.size || "No especificado"}</p>
              <p><strong>Precio:</strong> $${obra.price.toLocaleString()}</p>
            </div>
            <p class="obra-description">${obra.description}</p>
            <a href="https://wa.me/5491167852021?text=Hola%20Lorena,%20estoy%20interesado/a%20en%20la%20obra%20'${encodeURIComponent(obra.title)}'" 
              target="_blank" 
              class="btn-whatsapp">
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      `;
      
      modal.classList.add("show");
      
      // Inicializar Swiper del modal solo si hay múltiples imágenes
      if (obra.images.length > 1) {
        setTimeout(() => {
          new Swiper(".modal-swiper", {
            loop: obra.images.length > 2, // Solo loop si hay más de 2 imágenes
            navigation: {
              nextEl: ".modal-swiper .swiper-button-next",
              prevEl: ".modal-swiper .swiper-button-prev",
            },
            pagination: {
              el: ".modal-swiper .swiper-pagination",
              clickable: true,
              dynamicBullets: true,
            },
            slidesPerView: 1,
            spaceBetween: 0,
            keyboard: {
              enabled: true,
            },
            mousewheel: false,
          });
        }, 100); // Pequeño delay para asegurar que el DOM esté listo
      }
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
  }
});