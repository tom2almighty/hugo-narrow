/**
 * 模块化图片画廊系统 - 重构版
 * 使用 SmartGallery + PhotoSwipe 5
 */

// PhotoSwipe 灯箱管理器
class PhotoSwipeLightboxManager {
  constructor(config = {}) {
    this.config = config;
    this.lightboxInstances = new Map();
  }

  async initialize(galleryId, items) {
    if (typeof PhotoSwipeLightbox === 'undefined') {
      console.error('PhotoSwipe Lightbox is not available');
      return null;
    }

    const options = {
      gallerySelector: `#${galleryId}`,
      dataSource: items,
      pswpModule: () => {
        return new Promise((resolve) => {
          if (window.PhotoSwipe) {
            resolve(window.PhotoSwipe);
          } else {
            console.error('PhotoSwipe core module not loaded');
            resolve(null);
          }
        });
      },
      ...this.config
    };

    const lightbox = new PhotoSwipeLightbox(options);
    lightbox.init();

    this.lightboxInstances.set(galleryId, lightbox);
    return lightbox;
  }

  destroy() {
    this.lightboxInstances.forEach(lightbox => {
      if (lightbox && lightbox.destroy) {
        lightbox.destroy();
      }
    });
    this.lightboxInstances.clear();
  }
}

// SmartGallery 布局管理器
class SmartGalleryLayoutManager {
  constructor(config = {}) {
    this.config = config;
    this.instances = new Map();
  }

  initialize(container, items, layout) {
    if (typeof SmartGallery === 'undefined') {
      console.error('SmartGallery is not available');
      return null;
    }

    const options = {
      layout: layout || this.config.defaultLayout || this.config.defaultlayout || 'justified',
      gap: this.config.gap !== undefined ? parseInt(this.config.gap) : 10,
      targetRowHeight: this.config.targetRowHeight !== undefined ? parseInt(this.config.targetRowHeight) : (this.config.targetrowheight !== undefined ? parseInt(this.config.targetrowheight) : 300),
      lastRowBehavior: this.config.lastRowBehavior || this.config.lastrowbehavior || 'left',
      columnWidth: this.config.columnWidth !== undefined ? parseInt(this.config.columnWidth) : (this.config.columnwidth !== undefined ? parseInt(this.config.columnwidth) : 300),
      columns: this.config.columns !== undefined ? this.config.columns : 'auto',
      onItemClick: ({ index, event }) => {
        if (event && event.target.closest('.layout-btn')) {
          return;
        }
        const galleryId = container.id.replace('gallery-inner-', 'gallery-');
        this.triggerLightbox(galleryId, index);
      }
    };

    const gallery = new SmartGallery(container, options);
    gallery.addItems(items);
    gallery.render();

    this.instances.set(container.id, {
      gallery,
      container,
      items,
      currentLayout: options.layout
    });

    return gallery;
  }

  switchLayout(galleryId, newLayout) {
    const instance = this.instances.get(galleryId);
    if (!instance) return;

    instance.gallery.destroy();
    this.initialize(instance.container, instance.items, newLayout);
  }

