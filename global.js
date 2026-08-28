async function initApp() {
    await loadComponents();

    // ==========================================
    // 1. MOBILE MENU LOGIC (Smooth Animation)
    // ==========================================
    const menuBtn   = document.getElementById('menuBtn');
    const menuClose = document.getElementById('menuClose');
    const mobileNav = document.getElementById('mobileNav');

    function openMenu() {
        if (!mobileNav) return;
        mobileNav.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        if (!mobileNav) return;
        mobileNav.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        document.body.style.overflow = '';
    }

    if (menuBtn)   menuBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (mobileNav) {
        /* tapping any link closes the drawer */
        mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    initHeaderScroll();
    markActiveNav();
    initServiceCarousel();

    // ==========================================
    // 2. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    initCountUp();
    initRuleDraw();
}

/* Gold rules that draw themselves in, even outside a .reveal wrapper */
function initRuleDraw() {
    const rules = document.querySelectorAll('.rule-draw');
    if (!rules.length) return;
    const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('active');
            o.unobserve(e.target);
        });
    }, { threshold: 0.5 });
    rules.forEach(r => obs.observe(r));
}

/* Numbers that count up when they scroll into view */
function initCountUp() {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        nums.forEach(n => { n.textContent = n.getAttribute('data-count') + (n.dataset.suffix || ''); });
        return;
    }
    const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseFloat(el.getAttribute('data-count'));
            const suffix = el.dataset.suffix || '';
            const dur    = 1400;
            const start  = performance.now();
            (function step(now) {
                const p = Math.min(1, (now - start) / dur);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(step);
            })(start);
            o.unobserve(el);
        });
    }, { threshold: 0.4 });
    nums.forEach(n => obs.observe(n));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

async function loadComponents() {
    // Dynamically determine the root path by finding the global.js script tag
    // This allows the site to work in subdirectories (like XAMPP) and at different nesting levels.
    const scriptTag = document.querySelector('script[src*="global.js"]');
    const rootPath = scriptTag ? scriptTag.src.replace('global.js', '') : '/';

    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const resp = await fetch(rootPath + 'components/header.html');
            let html = await resp.text();
            
            // Rewrite links and sources starting with / to use the dynamic rootPath
            // This fixes navigation when the site is in a subdirectory (XAMPP/GitHub Pages)
            html = html.replace(/(href|src)="\/([^"]*)"/g, `$1="${rootPath}$2"`);
            
            headerPlaceholder.outerHTML = html;
        } catch (e) {
            console.error('Error loading header:', e);
        }
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const resp = await fetch(rootPath + 'components/footer.html');
            let html = await resp.text();
            
            // Rewrite links and sources starting with / to use the dynamic rootPath
            html = html.replace(/(href|src)="\/([^"]*)"/g, `$1="${rootPath}$2"`);
            
            footerPlaceholder.outerHTML = html;
        } catch (e) {
            console.error('Error loading footer:', e);
        }
    }
}

/* Underline the nav link matching the current page (gold, via .is-active) */
function markActiveNav() {
    const here = window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    document.querySelectorAll('.hdr-link').forEach((a) => {
        const href = (a.getAttribute('href') || '').split('#')[0]
            .replace(/index\.html$/, '').replace(/\/$/, '') || '/';
        if (href !== '/' && here.startsWith(href)) a.classList.add('is-active');
        else if (href === '/' && here === '/') a.classList.add('is-active');
    });
}

function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    /* Transparent over a full-bleed hero image, solid white once past it.
       Pages with no hero image start solid. */
    const hero = document.querySelector('[data-hero-image]');

    const handleScroll = () => {
        const trigger = hero ? hero.offsetHeight - header.offsetHeight : 0;
        if (!hero || window.scrollY > trigger) {
            header.classList.remove('on-image');
            header.classList.add('solid');
        } else {
            header.classList.add('on-image');
            header.classList.remove('solid');
        }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
}


/* ------------------------------------------------------------------
   Services carousel: vertical scroll drives horizontal travel.
   Down = cards move left, up = cards move right, continuous both ways.
------------------------------------------------------------------ */
function initServiceCarousel() {
    const rail  = document.getElementById('svc-rail');
    const pin   = document.getElementById('svc-pin');
    const track = document.getElementById('svc-track');
    const bar   = document.getElementById('svc-progress-bar');
    if (!rail || !pin || !track) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let distance = 0;

    function measure() {
        if (reduce.matches) { rail.style.height = 'auto'; return; }
        distance = Math.max(0, track.scrollWidth - window.innerWidth + (window.innerWidth * 0.12));
        rail.style.height = (window.innerHeight + distance) + 'px';
        update();
    }

    function update() {
        if (reduce.matches || !distance) return;
        const p = Math.min(1, Math.max(0, (window.scrollY - rail.offsetTop) / distance));
        track.style.transform = 'translate3d(' + (-p * distance).toFixed(1) + 'px,0,0)';
        if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    reduce.addEventListener('change', measure);
    measure();
}
