(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function initNavigation() {
        var button = document.querySelector('[data-nav-toggle]');
        var nav = document.querySelector('[data-site-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function initHero() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var dotsWrap = carousel.querySelector('[data-hero-dots]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            if (dotsWrap) {
                Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, dotIndex) {
                    dot.classList.toggle('is-active', dotIndex === index);
                });
            }
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (dotsWrap) {
            slides.forEach(function (_, slideIndex) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', '切换推荐内容');
                dot.addEventListener('click', function () {
                    show(slideIndex);
                    restart();
                });
                dotsWrap.appendChild(dot);
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    function initSearch() {
        var input = document.querySelector('[data-movie-search]');
        var list = document.querySelector('[data-search-list]');
        var clear = document.querySelector('[data-clear-search]');
        if (!input || !list) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-filter-text]'));

        function apply() {
            var query = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-filter-text') || card.textContent || '').toLowerCase();
                card.classList.toggle('is-hidden-by-search', query && text.indexOf(query) === -1);
            });
        }

        input.addEventListener('input', apply);
        if (clear) {
            clear.addEventListener('click', function () {
                input.value = '';
                apply();
                input.focus();
            });
        }

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
            input.value = q;
            apply();
        }
    }

    window.setupMoviePlayer = function (videoId, source, layerId) {
        var video = document.getElementById(videoId);
        var layer = document.getElementById(layerId);
        if (!video || !source) {
            return;
        }
        var prepared = false;

        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function hideLayer() {
            if (layer) {
                layer.classList.add('is-hidden');
            }
        }

        function start() {
            prepare();
            hideLayer();
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        prepare();
        if (layer) {
            layer.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', hideLayer);
    };

    ready(function () {
        initNavigation();
        initHero();
        initSearch();
    });
})();
