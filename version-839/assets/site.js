(function () {
    var navToggle = document.querySelector('.nav-toggle');
    var siteNav = document.querySelector('.site-nav');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            var open = siteNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });
    }

    function startSlides() {
        if (timer) {
            window.clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showSlide(i);
            startSlides();
        });
    });

    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(current - 1);
            startSlides();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(current + 1);
            startSlides();
        });
    }

    showSlide(0);
    startSlides();

    Array.prototype.slice.call(document.querySelectorAll('[data-search-input]')).forEach(function (input) {
        var target = document.querySelector(input.getAttribute('data-search-target')) || document;
        var items = Array.prototype.slice.call(target.querySelectorAll('.movie-card, .rank-row'));

        input.addEventListener('input', function () {
            var value = input.value.trim().toLowerCase();
            items.forEach(function (item) {
                var text = [
                    item.getAttribute('data-title') || '',
                    item.getAttribute('data-tags') || '',
                    item.getAttribute('data-region') || '',
                    item.getAttribute('data-year') || '',
                    item.textContent || ''
                ].join(' ').toLowerCase();
                item.style.display = text.indexOf(value) === -1 ? 'none' : '';
            });
        });
    });
})();
