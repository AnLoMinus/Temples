document.addEventListener("DOMContentLoaded", async () => {
  let currentImageIndex = 0;
  let temples = [];
  let bsModal;

  try {
    // Initialize Bootstrap modal
    bsModal = new bootstrap.Modal(document.getElementById("gallery-modal"));

    // Fetch the metadata
    const response = await fetch("metadata.json");
    temples = await response.json();

    // Get the gallery container
    const galleryContainer = document.getElementById("gallery-container");

    // Create gallery items
    temples.forEach((temple, index) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "col-md-6 col-lg-4";
      galleryItem.innerHTML = `
        <div class="gallery-item card h-100" data-temple="${temple.id}">
          <img src="images/${temple.id}.webp" class="card-img-top" alt="${
        temple.name
      }" 
               onerror="this.src='https://via.placeholder.com/300x200?text=Temple+${
                 temple.id
               }'">
          <div class="card-body gallery-item-content">
              <h3 class="card-title">${temple.name}</h3>
              <p class="card-text">${temple.description.substring(
                0,
                150
              )}...</p>
          </div>
        </div>
      `;

      // Add click event to open modal
      galleryItem
        .querySelector(".gallery-item")
        .addEventListener("click", () => openModal(index));

      galleryContainer.appendChild(galleryItem);
    });

    // Modal navigation
    const prevButton = document.querySelector(".modal-nav.prev");
    const nextButton = document.querySelector(".modal-nav.next");

    prevButton.addEventListener("click", () => navigateModal(-1));
    nextButton.addEventListener("click", () => navigateModal(1));

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") navigateModal(-1);
      if (e.key === "ArrowRight") navigateModal(1);
    });
  } catch (error) {
    console.error("Error loading temple designs:", error);
    document.getElementById("gallery-container").innerHTML = `
      <div class="col-12 text-center">
        <div class="alert alert-danger">Error loading temple designs. Please try again later.</div>
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
    document.getElementById("modal-image").src = `images/${temple.id}.webp`;
    document.getElementById("modal-title").textContent = temple.name;
    document.getElementById("modal-text").textContent = temple.description;
    document
      .getElementById("gallery-modal")
      .setAttribute("data-temple", temple.id);

    // Reset description state
    const description = document.getElementById("modalDescription");
    const toggleBtn = document.getElementById("toggleDescription");
    description.classList.remove("show");
    toggleBtn.innerHTML = '<i class="fas fa-info-circle"></i> Show Description';
  }

  // Initialize the hero carousel with custom options
  const heroCarousel = new bootstrap.Carousel(
    document.getElementById("heroCarousel"),
    {
      interval: 5000, // Change slides every 5 seconds
      fade: true, // Use fade transition
      pause: "hover", // Pause on mouse hover
    }
  );

  // Optional: Pause carousel when scrolling down
  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && st > 300) {
      // Scrolling down and past hero section
      heroCarousel.pause();
    } else if (st < 300) {
      // Scrolled back to top
      heroCarousel.cycle();
    }
    lastScrollTop = st <= 0 ? 0 : st;
  });

  // Add this after initializing the modal
  const toggleDescriptionBtn = document.getElementById("toggleDescription");
  const modalDescription = document.getElementById("modalDescription");

  toggleDescriptionBtn.addEventListener("click", () => {
    const isShowing = modalDescription.classList.toggle("show");
    toggleDescriptionBtn.innerHTML = isShowing
      ? '<i class="fas fa-times-circle"></i> Hide Description'
      : '<i class="fas fa-info-circle"></i> Show Description';
  });

  // Add this to handle description visibility on window resize
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

// Smooth scrolling
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
