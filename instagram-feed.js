document.addEventListener('DOMContentLoaded', function () {
    var carousel = document.getElementById('instagram-carousel');
    var viewport = carousel ? carousel.querySelector('.instagram-carousel-viewport') : null;
    var track = document.getElementById('instagram-container');
    var more = document.getElementById('instagram-more');
    var prevBtn = document.getElementById('instagram-prev');
    var nextBtn = document.getElementById('instagram-next');
    var currentEl = document.getElementById('instagram-current');
    var totalEl = document.getElementById('instagram-total');
    if (!carousel || !viewport || !track || !prevBtn || !nextBtn) {
        return;
    }

    var loadedSlides = Array.prototype.slice.call(track.querySelectorAll('.instagram-item'));
    var pendingCount = more ? more.content.querySelectorAll('.instagram-item').length : 0;
    var total = loadedSlides.length + pendingCount;
    var processed = new Set();
    var index = 0;

    if (totalEl) {
        totalEl.textContent = String(total);
    }

    // Desktop shows a 3-up carousel: the active slide plus its full
    // previous/next neighbors, translucent, each an even third of the
    // viewport. Mobile shows the active slide edge-to-edge (no peek).
    var DESKTOP_SLOT_RATIO = 1 / 3;

    function isDesktop() {
        return window.matchMedia('(min-width: 768px)').matches;
    }

    function processEmbeds(el) {
        if (window.instgrm) {
            window.instgrm.Embeds.process(el);
        }
    }

    // Moves the next unrendered slide out of the <template> and into the
    // live track. This only relocates markup so it can be laid out (and,
    // on desktop, peeked at) - it does not fetch anything from Instagram.
    function ensureLoaded(i) {
        if (i < 0 || i >= total) {
            return null;
        }
        while (loadedSlides.length <= i && more && more.content.firstElementChild) {
            loadedSlides.push(more.content.firstElementChild);
            track.appendChild(more.content.firstElementChild);
        }
        return loadedSlides[i] || null;
    }

    // The actual "lazy load": asks Instagram's embed script to turn a
    // slide's placeholder blockquote into a real embedded post. Scoped to
    // just that slide so peeking neighbors aren't loaded early.
    function ensureProcessed(slide) {
        if (slide && !processed.has(slide)) {
            processed.add(slide);
            processEmbeds(slide);
        }
    }

    function layout(skipTransition) {
        var viewportWidth = viewport.clientWidth;
        var slotWidth = viewportWidth * (isDesktop() ? DESKTOP_SLOT_RATIO : 1);
        if (skipTransition) {
            track.style.transition = 'none';
        }
        loadedSlides.forEach(function (slide) {
            slide.style.width = slotWidth + 'px';
        });
        var offset = -(index * slotWidth) + (viewportWidth - slotWidth) / 2;
        track.style.transform = 'translateX(' + offset + 'px)';
        if (skipTransition) {
            // Force layout so the transition-less transform applies before
            // transitions are re-enabled, avoiding a visible snap-animation.
            track.getBoundingClientRect();
            track.style.transition = '';
        }
    }

    function showSlide(i) {
        var active = ensureLoaded(i);
        ensureLoaded(i + 1);
        ensureProcessed(active);

        loadedSlides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === i);
        });
        index = i;
        if (currentEl) {
            currentEl.textContent = String(i + 1);
        }
        prevBtn.disabled = i === 0;
        nextBtn.disabled = i === total - 1;
        layout();
    }

    function goNext() {
        if (index < total - 1) {
            showSlide(index + 1);
        }
    }

    function goPrev() {
        if (index > 0) {
            showSlide(index - 1);
        }
    }

    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);

    carousel.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') {
            goNext();
        } else if (event.key === 'ArrowLeft') {
            goPrev();
        }
    });

    var touchStartX = null;
    var touchStartY = null;
    var SWIPE_THRESHOLD = 40;

    carousel.addEventListener('touchstart', function (event) {
        if (event.touches.length !== 1) {
            return;
        }
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', function (event) {
        if (touchStartX === null) {
            return;
        }
        var touch = event.changedTouches[0];
        var deltaX = touch.clientX - touchStartX;
        var deltaY = touch.clientY - touchStartY;
        touchStartX = null;
        touchStartY = null;
        if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
            return;
        }
        if (deltaX < 0) {
            goNext();
        } else {
            goPrev();
        }
    });

    var resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            layout(true);
        }, 120);
    });

    showSlide(0);
});
