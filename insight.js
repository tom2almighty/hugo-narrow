/**
 * Insight search plugin - Native JavaScript version
 * @author PPOffice { @link https://github.com/ppoffice } - Converted to vanilla JS
 */
function loadInsight(config, translation) { // eslint-disable-line no-unused-vars
    const main = document.querySelector('.searchbox');
    const input = main.querySelector('.searchbox-input');
    const container = main.querySelector('.searchbox-body');

    function section(title) {
      const section = document.createElement('section');
      section.className = 'searchbox-result-section';
      const header = document.createElement('header');
      header.textContent = title;
      section.appendChild(header);
      return section;
    }

    function merge(ranges) {
      let last;
      const result = [];

      ranges.forEach(r => {
        if (!last || r[0] > last[1]) {
          result.push(last = r);
        } else if (r[1] > last[1]) {
          last[1] = r[1];
        }
      });

      return result;
    }

    function findAndHighlight(text, matches, maxlen) {
      if (!Array.isArray(matches) || !matches.length || !text) {
        return maxlen ? text.slice(0, maxlen) : text;
      }
      const testText = text.toLowerCase();
      const indices = matches.map(match => {
        const index = testText.indexOf(match.toLowerCase());
        if (!match || index === -1) {
          return null;
        }
        return [index, index + match.length];
      }).filter(match => {
        return match !== null;
      }).sort((a, b) => {
        return a[0] - b[0] || a[1] - b[1];
      });

      if (!indices.length) {
        return text;
      }

      let result = '';
      let last = 0;
      const ranges = merge(indices);
      const sumRange = [ranges[0][0], ranges[ranges.length - 1][1]];
      if (maxlen && maxlen < sumRange[1]) {
        last = sumRange[0];
      }

      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        result += text.slice(last, Math.min(range[0], sumRange[0] + maxlen));
        if (maxlen && range[0] >= sumRange[0] + maxlen) {
          break;
        }
        result += '<em>' + text.slice(range[0], range[1]) + '</em>';
        last = range[1];
        if (i === ranges.length - 1) {
          if (maxlen) {
            result += text.slice(range[1], Math.min(text.length, sumRange[0] + maxlen + 1));
          } else {
            result += text.slice(range[1]);
          }
        }
      }

      return result;
    }

    function searchItem(icon, title, slug, preview, url) {
      title = title != null && title !== '' ? title : translation.untitled;

      return `<a class="searchbox-result-item" href="${url}">
              <span class="searchbox-result-icon">
                  <i class="fa fa-${icon}"></i>
              </span>
              <span class="searchbox-result-content">
                  <span class="searchbox-result-title">
                      ${title}
                      ${slug ? '<span class="searchbox-result-title-secondary">(' + slug + ')</span>' : ''}
                  </span>
                  ${preview ? '<span class="searchbox-result-preview">' + preview + '</span>' : ''}
              </span>
          </a>`;
    }

    function sectionFactory(keywords, type, array) {
      let searchItems;
      if (array.length === 0) return null;
      const sectionTitle = translation[type.toLowerCase()];
      switch (type) {
        case 'POSTS':
        case 'PAGES':
          searchItems = array.map(item => {
            const title = findAndHighlight(item.title, keywords);
            const text = findAndHighlight(item.text, keywords, 100);
            return searchItem('file', title, null, text, item.link);
          });
          break;
        case 'CATEGORIES':
        case 'TAGS':
          searchItems = array.map(item => {
            const name = findAndHighlight(item.name, keywords);
            const slug = findAndHighlight(item.slug, keywords);
            return searchItem(type === 'CATEGORIES' ? 'folder' : 'tag', name, slug, null, item.link);
          });
          break;
        default:
          return null;
      }
      const sectionElement = section(sectionTitle);
      searchItems.forEach(itemHtml => {
        sectionElement.insertAdjacentHTML('beforeend', itemHtml);
      });
      return sectionElement;
    }

    function parseKeywords(keywords) {
      return keywords.split(' ').filter(keyword => {
        return !!keyword;
      }).map(keyword => {
        return keyword.toLowerCase();
      });
    }

    /**
     * Judge if a given post/page/category/tag contains all of the keywords.
     * @param Object            obj     Object to be weighted
     * @param Array<String>     fields  Object's fields to find matches
     */
    function filter(keywords, obj, fields) {
      const keywordArray = parseKeywords(keywords);
      const containKeywords = keywordArray.filter(keyword => {
        const containFields = fields.filter(field => {
          if (!Object.prototype.hasOwnProperty.call(obj, field)) {
            return false;
          }
          if (obj[field].toLowerCase().indexOf(keyword) > -1) {
            return true;
          }
          return false;
        });
        if (containFields.length > 0) {
          return true;
        }
        return false;
      });
      return containKeywords.length === keywordArray.length;
    }

    function filterFactory(keywords) {
      return {
        post: function (obj) {
          return filter(keywords, obj, ['title', 'text']);
        },
        page: function (obj) {
          return filter(keywords, obj, ['title', 'text']);
        },
        category: function (obj) {
          return filter(keywords, obj, ['name', 'slug']);
        },
        tag: function (obj) {
          return filter(keywords, obj, ['name', 'slug']);
        }
      };
    }

    /**
     * Calculate the weight of a matched post/page/category/tag.
     * @param Object            obj     Object to be weighted
     * @param Array<String>     fields  Object's fields to find matches
     * @param Array<Integer>    weights Weight of every field
     */
    function weight(keywords, obj, fields, weights) {
      let value = 0;
      parseKeywords(keywords).forEach(keyword => {
        const pattern = new RegExp(keyword, 'img'); // Global, Multi-line, Case-insensitive
        fields.forEach((field, index) => {
          if (Object.prototype.hasOwnProperty.call(obj, field)) {
            const matches = obj[field].match(pattern);
            value += matches ? matches.length * weights[index] : 0;
          }
        });
      });
      return value;
    }

    function weightFactory(keywords) {
      return {
        post: function (obj) {
          return weight(keywords, obj, ['title', 'text'], [3, 1]);
        },
        page: function (obj) {
          return weight(keywords, obj, ['title', 'text'], [3, 1]);
        },
        category: function (obj) {
          return weight(keywords, obj, ['name', 'slug'], [1, 1]);
        },
        tag: function (obj) {
          return weight(keywords, obj, ['name', 'slug'], [1, 1]);
        }
      };
    }

    function search(json, keywords) {
      const weights = weightFactory(keywords);
      const filters = filterFactory(keywords);
      const posts = json.posts;
      const pages = json.pages;
      const tags = json.tags;
      const categories = json.categories;
      return {
        posts: posts.filter(filters.post).sort((a, b) => {
          return weights.post(b) - weights.post(a);
        }).slice(0, 5),
        pages: pages.filter(filters.page).sort((a, b) => {
          return weights.page(b) - weights.page(a);
        }).slice(0, 5),
        categories: categories.filter(filters.category).sort((a, b) => {
          return weights.category(b) - weights.category(a);
        }).slice(0, 5),
        tags: tags.filter(filters.tag).sort((a, b) => {
          return weights.tag(b) - weights.tag(a);
        }).slice(0, 5)
      };
    }

    function searchResultToDOM(keywords, searchResult) {
      container.innerHTML = '';
      for (const key in searchResult) {
        const sectionElement = sectionFactory(parseKeywords(keywords),
          key.toUpperCase(), searchResult[key]);
        if (sectionElement) {
          container.appendChild(sectionElement);
        }
      }
    }

    function scrollTo(item) {
      if (!item) return;
      const wrapperHeight = container.clientHeight;
      const itemTop = item.offsetTop - container.scrollTop;
      const itemBottom = item.clientHeight + item.offsetTop;
      if (itemBottom > wrapperHeight + container.scrollTop) {
        container.scrollTop = itemBottom - container.clientHeight;
      }
      if (itemTop < 0) {
        container.scrollTop = item.offsetTop;
      }
    }

    function selectItemByDiff(value) {
      const items = Array.from(container.querySelectorAll('.searchbox-result-item'));
      let prevPosition = -1;
      items.forEach((item, index) => {
        if (item.classList.contains('active')) {
          prevPosition = index;
        }
      });
      const nextPosition = (items.length + prevPosition + value) % items.length;
      if (items[prevPosition]) {
        items[prevPosition].classList.remove('active');
      }
      if (items[nextPosition]) {
        items[nextPosition].classList.add('active');
        scrollTo(items[nextPosition]);
      }
    }

    function gotoLink(item) {
      if (item) {
        const href = item.getAttribute('href');
        if (href) {
          // 检查是否有视图过渡管理器并且是内部链接
          if (window.viewTransitionManager &&
              href &&
              !href.startsWith('http') &&
              !href.startsWith('mailto:') &&
              !href.startsWith('tel:')) {

            // 关闭搜索框
            main.classList.remove('show');

            // 使用视图过渡导航
            window.viewTransitionManager.navigateWithTransition(href);
          } else {
            // 降级到普通导航
            location.href = href;
          }
        }
      }
    }

    // 加载搜索数据
    fetch(config.contentUrl)
      .then(response => response.json())
      .then(json => {
        if (location.hash.trim() === '#insight-search') {
          main.classList.add('show');
        }
        input.addEventListener('input', function () {
          const keywords = this.value;
          searchResultToDOM(keywords, search(json, keywords));
        });
        // 触发初始搜索
        input.dispatchEvent(new Event('input'));
      })
      .catch(error => {
        console.error('Failed to load search data:', error);
      });

    let touch = false;

    // 搜索触发器事件
    document.addEventListener('click', (e) => {
      if (e.target.closest('.navbar-main .search')) {
        main.classList.add('show');
        input.focus();
      }
    });

    document.addEventListener('focus', (e) => {
      if (e.target.closest('.navbar-main .search')) {
        main.classList.add('show');
        input.focus();
      }
    }, true);

    // 搜索结果项点击事件
    document.addEventListener('click', (e) => {
      const resultItem = e.target.closest('.searchbox-result-item');
      if (resultItem) {
        gotoLink(resultItem);
        touch = false;
      }
    });

    document.addEventListener('touchend', (e) => {
      if (!touch) return;
      const resultItem = e.target.closest('.searchbox-result-item');
      if (resultItem) {
        gotoLink(resultItem);
        touch = false;
      }
    });

    // 关闭按钮事件
    document.addEventListener('click', (e) => {
      if (e.target.closest('.searchbox-close')) {
        const navbar = document.querySelector('.navbar-main');
        if (navbar) {
          navbar.style.pointerEvents = 'none';
          setTimeout(() => {
            navbar.style.pointerEvents = 'auto';
          }, 400);
        }
        main.classList.remove('show');
        touch = false;
      }
    });

    document.addEventListener('touchend', (e) => {
      if (!touch) return;
      if (e.target.closest('.searchbox-close')) {
        const navbar = document.querySelector('.navbar-main');
        if (navbar) {
          navbar.style.pointerEvents = 'none';
          setTimeout(() => {
            navbar.style.pointerEvents = 'auto';
          }, 400);
        }
        main.classList.remove('show');
        touch = false;
      }
    });

    // 键盘事件
    document.addEventListener('keydown', (e) => {
      if (!main.classList.contains('show')) return;
      switch (e.keyCode) {
        case 27: // ESC
          main.classList.remove('show');
          break;
        case 38: // UP
          e.preventDefault();
          selectItemByDiff(-1);
          break;
        case 40: // DOWN
          e.preventDefault();
          selectItemByDiff(1);
          break;
        case 13: // ENTER
          e.preventDefault();
          const activeItem = container.querySelector('.searchbox-result-item.active');
          if (activeItem) {
            gotoLink(activeItem);
          }
          break;
      }
    });

    // 触摸事件
    document.addEventListener('touchstart', () => {
      touch = true;
    });

    document.addEventListener('touchmove', () => {
      touch = false;
    });
  }
