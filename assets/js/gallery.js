/**
 * 图片画廊功能 - lightGallery + Justified Gallery
 * 支持单图片居中显示和多图片Justified Gallery布局
 */

class ImageGallery {
  constructor() {
    this.lightGalleryInstances = [];
    this.justifiedGalleryInstances = [];
    this.config = window.HUGO_CONFIG?.gallery || {};
    this.galleries = [];
    this.init();
  }

  /**
   * 初始化画廊功能
   */
  init() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * 设置画廊功能
   */
  setup() {
    // 确保jQuery和库文件已加载
    this.loadDependencies().then(() => {
      this.processImages();
      this.setupImageLoading();

      if (this.config.justified_gallery) {
        this.initJustifiedGallery();
      }

      if (this.config.modal) {
        this.initLightGallery();
      }
    });
  }

  /**
   * 加载依赖库
   */
  loadDependencies() {
    return new Promise((resolve) => {
      // 检查jQuery是否已加载
      if (typeof jQuery === 'undefined') {
        console.error('Gallery: jQuery is required but not loaded');
        resolve();
        return;
      }

      // 检查lightGallery是否已加载
      if (typeof window.lightGallery === 'undefined') {
        console.error('Gallery: lightGallery is required but not loaded');
      }

      // 检查justifiedGallery是否已加载
      if (typeof jQuery.fn.justifiedGallery === 'undefined') {
        console.error('Gallery: justifiedGallery is required but not loaded');
      }

      resolve();
    });
  }

  /**
   * 处理页面中的图片，检测连续图片并分组
   */
  processImages() {
    const imageFigures = document.querySelectorAll('.image-figure');
    console.log('Gallery: Found', imageFigures.length, 'image figures');

    if (imageFigures.length === 0) return;

    // 检测连续的图片组
    const groups = this.detectImageGroups(imageFigures);
    console.log('Gallery: Detected', groups.length, 'image groups');

    // 处理每个组 - 简化逻辑
    groups.forEach((group, index) => {
      console.log(`Gallery: Group ${index} has ${group.length} images`);

      if (group.length > 1 && this.config.justified_gallery) {
        console.log(`Gallery: Creating justified gallery for group ${index} with ${group.length} images`);
        this.createJustifiedGalleryGroup(group, index);
      } else {
        console.log(`Gallery: Keeping group ${index} as individual images`);
        // 单张图片、分离图片或Justified Gallery未启用时，都保持原样
        this.processIndividualImages(group);
      }
    });
  }

  /**
   * 检测连续的图片组 - 基于空行分组
   */
  detectImageGroups(figures) {
    const groups = [];
    let currentGroup = [];

    for (let i = 0; i < figures.length; i++) {
      const figure = figures[i];
      const nextFigure = figures[i + 1];

      currentGroup.push(figure);

      // 检查是否为连续图片（基于空行分组）
      if (nextFigure && this.areConsecutiveByEmptyLine(figure, nextFigure)) {
        continue;
      } else {
        // 当前组结束，创建新组
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      }
    }

    // 处理最后一组
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }

  /**
   * 检查两个图片是否连续（正确的逻辑：只有中间没有空行才连续）
   */
  areConsecutiveByEmptyLine(figure1, figure2) {
    let current = figure1.nextElementSibling;

    while (current && current !== figure2) {
      // 跳过空白文本节点
      if (current.nodeType === Node.TEXT_NODE) {
        const text = current.textContent.trim();
        if (text === '') {
          current = current.nextElementSibling;
          continue;
        } else {
          // 有实际文本内容，不连续
          return false;
        }
      }

      // 检查元素节点
      if (current.nodeType === Node.ELEMENT_NODE) {
        // 如果是另一个图片figure，则连续
        if (current.matches('.image-figure')) {
          current = current.nextElementSibling;
          continue;
        }

        const tagName = current.tagName.toLowerCase();
        const text = current.textContent.trim();

        // 检查是否为空段落（这会断开连续性）
        if (tagName === 'p' && text === '') {
          // 有空段落，不连续
          return false;
        }
        // 允许换行（不断开连续性）
        else if (tagName === 'br') {
          current = current.nextElementSibling;
          continue;
        }
        // 任何有内容的元素都会断开连续性
        else if (text !== '') {
          return false;
        }
        // 其他空元素（如空的div等）
        else {
          current = current.nextElementSibling;
          continue;
        }
      }

      current = current.nextElementSibling;
    }

    // 只有找到了figure2且中间没有空段落或内容，才认为连续
    return current === figure2;
  }

  /**
   * 处理个体图片（单张图片、分离图片或Justified Gallery未启用的情况）
   */
  processIndividualImages(figures) {
    figures.forEach(figure => {
      figure.classList.add('single-image');
    });
  }

