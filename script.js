/* ALAYA - SMOOTH AND STABLE SCROLL */

document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('a[href^="#"]');
    let animationFrame = null;

    function stopScroll() {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }

    function smoothScroll(/** @type {Element} */ target) {
        stopScroll();

        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 0;

        const start = window.scrollY;
        const destination =
            window.scrollY +
            target.getBoundingClientRect().top -
            headerHeight - 15;

        const distance = destination - start;
        const duration = 1400;
        const startTime = performance.now();

        function animate(/** @type {number} */ currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Gerakan perlahan dan halus
            const ease =
                progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, start + distance * ease);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                animationFrame = null;
            }
        }

        animationFrame = requestAnimationFrame(animate);
    }

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            if (window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches) {
                stopScroll();
                return;
            }

            event.preventDefault();
            smoothScroll(target);
        });
    });

    // Hentikan animasi jika pengguna menggeser halaman sendiri
    window.addEventListener("wheel", stopScroll, {
        passive: true
    });

    window.addEventListener("touchstart", stopScroll, {
        passive: true
    });

    window.addEventListener("keydown", function (event) {
        if ([
            "ArrowDown",
            "ArrowUp",
            "PageDown",
            "PageUp",
            "Home",
            "End",
            " "
        ].includes(event.key)) {
            stopScroll();
        }
    });
});