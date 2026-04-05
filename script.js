/* ═══════════════════ CBN RESORT — SCRIPT ═══════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    // ── PRELOADER ──
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 1800);
    });
    setTimeout(() => preloader.classList.add('hidden'), 3500); // fallback

    // ── NAVBAR SCROLL ──
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 80);
        backToTop.classList.toggle('visible', scrollY > 600);

        // Active nav link
        let current = '';
        sections.forEach(s => {
            const top = s.offsetTop - 120;
            if (scrollY >= top) current = s.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── MOBILE NAV ──
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-links');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    navLinks.forEach(link => link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }));

    // ── HERO PARTICLES ──
    const particlesContainer = document.getElementById('hero-particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'hero-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 6 + 's';
        p.style.animationDuration = (4 + Math.random() * 4) + 's';
        p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
        particlesContainer.appendChild(p);
    }

    // ── INTERSECTION OBSERVER (Reveal) ──
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('revealed'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    // ── GALLERY LIGHTBOX ──
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let lightboxIndex = 0;
    const galleryData = [];

    galleryItems.forEach((item, i) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-item-caption');
        galleryData.push({ src: img.src, alt: img.alt, caption: caption ? caption.textContent : '' });
        item.addEventListener('click', () => openLightbox(i));
    });

    function openLightbox(i) {
        lightboxIndex = i;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    function updateLightbox() {
        const d = galleryData[lightboxIndex];
        lightboxImg.src = d.src;
        lightboxImg.alt = d.alt;
        lightboxCaption.textContent = d.caption;
    }
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxIndex = (lightboxIndex - 1 + galleryData.length) % galleryData.length;
        updateLightbox();
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxIndex = (lightboxIndex + 1) % galleryData.length;
        updateLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // ── TESTIMONIALS CAROUSEL ──
    const track = document.getElementById('testimonial-track');
    const cards = track.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonial-dots');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    let testimonialIndex = 0;

    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToTestimonial(i));
        dotsContainer.appendChild(dot);
    });

    function goToTestimonial(i) {
        testimonialIndex = i;
        track.style.transform = `translateX(-${i * 100}%)`;
        dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, j) => d.classList.toggle('active', j === i));
    }
    prevBtn.addEventListener('click', () => goToTestimonial((testimonialIndex - 1 + cards.length) % cards.length));
    nextBtn.addEventListener('click', () => goToTestimonial((testimonialIndex + 1) % cards.length));

    // Auto-advance
    let autoPlay = setInterval(() => goToTestimonial((testimonialIndex + 1) % cards.length), 5000);
    [prevBtn, nextBtn, ...dotsContainer.children].forEach(el => {
        el.addEventListener('click', () => { clearInterval(autoPlay); autoPlay = setInterval(() => goToTestimonial((testimonialIndex + 1) % cards.length), 5000); });
    });

    // ── CONTACT FORM ──
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('form-submit-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Reservation Confirmed! ✓</span>';
        btn.style.background = '#2ecc71';
        btn.style.borderColor = '#2ecc71';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    });

    // ── NEWSLETTER ──
    const newsletter = document.getElementById('newsletter-form');
    newsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletter-email');
        const val = input.value;
        input.value = 'Subscribed! ✓';
        input.style.color = '#2ecc71';
        setTimeout(() => { input.value = ''; input.style.color = ''; }, 2000);
    });

    // ── SET MIN DATE FOR CHECK-IN ──
    const today = new Date().toISOString().split('T')[0];
    const checkin = document.getElementById('guest-checkin');
    const checkout = document.getElementById('guest-checkout');
    if (checkin) checkin.min = today;
    checkin.addEventListener('change', () => { checkout.min = checkin.value; });

    // ── STAT COUNTER ANIMATION ──
    const statValues = document.querySelectorAll('.stat-value');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statValues.forEach(el => statObserver.observe(el));

    function animateCounter(el) {
        const text = el.textContent;
        const match = text.match(/^([\d.]+)/);
        if (!match) return;
        const target = parseFloat(match[1]);
        const suffix = text.replace(match[1], '');
        const isDecimal = text.includes('.');
        const duration = 1500;
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = isDecimal ? (target * eased).toFixed(1) : Math.floor(target * eased);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
});
