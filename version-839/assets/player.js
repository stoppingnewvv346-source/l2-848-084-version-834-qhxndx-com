(function () {
    window.initMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        var started = false;
        var hls = null;

        if (!video || !overlay) {
            return;
        }

        function begin() {
            if (started) {
                return;
            }
            started = true;
            overlay.classList.add('is-hidden');

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = options.source;
                video.play().catch(function () {});
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(options.source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return;
            }

            video.src = options.source;
            video.play().catch(function () {});
        }

        overlay.addEventListener('click', begin);
        video.addEventListener('click', function () {
            if (!started) {
                begin();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
