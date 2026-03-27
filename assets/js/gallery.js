import GalleryLightbox from './gallery-lightbox.js';

function readJSONConfig(id) {
  const configElement = document.getElementById(id);
  if (!configElement || !configElement.textContent) return null;

  try {
    const parsed = JSON.parse(configElement.textContent);
    return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
  } catch (_) {
    return null;
  }
}

class SmartGalleryLayoutManager {
  constructor(config = {}) {
    this.config = config;
    this.instances = new Map();
  }

  initialize(container, items, layout, onItemClick) {
    if (typeof SmartGallery === 'undefined') {
      console.error('SmartGallery is not available');
      return null;
    }

    const options = {
      layout: layout || this.config.defaultLayout || this.config.defaultlayout || 'justified',
      gap: this.config.gap !== undefined ? parseInt(this.config.gap, 10) : 10,
      targetRowHeight: this.config.targetRowHeight !== undefined
        ? parseInt(this.config.targetRowHeight, 10)
        : (this.config.targetrowheight !== undefined ? parseInt(this.config.targetrowheight, 10) : 300),
      lastRowBehavior: this.config.lastRowBehavior || this.config.lastrowbehavior || 'left',
      columnWidth: this.config.columnWidth !== undefined
        ? parseInt(this.config.columnWidth, 10)
        : (this.config.columnwidth !== undefined ? parseInt(this.config.columnwidth, 10) : 300),
      columns: this.config.columns !== undefined ? this.config.columns : 'auto',
      placeholderColor: 'transparent',
      onItemClick: ({ index, originalEvent }) => {
        if (originalEvent && originalEvent.target && originalEvent.target.closest('.layout-btn')) {
          return;
        }

        if (typeof onItemClick === 'function') {
          onItemClick(index, originalEvent);
        }
      }
    };

    const gallery = new SmartGallery(container, options);
    gallery.addItems(items);
    gallery.render();

    this.instances.set(container.id, {
      gallery,
      container,
      items,
      onItemClick
    });

    return gallery;
  }

  switchLayout(containerId, newLayout) {
    const instance = this.instances.get(containerId);
    if (!instance) {
      return;
    }

    instance.gallery.destroy();
    this.instances.delete(containerId);
    this.initialize(instance.container, instance.items, newLayout, instance.onItemClick);
  }

  destroy() {
    this.instances.forEach(({ gallery }) => {
      if (gallery && gallery.destroy) {
        gallery.destroy();
      }
    });

    this.instances.clear();
  }
}

