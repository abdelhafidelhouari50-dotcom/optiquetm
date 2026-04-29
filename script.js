/* ============================================
   OPTIQUE TAMSENA — JavaScript
   ============================================ */

'use strict';

/* === LANGUE === */
let currentLang = 'fr';

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'ar' : 'fr';
    const html  = document.getElementById('htmlRoot');
    const label = document.getElementById('langLabel');

    if (currentLang === 'ar') {
        html.lang = 'ar';
        html.dir  = 'rtl';
        document.body.classList.add('ar');
        label.textContent = 'Français';
    } else {
        html.lang = 'fr';
        html.dir  = 'ltr';
        document.body.classList.remove('ar');
        label.textContent = 'عربي';
    }

    // Mise à jour du contenu textuel
    document.querySelectorAll('[data-fr]').forEach(el => {
        const val = el.getAttribute('data-' + currentLang);
        if (!val) return;

        if (el.tagName === 'INPUT') {
            el.placeholder = val;
        } else if (el.tagName === 'OPTION') {
            el.textContent = val;
        } else {
            el.textContent = val;
        }
    });

    // Mise à jour des placeholders séparés
    const placeholders = {
        fr: {
            fName:    'Votre nom complet',
            fPhone:   '+212 6XX-XXXXXX',
            fMessage: 'Décrivez votre besoin ou posez votre question...'
        },
        ar: {
            fName:    'اسمك الكامل',
            fPhone:   '+212 6XX-XXXXXX',
            fMessage: 'اشرح حاجتك أو اطرح سؤالك...'
        }
    };

    const ph = placeholders[currentLang];
    const nameInp = document.getElementById('fName');
    const phoneInp = document.getElementById('fPhone');
    const msgInp   = document.getElementById('fMessage');

    if (nameInp)  nameInp.placeholder  = ph.fName;
    if (phoneInp) phoneInp.placeholder = ph.fPhone;
    if (msgInp)   msgInp.placeholder   = ph.fMessage;
}

/* === NAVBAR SCROLL === */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll-top button
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }

    // Active nav link
    highlightNavLink();
}, { passive: true });

/* === MOBILE MENU === */
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const ham  = document.getElementById('hamburger');
    menu.classList.toggle('open');
    ham.classList.toggle('active');
}

// Fermer le menu au clic sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navMenu').classList.remove('open');
        document.getElementById('hamburger').classList.remove('active');
    });
});

/* === ACTIVE NAV LINK === */
function highlightNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) {
            current = sec.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active-link');
        }
    });
}

/* === GALERIE FILTRE === */
function filterGallery(btn, category) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.gal-item').forEach(item => {
        const cats = (item.dataset.cat || '').split(' ');
        const match = category === 'all' || cats.includes(category);
        item.style.display = match ? 'block' : 'none';
        if (match) {
            item.style.animation = 'none';
            item.offsetHeight;
            item.style.animation = 'fadeUp 0.4s ease both';
        }
    });

    // Autoplay video when shown in video filter
    document.querySelectorAll('.gal-video video').forEach(vid => {
        if (category === 'all' || category === 'video') {
            vid.play().catch(() => {});
        } else {
            vid.pause();
        }
    });
}

/* === FORMULAIRE → WHATSAPP === */
function sendRDV(e) {
    e.preventDefault();

    const name    = document.getElementById('fName').value.trim();
    const phone   = document.getElementById('fPhone').value.trim();
    const dateVal = document.getElementById('fDate').value;
    const time    = document.getElementById('fTime').value;
    const service = document.getElementById('fService').value;
    const msg     = document.getElementById('fMessage').value.trim();

    if (!name || !phone || !dateVal || !time || !service) {
        alert(currentLang === 'fr'
            ? 'Veuillez remplir tous les champs obligatoires.'
            : 'يرجى ملء جميع الحقول الإلزامية.');
        return;
    }

    // Formater la date
    const dateObj = new Date(dateVal + 'T00:00:00');
    const dateFR  = dateObj.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Message WhatsApp
    const waMsg = [
        '🗓 *Demande de Rendez-vous — Optique Tamsena*',
        '',
        `👤 *Nom:* ${name}`,
        `📞 *Téléphone:* ${phone}`,
        `📅 *Date:* ${dateFR}`,
        `⏰ *Heure:* ${time}`,
        `🔧 *Service:* ${service}`,
        msg ? `💬 *Message:* ${msg}` : '',
        '',
        '_Envoyé depuis le site web Optique Tamsena_ 🌐'
    ].filter(line => line !== undefined && !(line === '' && !msg)).join('\n');

    const waUrl = 'https://wa.me/212666849903?text=' + encodeURIComponent(waMsg);
    window.open(waUrl, '_blank');

    // Feedback visuel
    const btn = document.querySelector('.btn-submit');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Message envoyé !</span>';
    btn.style.background = '#128C7E';

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        document.getElementById('rdvForm').reset();
    }, 3000);
}

/* === SCROLL REVEAL === */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* === DATE MINIMUM (aujourd'hui) === */
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('fDate');
    if (dateInput) {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${y}-${m}-${d}`;
    }

    // Année dans le footer
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* === WHATSAPP FLOAT — afficher après 3 sec === */
setTimeout(() => {
    const waFloat = document.getElementById('waFloat');
    if (waFloat) {
        waFloat.style.opacity = '0';
        waFloat.style.transform = 'scale(0.5)';
        waFloat.style.transition = 'all 0.5s ease';
        requestAnimationFrame(() => {
            waFloat.style.opacity = '1';
            waFloat.style.transform = 'scale(1)';
        });
    }
}, 3000);

/* === VIDEO MODAL === */
function openVideoModal() {
    const modal = document.getElementById('videoModal');
    const vid   = document.getElementById('modalVideo');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    vid.play().catch(() => {});
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const vid   = document.getElementById('modalVideo');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    vid.pause();
    vid.currentTime = 0;
}

// Fermer avec touche Échap
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeVideoModal();
});

/* === VIDEO PLAY ON CLICK === */
document.addEventListener('DOMContentLoaded', () => {
    // Charger thumbnail vidéo hero
    const hvcPreview = document.querySelector('.hvc-preview');
    if (hvcPreview) {
        hvcPreview.currentTime = 1;
        hvcPreview.load();
    }

    document.querySelectorAll('.gal-video').forEach(item => {
        const vid = item.querySelector('video');
        if (!vid) return;

        // Autoplay muted on load
        vid.play().catch(() => {});

        // Click overlay → toggle play/pause + fullscreen
        item.querySelector('.gal-overlay').addEventListener('click', () => {
            if (vid.paused) {
                vid.play();
                if (vid.requestFullscreen) vid.requestFullscreen();
            } else {
                vid.pause();
            }
        });
    });
});

/* === SMOOTH SCROLL pour liens ancre === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
