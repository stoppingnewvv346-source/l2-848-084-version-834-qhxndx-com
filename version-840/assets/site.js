(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    function start() {
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
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        stop();
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function initSearch() {
    var input = document.getElementById('siteSearch');
    var clear = document.getElementById('clearSearch');
    var status = document.querySelector('[data-filter-status]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    if (!input || !cards.length) {
      return;
    }
    var activeFilter = 'all';
    function apply() {
      var query = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var category = card.getAttribute('data-category') || '';
        var matchText = !query || text.indexOf(query) !== -1;
        var matchFilter = activeFilter === 'all' || category === activeFilter;
        var show = matchText && matchFilter;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });
      if (status) {
        status.textContent = query || activeFilter !== 'all' ? '匹配影片：' + visible : '输入关键词快速检索片库';
      }
    }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        apply();
      });
    });
    input.value = getQuery();
    input.addEventListener('input', apply);
    if (clear) {
      clear.addEventListener('click', function () {
        input.value = '';
        input.focus();
        apply();
      });
    }
    apply();
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('.js-player'));
    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('.play-overlay');
      var url = player.getAttribute('data-video');
      var prepared = false;
      var hlsInstance = null;
      if (!video || !url) {
        return;
      }
      function prepare() {
        if (prepared) {
          return;
        }
        prepared = true;
        video.controls = true;
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
        } else {
          video.src = url;
        }
      }
      function play() {
        prepare();
        player.classList.add('is-playing');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }
      if (button) {
        button.addEventListener('click', play);
      }
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance && typeof hlsInstance.destroy === 'function') {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initPlayers();
  });
})();
