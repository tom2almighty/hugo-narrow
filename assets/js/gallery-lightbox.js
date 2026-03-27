class GalleryLightbox {
  constructor(config = {}) {
    this.config = {
      showCaption: config.showCaption !== false
    };

    this.galleries = new Map();
    this.currentGalleryId = null;
    this.currentIndex = 0;
    this.isOpen = false;
    this.elements = this.createElements();
  }

  registerGallery(galleryId, items = []) {
    if (!galleryId || !Array.isArray(items) || items.length === 0) {
      return;
    }

    this.galleries.set(galleryId, items);
  }

  open(galleryId, index = 0) {
    const items = this.galleries.get(galleryId);
    if (!items || items.length === 0) {
      return;
    }

    this.currentGalleryId = galleryId;
    this.currentIndex = Math.max(0, Math.min(index, items.length - 1));

    if (!this.elements.root.isConnected) {
      document.body.appendChild(this.elements.root);
    }

    this.render();
    this.elements.root.hidden = false;
    this.elements.root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('gallery-lightbox-open');
    document.body.classList.add('gallery-lightbox-open');

    requestAnimationFrame(() => {
      this.elements.root.classList.add('is-open');
    });

    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.elements.root.classList.remove('is-open');
    this.elements.root.hidden = true;
    this.elements.root.setAttribute('aria-hidden', 'true');
    this.elements.image.removeAttribute('src');
    document.documentElement.classList.remove('gallery-lightbox-open');
    document.body.classList.remove('gallery-lightbox-open');
  }

  showPrevious() {
    if (this.currentIndex === 0) {
      return;
    }

    this.currentIndex -= 1;
    this.render();
  }

  showNext() {
    const items = this.getCurrentItems();
    if (this.currentIndex >= items.length - 1) {
      return;
    }

    this.currentIndex += 1;
    this.render();
  }

  getCurrentItems() {
    return this.galleries.get(this.currentGalleryId) || [];
  }

  render() {
    const items = this.getCurrentItems();
    const item = items[this.currentIndex];
    if (!item) {
      return;
    }

    const hasCaption = this.config.showCaption && Boolean(item.captionHTML);
    const isSingleItem = items.length <= 1;

    this.elements.image.src = item.src;
    this.elements.image.alt = item.alt || '';
    this.elements.counter.textContent = String(this.currentIndex + 1) + ' / ' + String(items.length);
    this.elements.caption.innerHTML = hasCaption ? item.captionHTML : '';
    this.elements.meta.dataset.hasCaption = hasCaption ? 'true' : 'false';

    this.elements.previous.hidden = isSingleItem;
    this.elements.next.hidden = isSingleItem;
    this.elements.previous.disabled = isSingleItem || this.currentIndex === 0;
    this.elements.next.disabled = isSingleItem || this.currentIndex === items.length - 1;
  }

  createElements() {
    const root = document.createElement('div');
    root.className = 'gallery-lightbox';
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = [
      '<div class="gallery-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Image viewer">',
      '  <button type="button" class="gallery-lightbox__close" aria-label="Close image viewer">&times;</button>',
      '  <div class="gallery-lightbox__frame">',
      '    <button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--prev" aria-label="Previous image">&lsaquo;</button>',
      '    <div class="gallery-lightbox__stage">',
      '      <img class="gallery-lightbox__image" alt="" />',
      '    </div>',
      '    <button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--next" aria-label="Next image">&rsaquo;</button>',
      '  </div>',
      '  <div class="gallery-lightbox__meta" data-has-caption="false">',
      '    <span class="gallery-lightbox__counter"></span>',
      '    <div class="gallery-lightbox__caption"></div>',
      '  </div>',
      '</div>'
    ].join('');

    const close = root.querySelector('.gallery-lightbox__close');
    const previous = root.querySelector('.gallery-lightbox__nav--prev');
    const next = root.querySelector('.gallery-lightbox__nav--next');

    close.addEventListener('click', () => this.close());
    previous.addEventListener('click', () => this.showPrevious());
    next.addEventListener('click', () => this.showNext());

    return {
      root,
      close,
      previous,
      next,
      image: root.querySelector('.gallery-lightbox__image'),
      counter: root.querySelector('.gallery-lightbox__counter'),
      caption: root.querySelector('.gallery-lightbox__caption'),
      meta: root.querySelector('.gallery-lightbox__meta')
    };
  }

  destroy() {
    this.close();
    this.galleries.clear();

    if (this.elements.root.isConnected) {
      this.elements.root.remove();
    }
  }
}

export default GalleryLightbox;