  /**
   * 创建Justified Gallery组
   */
  createJustifiedGalleryGroup(figures, groupIndex) {
    // 创建画廊容器
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'not-prose justified-gallery-container my-8';
    galleryContainer.setAttribute('data-gallery-group', groupIndex);
    galleryContainer.id = `justified-gallery-${groupIndex}`;

    // 将图片转换为lightGallery格式
    figures.forEach(figure => {
      const imageContainer = figure.querySelector('.image-container');
      const caption = figure.querySelector('.image-caption');
      const img = figure.querySelector('img');

      if (imageContainer && img) {
        // 创建lightGallery兼容的链接
        const galleryLink = document.createElement('a');
        galleryLink.className = 'gallery-item';

        // 设置lightGallery属性
        const imgSrc = img.src;
        const imgAlt = img.alt || '';
        const imgTitle = img.title || '';

        // 获取高分辨率图片URL（如果有的话）
        const highResUrl = img.getAttribute('data-src') || imgSrc;
        galleryLink.href = highResUrl;
        galleryLink.setAttribute('data-src', highResUrl);

        // 设置图片尺寸（用于lightGallery的zoom效果）
        if (img.naturalWidth && img.naturalHeight) {
          galleryLink.setAttribute('data-lg-size', `${img.naturalWidth}-${img.naturalHeight}`);
        }

        // 设置说明文字 - 优化逻辑：title作为标题，alt作为描述
        let subHtml = '';
        const modalData = img.getAttribute('data-modal');

        if (modalData) {
          // 解析data-modal属性
          const titleMatch = modalData.match(/title:\s*([^;]+)/);
          const descMatch = modalData.match(/description:\s*([^;]+)/);

          if (titleMatch || descMatch) {
            if (titleMatch) {
              subHtml += `<h4>${titleMatch[1].trim()}</h4>`;
            }
            if (descMatch) {
              subHtml += `<p>${descMatch[1].trim()}</p>`;
            }
          }
        } else {
          // 优化逻辑：优先使用title作为标题，alt作为描述
          if (imgTitle && imgAlt && imgTitle !== imgAlt) {
            // title和alt都存在且不同：title作为标题，alt作为描述
            subHtml = `<h4>${imgTitle}</h4><p>${imgAlt}</p>`;
          } else if (imgTitle) {
            // 只有title：作为主要说明
            subHtml = `<h4>${imgTitle}</h4>`;
          } else if (imgAlt) {
            // 只有alt：作为描述
            subHtml = `<p>${imgAlt}</p>`;
          } else if (caption) {
            // 备用：使用figcaption
            const captionText = caption.textContent.trim();
            if (captionText) {
              subHtml = `<p>${captionText}</p>`;
            }
          }
        }

        if (subHtml) {
          galleryLink.setAttribute('data-sub-html', subHtml);
        }

        // 创建缩略图
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = imgSrc;
        thumbnailImg.alt = imgAlt;
        thumbnailImg.className = 'img-responsive';
        thumbnailImg.loading = 'lazy';

        galleryLink.appendChild(thumbnailImg);
        galleryContainer.appendChild(galleryLink);
      }
    });

    // 替换第一个图片的位置
    figures[0].parentNode.insertBefore(galleryContainer, figures[0]);

    // 移除原始图片
    figures.forEach(figure => figure.remove());

    this.galleries.push({
      container: galleryContainer,
      id: galleryContainer.id,
      index: groupIndex
    });
  }

  /**
   * 设置图片懒加载
   */
  setupImageLoading() {
    const images = document.querySelectorAll('.gallery-item img, .single-image img, .individual-image-lightgallery img, .image-container img');

    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  }

  /**
   * 初始化Justified Gallery布局
   */
  initJustifiedGallery() {
    const galleryContainers = document.querySelectorAll('.justified-gallery-container');

    if (galleryContainers.length === 0) return;

    galleryContainers.forEach((container) => {
      const $container = jQuery(container);

      // 配置Justified Gallery - 标准配置（只处理多张图片）
      const justifiedConfig = {
        captions: false,
        lastRow: 'nojustify',  // 最后一行左对齐，不强制拉伸
        rowHeight: this.config.responsive?.rowHeight || 180,
        margins: this.config.responsive?.margins || 5,
        randomize: false,
        waitThumbnailsLoad: true,
        justifyThreshold: 0.75  // 标准的对齐阈值
      };

      console.log('Gallery: Initializing Justified Gallery for', container.id);

      // 初始化Justified Gallery
      $container.justifiedGallery(justifiedConfig)
        .on('jg.complete', () => {
          console.log('Gallery: Justified Gallery complete for', container.id);

          // Justified Gallery完成后初始化lightGallery
          if (this.config.modal) {
            this.initLightGalleryForContainer(container);
          }
        })
        .on('jg.resize', () => {
          console.log('Gallery: Justified Gallery resized for', container.id);
        });

      this.justifiedGalleryInstances.push({
        container: container,
        jquery: $container
      });
    });
  }

  /**
   * 初始化lightGallery灯箱
   */
  initLightGallery() {
    // 检查modal配置是否启用
    if (!this.config.modal) {
      console.log('Gallery: modal is disabled');
      return;
    }

    // 为个体图片初始化lightGallery（统一处理单张图片和分离图片）
    const individualImages = document.querySelectorAll('.single-image');
    individualImages.forEach((figure, index) => {
      const img = figure.querySelector('img');
      if (img) {
        this.initLightGalleryForIndividualImage(figure, index);
      }
    });
  }

