(function() {
    'use strict';

    // ===== LOADER =====
    window.addEventListener('load', function() {
        const loader = document.getElementById('loader');
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1200);
    });

    // ===== PARTICLES =====
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.8 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.speedY = (Math.random() - 0.5) * 0.35;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > w) this.speedX *= -1;
            if (this.y < 0 || this.y > h) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 212, 255, ' + this.opacity + ')';
            ctx.fill();
        }
    }

    const particleCount = Math.min(120, Math.floor((w * h) / 8000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawParticles() {
        ctx.clearRect(0, 0, w, h);
        for (let p of particles) {
            p.update();
            p.draw();
        }
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.08 * (1 - dist / 130)) + ')';
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // ===== CURSOR GLOW =====
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 60) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // ===== HAMBURGER =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', function() {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // ===== DARK MODE =====
    const darkToggle = document.getElementById('darkToggle');
    let isDark = true;
    darkToggle.addEventListener('click', function() {
        isDark = !isDark;
        document.body.classList.toggle('light-mode', !isDark);
        darkToggle.textContent = isDark ? '🌙' : '☀️';
        localStorage.setItem('ai-store-theme', isDark ? 'dark' : 'light');
    });
    const savedTheme = localStorage.getItem('ai-store-theme');
    if (savedTheme === 'light') {
        isDark = false;
        document.body.classList.add('light-mode');
        darkToggle.textContent = '☀️';
    }

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(function(entries) {
        for (let entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    for (let el of revealElements) {
        revealObserver.observe(el);
    }

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    for (let item of faqItems) {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');
            for (let other of faqItems) {
                other.classList.remove('open');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // ===== DYNAMIC QR & UPI =====
    const upiId = '7991163709@kotakbank';
    const qrImage = document.getElementById('qrImage');
    const qrBadge = document.getElementById('qrBadge');
    const qrPriceDisplay = document.getElementById('qrPriceDisplay');
    const upiPayLink = document.getElementById('upiPayLink');
    const appSelect = document.getElementById('selectedApp');
    const QR_API = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=';

    function updatePayment() {
        const selected = appSelect.value;
        let amount = 699;
        let priceStr = '₹699';
        let appName = 'Zara Assistant';

        switch (selected) {
            case 'Zara Assistant':
                amount = 699;
                priceStr = '₹699';
                appName = 'Zara Assistant';
                break;
            case 'MAX Assistant':
                amount = 599;
                priceStr = '₹599';
                appName = 'MAX Assistant';
                break;
            case 'Jarvis Assistant':
                amount = 399;
                priceStr = '₹399';
                appName = 'Jarvis Assistant';
                break;
            case 'Zara + MAX':
                amount = 1099;
                priceStr = '₹1,099';
                appName = 'Zara + MAX';
                break;
            case 'MAX + Jarvis':
                amount = 899;
                priceStr = '₹899';
                appName = 'MAX + Jarvis';
                break;
            case 'Zara + Jarvis':
                amount = 999;
                priceStr = '₹999';
                appName = 'Zara + Jarvis';
                break;
            default:
                amount = 699;
                priceStr = '₹699';
                appName = 'Zara Assistant';
        }

        const upiLink = 'upi://pay?pa=' + upiId + '&pn=AI%20Store&am=' + amount + '&cu=INR';
        qrImage.src = QR_API + encodeURIComponent(upiLink);
        qrBadge.textContent = appName + ' · ' + priceStr;
        qrPriceDisplay.textContent = priceStr;
        upiPayLink.href = upiLink;
        upiPayLink.textContent = '🔓 Pay ' + priceStr + ' Now';
    }
    appSelect.addEventListener('change', updatePayment);
    updatePayment();

    // ===== UPI COPY =====
    window.copyUPI = function() {
        const upi = upiId;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(upi).then(() => alert('✅ UPI ID copied!\n\n' + upi)).catch(() =>
                fallbackCopy(upi));
        } else { fallbackCopy(upi); }
    };

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy');
            alert('✅ UPI ID copied!\n\n' + text); } catch (e) { alert('⚠️ Copy manually: ' + text); }
        document.body.removeChild(ta);
    }

    // ===== ORDER FORM =====
    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const app = document.getElementById('selectedApp').value;
        const utr = document.getElementById('utr').value.trim();
        if (!name || !email || !whatsapp || !app || !utr) {
            alert('⚠️ Please fill in all fields before submitting.');
            return;
        }

        let price = '₹699';
        if (app === 'MAX Assistant') price = '₹599';
        else if (app === 'Jarvis Assistant') price = '₹399';
        else if (app === 'Zara + MAX') price = '₹1,099';
        else if (app === 'MAX + Jarvis') price = '₹899';
        else if (app === 'Zara + Jarvis') price = '₹999';

        // WhatsApp number for verification: 9871484409
        const msg = 'Hello AI Store,%0A%0ANew Order%0AName: ' + encodeURIComponent(name) + '%0AEmail: ' +
            encodeURIComponent(email) + '%0AWhatsApp: ' + encodeURIComponent(whatsapp) + '%0AApp: ' +
            encodeURIComponent(app) + '%0AAmount: ' + encodeURIComponent(price) + '%0AUTR: ' + encodeURIComponent(utr) +
            '%0A%0APlease verify my payment and send my license key.';
        window.open('https://wa.me/9871484409?text=' + msg, '_blank');
        alert('✅ Order sent via WhatsApp for verification.');

        // Show hidden WhatsApp support elements
        document.querySelectorAll('.hidden-support').forEach(function(el) {
            el.classList.remove('hidden-support');
        });
    });

    // ===== BUY NOW =====
    document.querySelectorAll('.buy-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const appName = this.getAttribute('data-app');
            const select = document.getElementById('selectedApp');
            for (let opt of select.options) {
                if (opt.value === appName) {
                    select.value = appName;
                    break;
                }
            }
            updatePayment();
            document.getElementById('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(function() {
                document.getElementById('utr').focus();
            }, 800);
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = 80;
                const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ===== UTR PASTE FEEDBACK =====
    document.getElementById('utr').addEventListener('paste', function() {
        this.style.borderColor = 'var(--neon-blue)';
        setTimeout(() => this.style.borderColor = '', 1500);
    });

    console.log('🚀 AI Store – WhatsApp hidden initially, shows after payment. Verification: 9871484409');
})();