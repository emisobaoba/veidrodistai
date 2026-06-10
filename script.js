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
const galleryMobilePrev = document.querySelector("[data-gallery-mobile-prev]");
const galleryMobileNext = document.querySelector("[data-gallery-mobile-next]");
const galleryMobileCount = document.querySelector("[data-gallery-mobile-count]");
let activeGalleryIndex = 0;
let activeMobileGalleryIndex = 0;

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

function updateMobileGallery(index) {
  activeMobileGalleryIndex = (index + galleryImages.length) % galleryImages.length;

  if (galleryMobileCount) {
    galleryMobileCount.textContent = `${activeMobileGalleryIndex + 1} / ${galleryImages.length}`;
  }
}

function scrollMobileGallery(direction) {
  if (!galleryGrid) {
    return;
  }

  const nextIndex = activeMobileGalleryIndex + direction;
  const boundedIndex = Math.max(0, Math.min(galleryImages.length - 1, nextIndex));
  const target = galleryGrid.children[boundedIndex];

  if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    updateMobileGallery(boundedIndex);
  }
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

  updateMobileGallery(0);

  galleryGrid.addEventListener("scroll", () => {
    const firstItem = galleryGrid.querySelector(".gallery-item");

    if (!(firstItem instanceof HTMLElement)) {
      return;
    }

    const itemWidth = firstItem.offsetWidth + parseFloat(getComputedStyle(galleryGrid).gap || "0");
    const index = Math.round(galleryGrid.scrollLeft / itemWidth);
    updateMobileGallery(Math.max(0, Math.min(galleryImages.length - 1, index)));
  }, { passive: true });
}

galleryClose?.addEventListener("click", closeGallery);
galleryPrev?.addEventListener("click", () => shiftGallery(-1));
galleryNext?.addEventListener("click", () => shiftGallery(1));
galleryMobilePrev?.addEventListener("click", () => scrollMobileGallery(-1));
galleryMobileNext?.addEventListener("click", () => scrollMobileGallery(1));

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