  /**
   * 为特定容器初始化lightGallery
   */
  initLightGalleryForContainer(container) {
    if (typeof window.lightGallery === 'undefined') {
      console.error('Gallery: lightGallery is not available');
      return;
    }

    console.log('Gallery: Initializing lightGallery for', container.id);

    const lightGalleryConfig = {
      autoplayFirstVideo: false,
      pager: false,
      galleryId: container.id,
      hideScrollbar: true,
      mousewheel: true,
      plugins: [window.lgZoom, window.lgThumbnail].filter(Boolean),
      thumbnail: true,
      thumbWidth: 100,
      thumbHeight: '80px',
      thumbMargin: 5,
      animateThumb: true,
      alignThumbnails: 'middle',
      currentPagerPosition: 'middle',
      appendThumbnailsTo: '.lg-components',
      thumbnailSwipeThreshold: 10,
      controls: true,
      download: true,
      counter: true,

      mobileSettings: {
        controls: false,
        showCloseIcon: true,
        download: false,
        rotate: false,
        thumbnail: true
      },
    };

    const lightGalleryInstance = window.lightGallery(container, lightGalleryConfig);

    this.lightGalleryInstances.push({
      container: container,
      instance: lightGalleryInstance
    });
  }

  /**
   * 为个体图片初始化lightGallery（统一处理单张图片和分离图片）
   */
  initLightGalleryForIndividualImage(figure, index) {
    const img = figure.querySelector('img');
    const caption = figure.querySelector('.image-caption');

    if (!img) return;

    // 如果modal未启用，只保留原始图片显示
    if (!this.config.modal) {
      return;
    }

    // 创建lightGallery容器
    const lightGalleryContainer = document.createElement('div');
    lightGalleryContainer.className = 'individual-image-lightgallery';
    lightGalleryContainer.id = `individual-image-${index}`;

    // 创建lightGallery兼容的链接
    const galleryLink = document.createElement('a');
    galleryLink.href = img.src;
    galleryLink.setAttribute('data-src', img.src);

    if (img.naturalWidth && img.naturalHeight) {
      galleryLink.setAttribute('data-lg-size', `${img.naturalWidth}-${img.naturalHeight}`);
    }

// 设置说明文字 - 优化逻辑：title作为标题，alt作为描述
    let subHtml = '';
    const modalData = img.getAttribute('data-modal');
    const imgTitle = img.title || '';
    const imgAlt = img.alt || '';

    if (modalData) {
      // 解析data-modal属性
      const titleMatch = modalData.match(/title:\s*([^;]+)/);
      const descMatch = modalData.match(/description:\s*([^;]+)/);

      if (titleMatch || descMatch) {
        if (titleMatch) {
          subHtml += `<h4>${titleMatch[1].trim()}</h4>`;
        }
        if (descMatch) {
          subHtml += `<p>${descMatch[1].trim()}</p>`;
        }
      }
    } else {
      // 优化逻辑：优先使用title作为标题，alt作为描述
      if (imgTitle && imgAlt && imgTitle !== imgAlt) {
        // title和alt都存在且不同：title作为标题，alt作为描述
        subHtml = `<h4>${imgTitle}</h4><p>${imgAlt}</p>`;
      } else if (imgTitle) {
        // 只有title：作为主要说明
        subHtml = `<h4>${imgTitle}</h4>`;
      } else if (imgAlt) {
        // 只有alt：作为描述
        subHtml = `<p>${imgAlt}</p>`;
      } else if (caption) {
        // 备用：使用figcaption
        const captionText = caption.textContent.trim();
        if (captionText) {
          subHtml = `<p>${captionText}</p>`;
        }
      }
    }

    if (subHtml) {
      galleryLink.setAttribute('data-sub-html', subHtml);
    }

    // 克隆图片
    const clonedImg = img.cloneNode(true);
    galleryLink.appendChild(clonedImg);
    lightGalleryContainer.appendChild(galleryLink);

    // 替换原始figure
    figure.parentNode.insertBefore(lightGalleryContainer, figure);
    figure.remove();

    // 初始化lightGallery
    this.initLightGalleryForContainer(lightGalleryContainer);
  }

  /**
   * 响应式布局更新
   */
  updateLayout() {
    // 重新布局Justified Gallery实例
    this.justifiedGalleryInstances.forEach(instance => {
      if (instance.jquery) {
        instance.jquery.justifiedGallery('norewind');
      }
    });
  }

  /**
   * 销毁实例
   */
  destroy() {
    // 销毁Justified Gallery实例
    this.justifiedGalleryInstances.forEach(instance => {
      if (instance.jquery) {
        instance.jquery.justifiedGallery('destroy');
      }
    });
    this.justifiedGalleryInstances = [];

    // 销毁lightGallery实例
    this.lightGalleryInstances.forEach(instance => {
      if (instance.instance) {
        instance.instance.destroy();
      }
    });
    this.lightGalleryInstances = [];
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
