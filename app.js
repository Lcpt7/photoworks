const items = Array.isArray(window.galleryItems) ? window.galleryItems : [];
const galleryGrid = document.querySelector("#galleryGrid");
const heroMedia = document.querySelector("#heroMedia");
const filmStrip = document.querySelector("#filmStrip");
const searchInput = document.querySelector("#searchInput");
const sortMenu = document.querySelector("#sortMenu");
const sortButton = document.querySelector("#sortButton");
const sortLabel = document.querySelector("#sortLabel");
const sortOptions = Array.from(document.querySelectorAll("[data-sort]"));
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const lightbox = document.querySelector("#lightbox");
const lightboxBody = document.querySelector("#lightboxBody");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxInfo = document.querySelector("#lightboxInfo");
const lightboxDesc = document.querySelector("#lightboxDesc");
const closeLightbox = document.querySelector("#closeLightbox");
const prevItem = document.querySelector("#prevItem");
const nextItem = document.querySelector("#nextItem");
const cursorLight = document.querySelector(".cursor-light");

let activeFilter = "all";
let activeSort = "newest";
let visibleItems = [];
let activePreviewIndex = 0;

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function itemText(item) {
  return [item.title, item.subtitle, item.date, item.camera, item.location, item.description, ...(item.tags || [])].join(" ");
}

function sortedItems(source) {
  return [...source].sort((a, b) => {
    if (activeSort === "title") {
      return String(a.title).localeCompare(String(b.title), "zh-Hans-CN");
    }

    const direction = activeSort === "oldest" ? 1 : -1;
    return String(a.date || "").localeCompare(String(b.date || "")) * direction;
  });
}

function getVisibleItems() {
  const query = normalize(searchInput.value);
  const filtered = items.filter((item) => {
    const typeMatches = activeFilter === "all" || item.type === activeFilter;
    const queryMatches = !query || normalize(itemText(item)).includes(query);
    return typeMatches && queryMatches;
  });

  return sortedItems(filtered);
}

function mediaElement(item, isPreview = false) {
  if (item.type === "video") {
    const video = document.createElement("video");
    video.src = item.src;
    video.controls = isPreview;
    video.muted = !isPreview;
    video.loop = !isPreview;
    video.playsInline = true;
    video.preload = "metadata";
    if (!isPreview) {
      video.autoplay = true;
    }
    return video;
  }

  const img = document.createElement("img");
  img.src = item.src;
  img.alt = item.title || "作品照片";
  img.loading = isPreview ? "eager" : "lazy";
  img.decoding = "async";
  return img;
}

function renderHero() {
  const lead = items[0];
  heroMedia.replaceChildren();
  if (!lead) {
    return;
  }

  const media = mediaElement(lead);
  heroMedia.style.setProperty("--accent", lead.accent || "#b94735");
  heroMedia.append(media);
}

function renderSummary() {
  const tags = new Set(items.flatMap((item) => item.tags || []));
  document.querySelector("#photoCount").textContent = items.filter((item) => item.type === "photo").length;
  document.querySelector("#videoCount").textContent = items.filter((item) => item.type === "video").length;
  document.querySelector("#tagCount").textContent = tags.size;
}

function renderFilmStrip() {
  filmStrip.replaceChildren();
  items.slice(0, 8).forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "strip-item";
    button.type = "button";
    button.style.setProperty("--accent", item.accent || "#b94735");
    button.addEventListener("click", () => openLightbox(item));

    const media = mediaElement(item);
    const label = document.createElement("span");
    label.textContent = String(index + 1).padStart(2, "0");
    button.append(media, label);
    filmStrip.append(button);
  });
}

