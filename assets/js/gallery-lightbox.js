class GalleryLightbox {
  constructor(config = {}) {
    this.config = {
      showCaption: config.showCaption !== false
    };

    this.galleries = new Map();
    this.currentGalleryId = null;
    this.currentIndex = 0;
    this.isOpen = false;
    this.lastActiveElement = null;
    this.handleKeydown = this.handleKeydown.bind(this);
    this.elements = this.createElements();
  }

  registerGallery(galleryId, items = []) {
    if (!galleryId || !Array.isArray(items) || items.length === 0) {
      return;
    }

    this.galleries.set(galleryId, items);
  }

  open(galleryId, index = 0, options = {}) {
    const items = this.galleries.get(galleryId);
    if (!items || items.length === 0) {
      return;
    }

    this.currentGalleryId = galleryId;
    this.currentIndex = Math.max(0, Math.min(index, items.length - 1));
    this.lastActiveElement = options.triggerElement || document.activeElement;

    if (!this.elements.root.isConnected) {
      document.body.appendChild(this.elements.root);
    }

    this.render();
    this.elements.root.hidden = false;
    this.elements.root.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('gallery-lightbox-open');
    document.body.classList.add('gallery-lightbox-open');
    document.addEventListener('keydown', this.handleKeydown);

    requestAnimationFrame(() => {
      this.elements.root.classList.add('is-open');
      this.elements.close.focus({ preventScroll: true });
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
    this.elements.caption.innerHTML = '';
    document.documentElement.classList.remove('gallery-lightbox-open');
    document.body.classList.remove('gallery-lightbox-open');
    document.removeEventListener('keydown', this.handleKeydown);

    if (this.lastActiveElement && this.lastActiveElement.isConnected && typeof this.lastActiveElement.focus === 'function') {
      this.lastActiveElement.focus({ preventScroll: true });
    }

    this.lastActiveElement = null;
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
    this.elements.overlay.dataset.hasCaption = hasCaption ? 'true' : 'false';

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
      '  <div class="gallery-lightbox__viewport">',
      '    <button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--prev" aria-label="Previous image">',
      '      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      '        <path d="M14.5 5.5L8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />',
      '      </svg>',
      '    </button>',
      '    <div class="gallery-lightbox__media">',
      '      <div class="gallery-lightbox__stage">',
      '        <img class="gallery-lightbox__image" alt="" />',
      '        <div class="gallery-lightbox__overlay" data-has-caption="false">',
      '          <div class="gallery-lightbox__caption-bubble">',
      '            <div class="gallery-lightbox__caption"></div>',
      '          </div>',
      '          <span class="gallery-lightbox__counter" aria-live="polite"></span>',
      '        </div>',
      '      </div>',
      '    </div>',
      '    <button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--next" aria-label="Next image">',
      '      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      '        <path d="M9.5 5.5L16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" />',
      '      </svg>',
      '    </button>',
      '  </div>',
      '</div>'
    ].join('');

    const dialog = root.querySelector('.gallery-lightbox__dialog');
    const close = root.querySelector('.gallery-lightbox__close');
    const previous = root.querySelector('.gallery-lightbox__nav--prev');
    const next = root.querySelector('.gallery-lightbox__nav--next');

    dialog.addEventListener('click', (event) => {
      if (
        !event.target.closest('.gallery-lightbox__media')
        && !event.target.closest('.gallery-lightbox__nav')
        && !event.target.closest('.gallery-lightbox__close')
      ) {
        this.close();
      }
    });

    close.addEventListener('click', () => this.close());
    previous.addEventListener('click', () => this.showPrevious());
    next.addEventListener('click', () => this.showNext());

    return {
      root,
      dialog,
      close,
      previous,
      next,
      image: root.querySelector('.gallery-lightbox__image'),
      counter: root.querySelector('.gallery-lightbox__counter'),
      caption: root.querySelector('.gallery-lightbox__caption'),
      overlay: root.querySelector('.gallery-lightbox__overlay')
    };
  }

  handleKeydown(event) {
    if (!this.isOpen) {
      return;
    }

    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const activeElement = document.activeElement;
    const isTypingTarget = activeElement && (
      activeElement.tagName === 'INPUT'
      || activeElement.tagName === 'TEXTAREA'
      || activeElement.isContentEditable
      || activeElement.tagName === 'SELECT'
    );

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (isTypingTarget) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.showPrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.showNext();
    }
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