  triggerLightbox(galleryId, index) {
    const event = new CustomEvent('gallery:openLightbox', {
      detail: { galleryId, index }
    });
    window.dispatchEvent(event);
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


// 主画廊控制器
class ImageGallery {
  constructor() {
    const rawConfig = window.HUGO_GALLERY_CONFIG || {};

    // 解析 JSON 字符串配置
    let galleryOptions = rawConfig.galleryOptions || {};
    let lightboxOptions = rawConfig.lightboxOptions || {};

    if (typeof galleryOptions === 'string') {
      try {
        galleryOptions = JSON.parse(galleryOptions);
      } catch (e) {
        console.error('Failed to parse galleryOptions:', e);
        galleryOptions = {};
      }
    }

    if (typeof lightboxOptions === 'string') {
      try {
        lightboxOptions = JSON.parse(lightboxOptions);
      } catch (e) {
        console.error('Failed to parse lightboxOptions:', e);
        lightboxOptions = {};
      }
    }

    this.config = {
      gallery: rawConfig.gallery,
      lightbox: rawConfig.lightbox,
      galleryOptions,
      lightboxOptions
    };

    this.layoutManager = new SmartGalleryLayoutManager(this.config.galleryOptions || {});
    this.lightboxManager = new PhotoSwipeLightboxManager(this.config.lightboxOptions || {});
    this.galleries = [];
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.processImages();
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('gallery:openLightbox', (e) => {
      const { galleryId, index } = e.detail;
      const gallery = this.galleries.find(g => g.id === galleryId);
      if (gallery && gallery.lightbox) {
        gallery.lightbox.loadAndOpen(index);
      }
    });
  }

  processImages() {
    const imageFigures = document.querySelectorAll('.image-figure[data-gallery-type="auto"]');
    if (imageFigures.length === 0) return;

    const groups = this.detectImageGroups(imageFigures);

    // 使用 async/await 处理异步初始化
    groups.forEach(async (group, index) => {
      if (group.length > 1 && this.config.gallery) {
        await this.createGalleryGroup(group, index);
      } else {
        this.processIndividualImages(group);
      }
    });
  }

  detectImageGroups(figures) {
    const groups = [];
    let currentGroup = [];

    for (let i = 0; i < figures.length; i++) {
      const figure = figures[i];
      const nextFigure = figures[i + 1];

      currentGroup.push(figure);

      if (nextFigure && this.areConsecutiveByEmptyLine(figure, nextFigure)) {
        continue;
      } else {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
          currentGroup = [];
        }
      }
    }

    if (currentGroup.length > 0) {
      groups.push([...currentGroup]);
    }

    return groups;
  }

  areConsecutiveByEmptyLine(figure1, figure2) {
    let current = figure1.nextElementSibling;

    while (current && current !== figure2) {
      if (current.nodeType === Node.TEXT_NODE) {
        const text = current.textContent.trim();
        if (text === '') {
          current = current.nextElementSibling;
          continue;
        }
        return false;
      }

      if (current.nodeType === Node.ELEMENT_NODE) {
        if (current.matches('.image-figure')) {
          current = current.nextElementSibling;
          continue;
        }

        const tagName = current.tagName.toLowerCase();
        const text = current.textContent.trim();

        if (tagName === 'p' && text === '') {
          return false;
        } else if (tagName === 'br') {
          current = current.nextElementSibling;
          continue;
        } else if (text !== '') {
          return false;
        }
        current = current.nextElementSibling;
      }
    }

    return current === figure2;
  }

  async createGalleryGroup(figures, groupIndex) {
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'smart-gallery-container';
    galleryContainer.id = `gallery-${groupIndex}`;

    // 创建布局切换器
    if (this.config.galleryOptions?.showLayoutSwitcher !== false) {
      const switcher = this.createLayoutSwitcher(galleryContainer.id);
      galleryContainer.appendChild(switcher);
    }

    // 创建图库容器
    const galleryInner = document.createElement('div');
    galleryInner.className = 'smart-gallery';
    galleryInner.id = `gallery-inner-${groupIndex}`;
    galleryContainer.appendChild(galleryInner);

    // 提取图片数据
    const items = [];
    const lightboxItems = [];

    figures.forEach(figure => {
      const img = figure.querySelector('img');
      const caption = figure.querySelector('.image-caption');

      if (img) {
        const src = figure.getAttribute('data-image-src') || img.src;
        const width = parseInt(figure.getAttribute('data-image-width')) || img.naturalWidth || 800;
        const height = parseInt(figure.getAttribute('data-image-height')) || img.naturalHeight || 600;

        items.push({
          src: img.src,
          width,
          height,
          aspectRatio: width / height
        });

        lightboxItems.push({
          src: src,
          width,
          height,
          alt: img.alt || '',
          caption: caption ? caption.textContent.trim() : ''
        });
      }
    });

    // 替换原始图片
    const firstFigure = figures[0];
    firstFigure.parentNode.insertBefore(galleryContainer, firstFigure);
    figures.forEach(figure => figure.remove());

    // 初始化 SmartGallery
    const defaultLayout = this.config.galleryOptions?.defaultLayout || this.config.galleryOptions?.defaultlayout || 'justified';
    this.layoutManager.initialize(galleryInner, items, defaultLayout);

    // 初始化 PhotoSwipe
    let lightbox = null;
    if (this.config.lightbox) {
      lightbox = await this.lightboxManager.initialize(galleryContainer.id, lightboxItems);
    }

    this.galleries.push({
      container: galleryContainer,
      id: galleryContainer.id,
      index: groupIndex,
      lightbox
    });
  }

  createLayoutSwitcher(galleryId) {
    const switcher = document.createElement('div');
    switcher.className = 'gallery-layout-switcher';
    switcher.innerHTML = `
      <button class="layout-btn" data-layout="justified" title="Justified Layout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
        </svg>
      </button>
      <button class="layout-btn" data-layout="masonry" title="Masonry Layout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="5"/>
          <rect x="3" y="12" width="7" height="9"/>
          <rect x="14" y="3" width="7" height="9"/>
          <rect x="14" y="16" width="7" height="5"/>
        </svg>
      </button>
      <button class="layout-btn" data-layout="grid" title="Grid Layout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
        </svg>
      </button>
    `;

    switcher.querySelectorAll('.layout-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const layout = btn.getAttribute('data-layout');
        const innerGalleryId = galleryId.replace('gallery-', 'gallery-inner-');
        this.layoutManager.switchLayout(innerGalleryId, layout);

        switcher.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // 设置默认激活状态
    const defaultLayout = this.config.galleryOptions?.defaultLayout || 'justified';
    const defaultBtn = switcher.querySelector(`[data-layout="${defaultLayout}"]`);
    if (defaultBtn) defaultBtn.classList.add('active');

    return switcher;
  }

  processIndividualImages(figures) {
    if (!this.config.lightbox) return;

    figures.forEach((figure) => {
      figure.classList.add('single-image');

      const img = figure.querySelector('img');
      const caption = figure.querySelector('.image-caption');

      if (!img) return;

      const src = figure.getAttribute('data-image-src') || img.src;
      const width = parseInt(figure.getAttribute('data-image-width')) || img.naturalWidth || 800;
      const height = parseInt(figure.getAttribute('data-image-height')) || img.naturalHeight || 600;

      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        const lightbox = new PhotoSwipeLightbox({
          dataSource: [{
            src: src,
            width,
            height,
            alt: img.alt || '',
            caption: caption ? caption.textContent.trim() : ''
          }],
          pswpModule: () => {
            return new Promise((resolve) => {
              if (window.PhotoSwipe) {
                resolve(window.PhotoSwipe);
              } else {
                console.error('PhotoSwipe core module not loaded');
                resolve(null);
              }
            });
          },
          ...this.config.lightboxOptions
        });
        lightbox.init();
        lightbox.loadAndOpen(0);
      });
    });
  }

  destroy() {
    this.layoutManager.destroy();
    this.lightboxManager.destroy();
    this.galleries = [];
  }
}

// 初始化画廊功能
const imageGallery = new ImageGallery();

// 导出到全局作用域
window.ImageGallery = ImageGallery;