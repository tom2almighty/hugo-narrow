/**
 * 模块化图片画廊系统
 * 分离的灯箱和布局管理器
 */

// 灯箱管理器
class LightboxManager {
  constructor(config = {}) {
    this.config = config;
    this.instances = [];
  }

  initialize(container, galleryId) {
    if (typeof GLightbox === 'undefined') {
      console.error('GLightbox is not available');
      return null;
    }

    const options = {
      selector: `[data-gallery="${galleryId}"]`,
      touchNavigation: this.config.touchNavigation ?? this.config.touchnavigation ?? true,
      loop: this.config.loop ?? false,
      draggable: this.config.draggable ?? true,
      zoomable: this.config.zoomable ?? true,
      autoplayVideos: this.config.autoplayVideos ?? this.config.autoplayvideos ?? false,
      preload: this.config.preload ?? true,
      width: this.config.width ?? '90vw',
      height: this.config.height ?? '90vh',
      descPosition: this.config.descPosition ?? this.config.descposition ?? 'bottom'
    };


    try {
      const lightbox = GLightbox(options);
      
      this.instances.push({
        container: container,
        instance: lightbox,
        galleryId: galleryId
      });

      return lightbox;
    } catch (error) {
      console.error(`Error initializing GLightbox for ${galleryId}:`, error);
      return null;
    }
  }

  setupAttributes(link, img, caption) {
    const imgTitle = img.getAttribute('data-gallery-title') || img.title || '';
    const imgAlt = img.getAttribute('data-gallery-alt') || img.alt || '';

    let description = '';

    if (imgTitle && imgAlt && imgTitle !== imgAlt) {
      description = `<h4>${imgTitle}</h4><p>${imgAlt}</p>`;
    } else if (imgTitle) {
      description = `<h4>${imgTitle}</h4>`;
    } else if (imgAlt) {
      description = `<p>${imgAlt}</p>`;
    } else if (caption) {
      const captionText = caption.textContent.trim();
      if (captionText) {
        description = `<p>${captionText}</p>`;
      }
    }

    if (description) {
      link.setAttribute('data-description', description);
    }
  }

  destroy() {
    this.instances.forEach(instance => {
      try {
        if (instance.instance && instance.instance.destroy) {
          instance.instance.destroy();
        }
      } catch (error) {
        console.error(`Error destroying lightbox instance:`, error);
      }
    });
    this.instances = [];
  }
}

// Justified布局管理器
class JustifiedLayoutManager {
  constructor(config = {}) {
    this.config = config;
    this.instances = [];
  }

  initialize(container) {
    if (typeof fjGallery === 'undefined') {
      console.error('fjGallery is not available');
      return false;
    }
 
    const options = {
      itemSelector: '.fj-gallery-item',
      imageSelector: 'img',
      rowHeight: parseInt(this.config.rowHeight ?? this.config.rowheight) || 200,
      gutter: parseInt(this.config.gutter) || 10,
      lastRow: this.config.lastRow ?? this.config.lastrow ?? 'left',
      transitionDuration: this.config.transitionDuration ?? this.config.transitionduration ?? '0.3s',
      calculateItemsHeight: this.config.calculateItemsHeight ?? this.config.calculateitemsheight ?? false,
      resizeDebounce: parseInt(this.config.resizeDebounce ?? this.config.resizedebounce) || 100,
      rowHeightTolerance: parseFloat(this.config.rowHeightTolerance ?? this.config.rowheighttolerance) || 0.25,
      maxRowsCount: parseInt(this.config.maxRowsCount ?? this.config.maxrowscount) || Number.POSITIVE_INFINITY
    };
    // console.log('options:', options);
    // console.log('config', this.config);

    try {
      fjGallery([container], options);
      
      this.instances.push({
        container: container,
        options: options
      });

      return true;
    } catch (error) {
      console.error(`Error initializing fjGallery for ${container.id}:`, error);
      return false;
    }
  }

  resize() {
    this.instances.forEach(instance => {
      try {
        fjGallery([instance.container], 'resize');
      } catch (error) {
        console.error('Error resizing fjGallery:', error);
      }
    });
  }

