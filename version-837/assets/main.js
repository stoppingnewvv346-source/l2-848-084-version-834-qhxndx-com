(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length > 1) {
      var index = 0;
      var show = function (next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
        });
      });
      show(0);
      setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
    filterForms.forEach(function (form) {
      var input = form.querySelector('[data-filter-input]');
      var year = form.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
      var count = document.querySelector('[data-result-count]');
      var empty = document.querySelector('[data-search-empty]');

      var apply = function () {
        var q = normalize(input && input.value);
        var y = normalize(year && year.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.textContent
          ].join(' '));
          var cardYear = normalize(card.getAttribute('data-year'));
          var ok = (!q || haystack.indexOf(q) > -1) && (!y || cardYear === y);
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '当前显示 ' + visible + ' 部影片';
        }
        if (empty) {
          empty.classList.toggle('show', visible === 0);
        }
      };

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        apply();
      });
      if (input) {
        input.addEventListener('input', apply);
      }
      if (year) {
        year.addEventListener('change', apply);
      }
      apply();
    });

    var searchRoot = document.querySelector('[data-global-search]');
    if (searchRoot && window.SEARCH_DATA) {
      var params = new URLSearchParams(window.location.search);
      var searchInput = searchRoot.querySelector('[data-global-input]');
      var results = searchRoot.querySelector('[data-global-results]');
      var emptyBox = searchRoot.querySelector('[data-search-empty]');
      var initial = params.get('q') || '';
      if (searchInput) {
        searchInput.value = initial;
      }

      var render = function () {
        var q = normalize(searchInput && searchInput.value);
        var list = window.SEARCH_DATA.filter(function (item) {
          var text = normalize([item.title, item.region, item.type, item.year, item.genre, item.tags, item.oneLine].join(' '));
          return !q || text.indexOf(q) > -1;
        }).slice(0, 120);

        results.innerHTML = list.map(function (item) {
          return [
            '<article class="movie-card" data-filter-card data-title="' + item.title.replace(/"/g, '&quot;') + '">',
            '  <a class="card-cover" href="' + item.link + '">',
            '    <img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy">',
            '    <span class="card-play">▶</span>',
            '  </a>',
            '  <div class="card-body">',
            '    <div class="card-meta"><span>' + item.year + '</span><span>' + item.region + '</span></div>',
            '    <h3><a href="' + item.link + '">' + item.title + '</a></h3>',
            '    <p>' + item.oneLine + '</p>',
            '    <div class="tag-row">' + item.tags.slice(0, 3).map(function (tag) { return '<span>' + tag + '</span>'; }).join('') + '</div>',
            '  </div>',
            '</article>'
          ].join('');
        }).join('');

        if (emptyBox) {
          emptyBox.classList.toggle('show', list.length === 0);
        }
      };

      searchRoot.addEventListener('submit', function (event) {
        event.preventDefault();
        render();
      });
      if (searchInput) {
        searchInput.addEventListener('input', render);
      }
      render();
    }
  });
})();
