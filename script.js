const SOCIAL_LINKS = {
    // Add our real Facebook, Twitter and Instagram URLs when available.
    facebook: "",
    twitter: "",
    instagram: "",
};

const header = document.querySelector(".site-header");
const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("#main-navigation");

function closeMenu() {
    if (!header || !menuButton) return;
    header.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".visually-hidden").textContent =
        "Open navigation";
}

if (header && menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        header.classList.toggle("is-open", !isOpen);
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        menuButton.querySelector(".visually-hidden").textContent = isOpen
            ? "Open navigation"
            : "Close navigation";
    });
    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
        if (
            header.classList.contains("is-open") &&
            !header.contains(event.target)
        )
            closeMenu();
    });
}

const currentPath =
    window.location.pathname === "/index.html" ? "/" : window.location.pathname;
document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (new URL(link.href, window.location.href).pathname === currentPath) {
        link.setAttribute("aria-current", "page");
    }
});

// Keep social channels available to update; never create empty or non-HTTPS links.
document.querySelectorAll("[data-social-slot]").forEach((slot) => {
    const value = SOCIAL_LINKS[slot.dataset.socialSlot]?.trim();
    if (!value) return;
    let url;
    try {
        url = new URL(value);
    } catch {
        return;
    }
    if (url.protocol !== "https:") return;
    const link = document.createElement("a");
    link.className = slot.className.replace("social-slot", "").trim();
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute(
        "aria-label",
        slot.getAttribute("aria-label") || slot.dataset.socialSlot,
    );
    link.innerHTML = slot.innerHTML;
    slot.replaceWith(link);
});

const siteStatus = document.querySelector("#site-status");
const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
);
const desktopGalleryQuery = window.matchMedia("(min-width: 801px)");
const galleryControllers = [];

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function createGalleryController(gallery) {
    const stage = gallery.querySelector(".gallery-scroll__stage");
    const track = gallery.querySelector(".gallery-scroll__track");
    if (!stage || !track) return null;

    let travel = 0;
    let refreshFrame = 0;

    function visibleItems() {
        return Array.from(
            track.querySelectorAll(".gallery-item:not([hidden])"),
        );
    }

    function setActive(active) {
        visibleItems().forEach((item) => {
            item.classList.toggle("is-gallery-active", item === active);
        });
    }

    function refresh() {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
            const items = visibleItems();
            if (!items.length) {
                gallery.style.removeProperty("height");
                track.style.removeProperty("transform");
                return;
            }

            if (!desktopGalleryQuery.matches || reducedMotionQuery.matches) {
                gallery.style.removeProperty("height");
                track.style.removeProperty("transform");
                track.style.removeProperty("padding-inline");
                return;
            }

            const sideSpace = Math.max(
                0,
                (stage.clientWidth - items[0].offsetWidth) / 2,
            );
            track.style.paddingInline = `${sideSpace}px`;
            travel = Math.max(0, track.scrollWidth - stage.clientWidth);
            const scrollRun = travel * 0.82;
            gallery.style.height = `${Math.ceil(stage.offsetHeight + scrollRun)}px`;
            update();
        });
    }

    function update() {
        const items = visibleItems();
        if (!items.length) return;

        if (!desktopGalleryQuery.matches || reducedMotionQuery.matches) {
            track.style.removeProperty("transform");
            const centerY = window.innerHeight / 2;
            let active = items[0];
            let nearest = Number.POSITIVE_INFINITY;
            items.forEach((item) => {
                const rect = item.getBoundingClientRect();
                const distance = Math.abs(rect.top + rect.height / 2 - centerY);
                if (distance < nearest) {
                    active = item;
                    nearest = distance;
                }
            });
            setActive(active);
            return;
        }

        const run = Math.max(0, gallery.offsetHeight - stage.offsetHeight);
        const stickyTop =
            Number.parseFloat(window.getComputedStyle(stage).top) || 0;
        const distance = clamp(
            stickyTop - gallery.getBoundingClientRect().top,
            0,
            run,
        );
        const progress = run ? distance / run : 0;
        const currentTravel = Math.max(
            0,
            track.scrollWidth - stage.clientWidth,
        );
        travel = currentTravel;
        track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;

        const stageRect = stage.getBoundingClientRect();
        const centerX = stageRect.left + stageRect.width / 2;
        let active = items[0];
        let nearest = Number.POSITIVE_INFINITY;
        items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const distanceFromCenter = Math.abs(
                rect.left + rect.width / 2 - centerX,
            );
            if (distanceFromCenter < nearest) {
                active = item;
                nearest = distanceFromCenter;
            }
        });
        setActive(active);
    }

    return { refresh, update };
}

document.querySelectorAll("[data-scroll-gallery]").forEach((gallery) => {
    const controller = createGalleryController(gallery);
    if (controller) galleryControllers.push(controller);
});

galleryControllers.forEach((controller) => controller.refresh());

let galleryFrame = 0;
function scheduleGalleryUpdate() {
    if (galleryFrame) return;
    galleryFrame = requestAnimationFrame(() => {
        galleryFrame = 0;
        galleryControllers.forEach((controller) => controller.update());
    });
}

window.addEventListener("scroll", scheduleGalleryUpdate, { passive: true });
window.addEventListener(
    "resize",
    () => galleryControllers.forEach((controller) => controller.refresh()),
    { passive: true },
);
window.addEventListener(
    "load",
    () => galleryControllers.forEach((controller) => controller.refresh()),
    { once: true },
);
reducedMotionQuery.addEventListener?.("change", () =>
    galleryControllers.forEach((controller) => controller.refresh()),
);
desktopGalleryQuery.addEventListener?.("change", () =>
    galleryControllers.forEach((controller) => controller.refresh()),
);

const filterButtons = document.querySelectorAll("[data-gallery-filter]");
const galleryItems = document.querySelectorAll("[data-category]");
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selected = button.dataset.galleryFilter;
        filterButtons.forEach((item) => {
            const active = item === button;
            item.classList.toggle("is-active", active);
            item.setAttribute("aria-pressed", String(active));
        });
        let visibleCount = 0;
        galleryItems.forEach((item) => {
            const visible =
                selected === "all" || item.dataset.category === selected;
            item.hidden = !visible;
            if (visible) visibleCount += 1;
        });
        if (siteStatus)
            siteStatus.textContent = `${visibleCount} photographs shown.`;
        galleryControllers.forEach((controller) => controller.refresh());
    });
});

const lightbox = document.querySelector("#gallery-lightbox");
if (lightbox) {
    const image = lightbox.querySelector(".lightbox__image");
    const caption = lightbox.querySelector(".lightbox__caption");
    const closeButton = lightbox.querySelector(".lightbox__close");
    let lastOpener = null;
    document.querySelectorAll(".gallery-item[data-full]").forEach((item) => {
        item.addEventListener("click", () => {
            lastOpener = item;
            image.src = item.dataset.full;
            image.alt =
                item.querySelector("img")?.alt ||
                "Catering and event photograph";
            caption.textContent =
                item.dataset.caption || "Catering and event photograph";
            lightbox.showModal();
            closeButton.focus();
        });
    });
    closeButton.addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", () => {
        image.removeAttribute("src");
        if (lastOpener) lastOpener.focus();
    });
}

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = reducedMotionQuery.matches;
if ("IntersectionObserver" in window && !prefersReducedMotion) {
    document.documentElement.classList.add("js-motion");
    const observer = new IntersectionObserver(
        (entries, activeObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    activeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );
    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-current-year]").forEach((item) => {
    item.textContent = String(new Date().getFullYear());
});