  destroy() {
    this.instances.forEach(instance => {
      try {
        fjGallery([instance.container], 'destroy');
      } catch (error) {
        console.error('Error destroying fjGallery instance:', error);
      }
    });
    this.instances = [];
  }
}


// 主画廊控制器
class ImageGallery {

  constructor() {
    this.config = window.HUGO_GALLERY_CONFIG || {};
    const parseConfig = (config) => {
      if (typeof config === 'string') {
        try {
          return JSON.parse(config);
        } catch (e) {
          console.error('JSON parse error:', e);
          return {};
        }
      }
      return config || {};
    };

    this.lightboxManager = new LightboxManager(parseConfig(this.config.lightbox_options));
    this.justifiedManager = new JustifiedLayoutManager(parseConfig(this.config.justified));
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
  }

  processImages() {
    const imageFigures = document.querySelectorAll('.image-figure[data-gallery-type="auto"]');

    if (imageFigures.length === 0) return;

    const groups = this.detectImageGroups(imageFigures);

    groups.forEach((group, index) => {
      
      if (group.length > 1 && this.config.justified_gallery) {
        this.createJustifiedGalleryGroup(group, index);
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

  processIndividualImages(figures) {
    figures.forEach((figure, index) => {
      figure.classList.add('single-image');
      
      if (this.config.lightbox) {
        this.setupLightboxForSingleImage(figure, `single-${Date.now()}-${index}`);
      }
    });
  }

  createJustifiedGalleryGroup(figures, groupIndex) {
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'fj-gallery';
    galleryContainer.id = `fj-gallery-${groupIndex}`;

    figures.forEach(figure => {
      const img = figure.querySelector('img');
      const caption = figure.querySelector('.image-caption');

      if (img) {
        const item = document.createElement('div');
        item.className = 'fj-gallery-item';

        if (this.config.lightbox) {
          const link = document.createElement('a');
          link.href = img.getAttribute('data-gallery-src') || img.src;
          link.className = 'glightbox';
          link.setAttribute('data-gallery', galleryContainer.id);
          
          this.lightboxManager.setupAttributes(link, img, caption);

          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt || '';
          newImg.loading = 'lazy';

          if (img.naturalWidth && img.naturalHeight) {
            newImg.width = img.naturalWidth;
            newImg.height = img.naturalHeight;
          }

          link.appendChild(newImg);
          item.appendChild(link);
        } else {
          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt || '';
          newImg.loading = 'lazy';

          if (img.naturalWidth && img.naturalHeight) {
            newImg.width = img.naturalWidth;
            newImg.height = img.naturalHeight;
          }

          item.appendChild(newImg);
        }

        galleryContainer.appendChild(item);
      }
    });

    // 替换第一个图片并移除其他图片
    const firstFigure = figures[0];
    firstFigure.parentNode.insertBefore(galleryContainer, firstFigure);
    figures.forEach(figure => figure.remove());

    // 初始化布局
    this.justifiedManager.initialize(galleryContainer);

    // 初始化灯箱
    if (this.config.lightbox) {
      this.lightboxManager.initialize(galleryContainer, galleryContainer.id);
    }

    this.galleries.push({
      container: galleryContainer,
      id: galleryContainer.id,
      index: groupIndex
    });
  }

  setupLightboxForSingleImage(figure, galleryId) {
    const img = figure.querySelector('img');
    const caption = figure.querySelector('.image-caption');
    
    if (!img) return;

    const link = document.createElement('a');
    link.href = img.getAttribute('data-gallery-src') || img.src;
    link.className = 'glightbox';
    link.setAttribute('data-gallery', galleryId);

    this.lightboxManager.setupAttributes(link, img, caption);

    img.parentNode.insertBefore(link, img);
    link.appendChild(img);

    this.lightboxManager.initialize(figure, galleryId);
  }




  updateLayout() {
    this.justifiedManager.resize();
  }

  destroy() {
    this.justifiedManager.destroy();
    this.lightboxManager.destroy();
    this.galleries = [];
  }
}

// 初始化画廊功能
const imageGallery = new ImageGallery();

// 监听窗口大小变化
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    imageGallery.updateLayout();
  }, 250);
});

// 导出到全局作用域
window.ImageGallery = ImageGallery;
window.LightboxManager = LightboxManager;
window.JustifiedLayoutManager = JustifiedLayoutManager;