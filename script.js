const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const galleryImageIds = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "18",
  "19",
  "20",
  "22",
];

const galleryImages = galleryImageIds.map((id) => {
  return {
    id,
    src: `assets/gallery-current/veidrodistai-${id}.jpg`,
    alt: `Veidrodistai gaminio nuotrauka ${id}`,
  };
});

const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryDialog = document.querySelector("[data-gallery-dialog]");
const galleryDialogImage = document.querySelector("[data-gallery-dialog-image]");
const galleryCaption = document.querySelector("[data-gallery-caption]");
const galleryClose = document.querySelector("[data-gallery-close]");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
let activeGalleryIndex = 0;

function openGallery(index) {
  if (!(galleryDialog instanceof HTMLDialogElement) || !(galleryDialogImage instanceof HTMLImageElement)) {
    return;
  }

  activeGalleryIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[activeGalleryIndex];
  galleryDialogImage.src = image.src;
  galleryDialogImage.alt = image.alt;

  if (galleryCaption) {
    galleryCaption.textContent = `Veidrodistai darbų pavyzdys ${activeGalleryIndex + 1}`;
  }

  if (!galleryDialog.open) {
    galleryDialog.showModal();
  }
}

function closeGallery() {
  if (galleryDialog instanceof HTMLDialogElement && galleryDialog.open) {
    galleryDialog.close();
  }
}

function shiftGallery(direction) {
  openGallery(activeGalleryIndex + direction);
}

if (galleryGrid) {
  galleryImages.forEach((image, index) => {
    const button = document.createElement("button");
    button.className = "gallery-item";
    button.type = "button";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";

    button.append(img);
    button.addEventListener("click", () => openGallery(index));
    galleryGrid.append(button);
  });
}

galleryClose?.addEventListener("click", closeGallery);
galleryPrev?.addEventListener("click", () => shiftGallery(-1));
galleryNext?.addEventListener("click", () => shiftGallery(1));

galleryDialog?.addEventListener("click", (event) => {
  if (event.target === galleryDialog) {
    closeGallery();
  }
});

document.addEventListener("keydown", (event) => {
  if (!(galleryDialog instanceof HTMLDialogElement) || !galleryDialog.open) {
    return;
  }

  if (event.key === "ArrowLeft") {
    shiftGallery(-1);
  }

  if (event.key === "ArrowRight") {
    shiftGallery(1);
  }
});
