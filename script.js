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

function getScrollTargetTop(section) {
  const mobileTitleBar = document.querySelector("#titleBar");
  const mobilePromo = document.querySelector(".mobile-header-promo");
  const desktopHeader = document.querySelector("#header");
  const isMobile = window.matchMedia("(max-width: 736px)").matches;
  const baseOffset = isMobile
    ? (mobileTitleBar instanceof HTMLElement ? mobileTitleBar.offsetHeight : 0) +
      (mobilePromo instanceof HTMLElement ? mobilePromo.offsetHeight : 0) +
      8
    : (desktopHeader instanceof HTMLElement ? desktopHeader.offsetHeight : 0) + 8;
  const orderAdjustment = section.id === "order" ? (isMobile ? 34 : 48) : 0;

  return Math.max(0, section.getBoundingClientRect().top + window.scrollY - baseOffset + orderAdjustment);
}

function smoothScrollTo(top, duration = 460) {
  const start = window.scrollY;
  const distance = top - start;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    window.scrollTo(0, start + distance * eased);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

document.querySelectorAll('#header a[href^="#"], #banner a[href^="#"], .goto-next[href^="#"], #titleBar .title a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const section = document.querySelector(href);

    if (!(section instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    smoothScrollTo(getScrollTargetTop(section));

    if (window.history && typeof window.history.pushState === "function") {
      window.history.pushState(null, "", href);
    }
  });
});

const galleryImageIds = [
  "09",
  "11",
  "14",
  "10",
  "01",
  "02",
  "03",
  "04",
  "05",
  "07",
  "08",
  "12",
  "13",
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
    src: id === "01" ? "assets/gallery-untitled-1.jpg" : `assets/gallery-current/veidrodistai-${id}.jpg`,
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
const galleryMore = document.querySelector("[data-gallery-more]");
const initialDesktopGalleryCount = 8;
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
  galleryGrid.querySelectorAll(".gallery-item").forEach((button, index) => {
    button.addEventListener("click", () => openGallery(index));
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

if (galleryMore && galleryImages.length <= initialDesktopGalleryCount) {
  galleryMore.hidden = true;
}

galleryClose?.addEventListener("click", closeGallery);
galleryPrev?.addEventListener("click", () => shiftGallery(-1));
galleryNext?.addEventListener("click", () => shiftGallery(1));
galleryMobilePrev?.addEventListener("click", () => scrollMobileGallery(-1));
galleryMobileNext?.addEventListener("click", () => scrollMobileGallery(1));
galleryMore?.addEventListener("click", () => {
  galleryGrid?.querySelectorAll(".gallery-item.is-hidden").forEach((item) => {
    item.classList.remove("is-hidden");
  });

  galleryMore.hidden = true;
});

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