function renderGallery() {
  visibleItems = getVisibleItems();
  galleryGrid.replaceChildren();

  if (!visibleItems.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "没有匹配的作品";
    galleryGrid.append(empty);
    return;
  }

  visibleItems.forEach((item, index) => {
    const card = document.createElement("article");
    const isTall = item.height > item.width * 1.2;
    const isWide = item.width > item.height * 1.2;
    card.className = `work-card ${isTall ? "is-tall" : ""} ${isWide ? "is-wide" : ""}`;
    card.style.setProperty("--accent", item.accent || "#b94735");
    card.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;

    const button = document.createElement("button");
    button.className = "work-button";
    button.type = "button";
    button.addEventListener("click", () => openLightbox(item));

    const media = mediaElement(item);
    const overlay = document.createElement("div");
    overlay.className = "work-overlay";

    const metaTop = document.createElement("div");
    metaTop.className = "meta-top";

    const count = document.createElement("span");
    count.textContent = String(index + 1).padStart(2, "0");

    const type = document.createElement("span");
    type.textContent = item.type === "video" ? "视频" : "照片";

    const title = document.createElement("h3");
    title.textContent = item.title || "Untitled";

    const subtitle = document.createElement("span");
    subtitle.className = "work-subtitle";
    subtitle.textContent = item.subtitle || "";

    const meta = document.createElement("p");
    meta.textContent = [item.date, item.camera, item.location].filter(Boolean).join(" / ");

    const tagLine = document.createElement("div");
    tagLine.className = "tag-line";
    (item.tags || []).slice(0, 4).forEach((tag) => {
      const pill = document.createElement("span");
      pill.textContent = tag;
      tagLine.append(pill);
    });

    metaTop.append(count, type);
    overlay.append(metaTop, title);
    if (item.subtitle) {
      overlay.append(subtitle);
    }
    overlay.append(meta, tagLine);
    button.append(media, overlay);
    card.append(button);
    galleryGrid.append(card);
  });

  observeCards();
}

function openLightbox(item) {
  const nextIndex = visibleItems.findIndex((entry) => entry.src === item.src);
  activePreviewIndex = nextIndex >= 0 ? nextIndex : 0;
  renderLightboxItem();
  lightbox.showModal();
}

function renderLightboxItem() {
  const item = visibleItems[activePreviewIndex] || items[0];
  if (!item) {
    return;
  }

  lightboxBody.replaceChildren(mediaElement(item, true));
  lightboxTitle.textContent = item.subtitle ? `${item.title} · ${item.subtitle}` : item.title || "Untitled";
  lightboxInfo.textContent = [item.type, item.date, item.camera, item.location].filter(Boolean).join(" / ");
  lightboxDesc.textContent = item.description || "";
  lightbox.style.setProperty("--accent", item.accent || "#b94735");
}

function stepPreview(direction) {
  if (!visibleItems.length) {
    return;
  }

  activePreviewIndex = (activePreviewIndex + direction + visibleItems.length) % visibleItems.length;
  renderLightboxItem();
}

function closePreview() {
  lightbox.close();
  lightboxBody.replaceChildren();
}

function observeCards() {
  const cards = Array.from(document.querySelectorAll(".work-card"));
  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  cards.forEach((card) => observer.observe(card));
}

function updateCursorLight(event) {
  cursorLight.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
}

function updateParallax() {
  const media = heroMedia.querySelector("img, video");
  if (!media) {
    return;
  }

  const offset = Math.min(window.scrollY * 0.12, 70);
  media.style.transform = `translateY(${offset}px) scale(1.04)`;
}

function closeSortMenu() {
  sortMenu.classList.remove("is-open");
  sortButton.setAttribute("aria-expanded", "false");
}

function toggleSortMenu() {
  const isOpen = sortMenu.classList.toggle("is-open");
  sortButton.setAttribute("aria-expanded", String(isOpen));
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderGallery();
  });
});

sortButton.addEventListener("click", toggleSortMenu);
sortOptions.forEach((button) => {
  button.addEventListener("click", () => {
    activeSort = button.dataset.sort;
    sortLabel.textContent = button.textContent;
    sortOptions.forEach((option) => {
      const isActive = option === button;
      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-selected", String(isActive));
    });
    closeSortMenu();
    renderGallery();
  });
});

searchInput.addEventListener("input", renderGallery);
closeLightbox.addEventListener("click", closePreview);
prevItem.addEventListener("click", () => stepPreview(-1));
nextItem.addEventListener("click", () => stepPreview(1));
document.addEventListener("click", (event) => {
  if (!sortMenu.contains(event.target)) {
    closeSortMenu();
  }
});
window.addEventListener("pointermove", updateCursorLight, { passive: true });
window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSortMenu();
  }

  if (!lightbox.open) {
    return;
  }

  if (event.key === "Escape") {
    closePreview();
  }
  if (event.key === "ArrowLeft") {
    stepPreview(-1);
  }
  if (event.key === "ArrowRight") {
    stepPreview(1);
  }
});
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closePreview();
  }
});

renderHero();
renderSummary();
renderFilmStrip();
renderGallery();
