(function () {
  var header = document.querySelector('[data-site-header]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var carousels = document.querySelectorAll('[data-hero-carousel]');
  carousels.forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      if (timer || slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        stop();
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  var filterPanel = document.querySelector('[data-filter-panel]');
  if (filterPanel) {
    var searchInput = document.querySelector('[data-filter-search]');
    var categorySelect = document.querySelector('[data-filter-category]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var resultCount = document.querySelector('[data-result-count]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery && searchInput) {
      searchInput.value = initialQuery;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : '');
      var category = categorySelect ? categorySelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var cardCategory = card.getAttribute('data-category') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchCategory = !category || cardCategory === category;
        var matchYear = !year || cardYear === year;
        var showCard = matchQuery && matchCategory && matchYear;
        card.classList.toggle('is-hidden', !showCard);
        if (showCard) {
          visible += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = String(visible);
      }
    }

    [searchInput, categorySelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }

  window.initMoviePlayer = function (videoUrl) {
    var video = document.getElementById('moviePlayer');
    var overlay = document.querySelector('.player-overlay');
    var started = false;
    var hlsInstance = null;

    if (!video || !videoUrl) {
      return;
    }

    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    function attachVideo() {
      if (started) {
        return;
      }
      started = true;

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(videoUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = videoUrl;
      }

      var playTask = video.play();
      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {
          video.controls = true;
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', attachVideo);
    }

    video.addEventListener('click', function () {
      if (!started) {
        attachVideo();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };
})();
