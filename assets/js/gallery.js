/**
 * Runtime gallery: groups consecutive markdown images, drives smart-gallery
 * layouts, and wires the lightbox. Layout switching is a single button that
 * cycles justified → masonry → grid.
 */
import GalleryLightbox from "./gallery-lightbox.js";
import SmartGallery from "./vendor/smart-gallery.js";

const LAYOUTS = ["justified", "masonry", "grid"];
const SWITCHER_TEMPLATE_ID = "gallery-layout-switcher";

function readJSONConfig(id) {
  const element = document.getElementById(id);
  if (!element?.textContent) return null;

  try {
    const parsed = JSON.parse(element.textContent);
    return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
  } catch (_) {
    return null;
  }
}

// 从 srcset 里挑一张略大于 480px 的缩略图，避免灯箱级别的大图进布局网格
function getPreviewSource(img) {
  const srcset = img.getAttribute("srcset");
  if (!srcset) return img.currentSrc || img.src;

  const candidates = srcset
    .split(",")
    .map((part) => {
      const [url, descriptor = ""] = part.trim().split(/\s+/);
      return { url, width: Number.parseInt(descriptor, 10) || 0 };
    })
    .filter((candidate) => candidate.url);

  if (candidates.length === 0) return img.currentSrc || img.src;

  candidates.sort((left, right) => left.width - right.width);
  const preferred = candidates.find((candidate) => candidate.width >= 480);
  return (preferred || candidates[candidates.length - 1]).url;
}

function readFigure(figure) {
  const img = figure.querySelector("img");
  if (!img) return null;

  const caption = figure.querySelector(".image-caption");
  const width = Number.parseInt(figure.dataset.imageWidth, 10) || img.naturalWidth || 800;
  const height = Number.parseInt(figure.dataset.imageHeight, 10) || img.naturalHeight || 600;

  return {
    previewSrc: getPreviewSource(img),
    fullSrc: figure.dataset.imageSrc || img.currentSrc || img.src,
    width,
    height,
    alt: img.alt || "",
    captionHTML: caption ? caption.innerHTML.trim() : "",
  };
}

function detectImageGroups(figures) {
  const groups = [];
  let currentGroup = [];

  figures.forEach((figure, index) => {
    currentGroup.push(figure);

    const nextFigure = figures[index + 1];
    if (nextFigure && areConsecutive(figure, nextFigure)) return;

    groups.push([...currentGroup]);
    currentGroup = [];
  });

  return groups;
}

// 只有中间隔空段落（<br> 或空元素）的相邻图片才算同一组
function areConsecutive(figure, nextFigure) {
  let current = figure.nextElementSibling;

  while (current && current !== nextFigure) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      if (current.matches(".image-figure, .gallery-layout-switcher, .smart-gallery-container")) {
        current = current.nextElementSibling;
        continue;
      }

      const tagName = current.tagName.toLowerCase();
      const text = current.textContent.trim();

      if (tagName === "br") {
        current = current.nextElementSibling;
        continue;
      }

      if (tagName === "p" && text === "") return false;
      if (text !== "") return false;
    }

    current = current.nextElementSibling;
  }

  return current === nextFigure;
}

function createLayoutSwitcher(template, layout, onSwitch) {
  const switcher = template?.content?.firstElementChild?.cloneNode(true);
  if (!switcher) return null;

  const button = switcher.querySelector(".layout-btn");
  const label = button?.getAttribute("aria-label") || "Switch gallery layout";
  let current = LAYOUTS.includes(layout) ? layout : LAYOUTS[0];

  // Keep the accessible name in sync with the active layout.
  const syncLabel = () => {
    button?.setAttribute("aria-label", `${label}: ${current}`);
    button?.setAttribute("title", `${label}: ${current}`);
  };

  syncLabel();
  button?.addEventListener("click", () => {
    current = LAYOUTS[(LAYOUTS.indexOf(current) + 1) % LAYOUTS.length];
    syncLabel();
    onSwitch(current);
  });

  return switcher;
}

function createGalleryGroup(figures, index, settings) {
  const items = figures.map(readFigure).filter(Boolean);
  if (items.length === 0) return;

  const container = document.createElement("div");
  container.className = "smart-gallery-container";
  container.id = `gallery-${index}`;

  const stage = document.createElement("div");
  stage.className = "smart-gallery";
  stage.id = `gallery-inner-${index}`;
  stage.dataset.lightboxEnabled = String(Boolean(settings.lightbox));

  let gallery = null;
  const switcher = createLayoutSwitcher(
    settings.switcherTemplate,
    settings.defaultLayout,
    (layout) => gallery?.setOptions({ layout })
  );

  if (switcher) container.append(switcher);
  container.append(stage);

  figures[0].parentNode.insertBefore(container, figures[0]);
  figures.forEach((figure) => figure.remove());

  if (settings.lightbox) {
    settings.lightbox.registerGallery(
      container.id,
      items.map((item) => ({
        src: item.fullSrc,
        width: item.width,
        height: item.height,
        alt: item.alt,
        captionHTML: item.captionHTML,
      }))
    );
  }

  gallery = new SmartGallery(stage, {
    placeholderColor: "transparent",
    ...settings.galleryOptions,
    layout: settings.defaultLayout,
    onItemClick: settings.lightbox
      ? ({ index: itemIndex, element }) =>
          settings.lightbox.open(container.id, itemIndex, { triggerElement: element })
      : null,
  });

  gallery.setItems(
    items.map((item) => ({
      src: item.previewSrc,
      width: item.width,
      height: item.height,
      aspectRatio: item.width / item.height,
    }))
  );
}

function openSingleImage(figure, lightbox, index) {
  const item = readFigure(figure);
  if (!item) return;

  const galleryId = `single-image-${index}`;
  lightbox.registerGallery(galleryId, [
    {
      src: item.fullSrc,
      width: item.width,
      height: item.height,
      alt: item.alt,
      captionHTML: item.captionHTML,
    },
  ]);

  figure.classList.add("single-image");
  const trigger = figure.querySelector(".image-container") || figure.querySelector("img");
  trigger.classList.add("lightbox-trigger");
  trigger.addEventListener("click", () => lightbox.open(galleryId, 0, { triggerElement: trigger }));
}

function initGallery() {
  const figures = [...document.querySelectorAll('.image-figure[data-gallery-type="auto"]')];
  if (figures.length === 0) return;

  const config = readJSONConfig("gallery-config") || {};
  const options = config.galleryOptions || {};
  const { defaultLayout, ...galleryOptions } = options;
  const initialLayout = LAYOUTS.includes(defaultLayout) ? defaultLayout : LAYOUTS[0];

  const lightbox = config.lightbox ? new GalleryLightbox() : null;
  const switcherTemplate = document.getElementById(SWITCHER_TEMPLATE_ID);
  let singleImageCount = 0;

  detectImageGroups(figures).forEach((group, index) => {
    if (group.length > 1 && config.gallery) {
      createGalleryGroup(group, index, {
        defaultLayout: initialLayout,
        galleryOptions,
        lightbox,
        switcherTemplate,
      });
      return;
    }

    if (!lightbox) return;
    group.forEach((figure) => {
      openSingleImage(figure, lightbox, singleImageCount);
      singleImageCount += 1;
    });
  });
}

initGallery();