class ImageGallery {
  constructor() {
    const rawConfig = readJSONConfig('gallery-config') || {};
    const galleryOptions = rawConfig.galleryOptions || {};

    this.config = {
      gallery: rawConfig.gallery,
      lightbox: rawConfig.lightbox,
      galleryOptions
    };

    this.layoutManager = new SmartGalleryLayoutManager(galleryOptions);
    this.lightbox = this.config.lightbox ? new GalleryLightbox() : null;
    this.singleImageCount = 0;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup(), { once: true });
    } else {
      this.setup();
    }
  }

  setup() {
    this.processImages();
  }

  processImages() {
    const imageFigures = document.querySelectorAll('.image-figure[data-gallery-type="auto"]');
    if (imageFigures.length === 0) {
      return;
    }

    const groups = this.detectImageGroups(imageFigures);

    groups.forEach((group, index) => {
      if (group.length > 1 && this.config.gallery) {
        this.createGalleryGroup(group, index);
      } else {
        this.processIndividualImages(group);
      }
    });
  }

  detectImageGroups(figures) {
    const groups = [];
    let currentGroup = [];

    for (let i = 0; i < figures.length; i += 1) {
      const figure = figures[i];
      const nextFigure = figures[i + 1];

      currentGroup.push(figure);

      if (nextFigure && this.areConsecutiveByEmptyLine(figure, nextFigure)) {
        continue;
      }

      groups.push([...currentGroup]);
      currentGroup = [];
    }

    return groups;
  }

  areConsecutiveByEmptyLine(figure1, figure2) {
    let current = figure1.nextElementSibling;

    while (current && current !== figure2) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        if (current.matches('.image-figure, .gallery-layout-switcher, .smart-gallery-container')) {
          current = current.nextElementSibling;
          continue;
        }

        const tagName = current.tagName.toLowerCase();
        const text = current.textContent.trim();

        if (tagName === 'br') {
          current = current.nextElementSibling;
          continue;
        }

        if (tagName === 'p' && text === '') {
          return false;
        }

        if (text !== '') {
          return false;
        }
      }

      current = current.nextElementSibling;
    }

    return current === figure2;
  }

  createGalleryGroup(figures, groupIndex) {
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'smart-gallery-container';
    galleryContainer.id = 'gallery-' + String(groupIndex);

    const galleryInner = document.createElement('div');
    galleryInner.className = 'smart-gallery';
    galleryInner.id = 'gallery-inner-' + String(groupIndex);
    galleryInner.dataset.lightboxEnabled = this.lightbox ? 'true' : 'false';

    const layoutItems = [];
    const lightboxItems = [];

    figures.forEach((figure) => {
      const img = figure.querySelector('img');
      const caption = figure.querySelector('.image-caption');

      if (!img) {
        return;
      }

      const fullSizeSrc = figure.getAttribute('data-image-src') || img.currentSrc || img.src;
      const previewSrc = img.currentSrc || img.src;
      const width = parseInt(figure.getAttribute('data-image-width'), 10) || img.naturalWidth || 800;
      const height = parseInt(figure.getAttribute('data-image-height'), 10) || img.naturalHeight || 600;

      layoutItems.push({
        src: previewSrc,
        width,
        height,
        aspectRatio: width / height
      });

      lightboxItems.push({
        src: fullSizeSrc,
        width,
        height,
        alt: img.alt || '',
        captionHTML: caption ? caption.innerHTML.trim() : ''
      });
    });

    if (layoutItems.length === 0) {
      return;
    }

    const defaultLayout = this.config.galleryOptions.defaultLayout || this.config.galleryOptions.defaultlayout || 'justified';
    const switcher = this.createLayoutSwitcher(defaultLayout, (newLayout) => {
      this.layoutManager.switchLayout(galleryInner.id, newLayout);
    });

    galleryContainer.appendChild(switcher);
    galleryContainer.appendChild(galleryInner);

    const firstFigure = figures[0];
    firstFigure.parentNode.insertBefore(galleryContainer, firstFigure);
    figures.forEach((figure) => figure.remove());

    if (this.lightbox) {
      this.lightbox.registerGallery(galleryContainer.id, lightboxItems);
    }

    this.layoutManager.initialize(galleryInner, layoutItems, defaultLayout, (index, originalEvent) => {
      if (this.lightbox) {
        const triggerElement = originalEvent && originalEvent.target
          ? originalEvent.target.closest('.sg-item')
          : null;
        this.lightbox.open(galleryContainer.id, index, { triggerElement });
      }
    });
  }

  createLayoutSwitcher(defaultLayout, onSwitch) {
    const switcher = document.createElement('div');
    switcher.className = 'gallery-layout-switcher';
    switcher.innerHTML = [
      '<button class="layout-btn" data-layout="justified" title="Justified Layout" aria-label="Switch to justified gallery layout">',
      '  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
      '    <rect x="3" y="4" width="18" height="5" rx="1"/>',
      '    <rect x="3" y="11" width="8" height="9" rx="1"/>',
      '    <rect x="13" y="11" width="8" height="9" rx="1"/>',
      '  </svg>',
      '</button>',
      '<button class="layout-btn" data-layout="masonry" title="Masonry Layout" aria-label="Switch to masonry gallery layout">',
      '  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
      '    <rect x="3" y="3" width="7" height="7" rx="1"/>',
      '    <rect x="3" y="12" width="7" height="9" rx="1"/>',
      '    <rect x="14" y="3" width="7" height="11" rx="1"/>',
      '    <rect x="14" y="16" width="7" height="5" rx="1"/>',
      '  </svg>',
      '</button>',
      '<button class="layout-btn" data-layout="grid" title="Grid Layout" aria-label="Switch to grid gallery layout">',
      '  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
      '    <rect x="3" y="3" width="7" height="7" rx="1"/>',
      '    <rect x="14" y="3" width="7" height="7" rx="1"/>',
      '    <rect x="3" y="14" width="7" height="7" rx="1"/>',
      '    <rect x="14" y="14" width="7" height="7" rx="1"/>',
      '  </svg>',
      '</button>'
    ].join('');

    switcher.querySelectorAll('.layout-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const layout = button.getAttribute('data-layout');
        onSwitch(layout);

        switcher.querySelectorAll('.layout-btn').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
      });
    });

    const activeButton = switcher.querySelector('[data-layout="' + defaultLayout + '"]');
    if (activeButton) {
      activeButton.classList.add('active');
    }

    return switcher;
  }

  processIndividualImages(figures) {
    if (!this.lightbox) {
      return;
    }

    figures.forEach((figure) => {
      const img = figure.querySelector('img');
      const caption = figure.querySelector('.image-caption');
      if (!img) {
        return;
      }

      const galleryId = 'single-image-' + String(this.singleImageCount);
      this.singleImageCount += 1;

      const src = figure.getAttribute('data-image-src') || img.currentSrc || img.src;
      const width = parseInt(figure.getAttribute('data-image-width'), 10) || img.naturalWidth || 800;
      const height = parseInt(figure.getAttribute('data-image-height'), 10) || img.naturalHeight || 600;

      this.lightbox.registerGallery(galleryId, [{
        src,
        width,
        height,
        alt: img.alt || '',
        captionHTML: caption ? caption.innerHTML.trim() : ''
      }]);

      figure.classList.add('single-image');
      const trigger = figure.querySelector('.image-container') || img;
      trigger.classList.add('lightbox-trigger');
      trigger.addEventListener('click', () => {
        this.lightbox.open(galleryId, 0, { triggerElement: trigger });
      });
    });
  }

  destroy() {
    this.layoutManager.destroy();
    if (this.lightbox) {
      this.lightbox.destroy();
    }
  }
}

const imageGallery = new ImageGallery();

window.ImageGallery = ImageGallery;
window.imageGallery = imageGallery;
