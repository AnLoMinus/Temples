document.addEventListener("DOMContentLoaded", async () => {
  let currentImageIndex = 0;
  let temples = [];
  let bsModal;

  try {
    bsModal = new bootstrap.Modal(document.getElementById("gallery-modal"));

    const response = await fetch("metadata.json");
    temples = await response.json();

    const galleryContainer = document.getElementById("gallery-container");

    temples.forEach((temple, index) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "col-md-6 col-lg-4";
      galleryItem.innerHTML = `
        <div class="gallery-item card h-100" data-temple="${temple.id}">
          <img src="../images/${temple.id}.webp" class="card-img-top" alt="${temple.name}"
               onerror="this.src='https://via.placeholder.com/300x200?text=Temple+${temple.id}'">
          <div class="card-body gallery-item-content">
              <h3 class="card-title">${temple.name}</h3>
              <p class="card-text">${temple.description.substring(0, 150)}...</p>
          </div>
        </div>
      `;

      galleryItem
        .querySelector(".gallery-item")
        .addEventListener("click", () => openModal(index));

      galleryContainer.appendChild(galleryItem);
    });

    const prevButton = document.querySelector(".modal-nav.prev");
    const nextButton = document.querySelector(".modal-nav.next");

    prevButton.addEventListener("click", () => navigateModal(-1));
    nextButton.addEventListener("click", () => navigateModal(1));

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") navigateModal(-1);
      if (e.key === "ArrowRight") navigateModal(1);
    });
  } catch (error) {
    console.error("Error loading temple designs:", error);
    document.getElementById("gallery-container").innerHTML = `
      <div class="col-12 text-center">
        <div class="alert alert-danger">אירעה שגיאה בטעינת העיצובים. נסו שוב מאוחר יותר.</div>
      </div>
    `;
  }

  function openModal(index) {
    currentImageIndex = index;
    updateModalContent();
    bsModal.show();
  }

  function navigateModal(direction) {
    currentImageIndex =
      (currentImageIndex + direction + temples.length) % temples.length;
    updateModalContent();
  }

  function updateModalContent() {
    const temple = temples[currentImageIndex];
    document.getElementById("modal-image").src = `../images/${temple.id}.webp`;
    document.getElementById("modal-title").textContent = temple.name;
    document.getElementById("modal-text").textContent = temple.description;
    document
      .getElementById("gallery-modal")
      .setAttribute("data-temple", temple.id);

    const description = document.getElementById("modalDescription");
    const toggleBtn = document.getElementById("toggleDescription");
    description.classList.remove("show");
    toggleBtn.innerHTML = '<i class="fas fa-info-circle"></i> הצג תיאור';
  }

  const heroCarousel = new bootstrap.Carousel(
    document.getElementById("heroCarousel"),
    {
      interval: 5000,
      fade: true,
      pause: "hover",
    }
  );

  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && st > 300) {
      heroCarousel.pause();
    } else if (st < 300) {
      heroCarousel.cycle();
    }
    lastScrollTop = st <= 0 ? 0 : st;
  });

  const toggleDescriptionBtn = document.getElementById("toggleDescription");
  const modalDescription = document.getElementById("modalDescription");

  toggleDescriptionBtn.addEventListener("click", () => {
    const isShowing = modalDescription.classList.toggle("show");
    toggleDescriptionBtn.innerHTML = isShowing
      ? '<i class="fas fa-times-circle"></i> הסתר תיאור'
      : '<i class="fas fa-info-circle"></i> הצג תיאור';
  });

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (modalDescription.classList.contains("show")) {
        const viewportHeight = window.innerHeight;
        const descriptionHeight = modalDescription.offsetHeight;
        if (descriptionHeight > viewportHeight * 0.5) {
          modalDescription.style.maxHeight = `${viewportHeight * 0.5}px`;
        }
      }
    }, 250);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  });
});
