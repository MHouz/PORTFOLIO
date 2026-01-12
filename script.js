 // Scroll animations, mobile menu toggle, and contact -> WhatsApp handler
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileNav = document.getElementById('mobile-nav');
            
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', function() {
                    mobileNav.classList.toggle('hidden');
                });
            }
            
            // Close mobile menu when a nav link is clicked
            const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileNav.classList.add('hidden');
                });
            });
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1
            });
            
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
            
            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Contact form -> open WhatsApp with message
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();

                    const name = (document.getElementById('name') || {}).value || '';
                    const email = (document.getElementById('email') || {}).value || '';
                    const subject = (document.getElementById('subject') || {}).value || '';
                    const message = (document.getElementById('message') || {}).value || '';

                    if (!message.trim()) {
                        alert('Please enter a message before sending.');
                        return;
                    }

                    // Your WhatsApp number in international format without + or spaces
                    const waNumber = '212710825506';

                    let text = `Message from ${name || 'Guest'}\n`;
                    if (email) text += `Email: ${email}\n`;
                    if (subject) text += `Subject: ${subject}\n`;
                    text += `\n${message}`;

                    const waUrl = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text);

                    // Open WhatsApp (new tab on desktop, app on mobile)
                    window.open(waUrl, '_blank');

                    // Optionally reset the form after opening WhatsApp
                    // contactForm.reset();
                });
            }

            // --- GSAP animations for Skills section ---
            try {
                if (window.gsap && window.ScrollTrigger) {
                    gsap.registerPlugin(ScrollTrigger, Draggable);

                    // Slide-in skill tiles (tech tiles)
                    const skillTiles = document.querySelectorAll('#skills .skill-tile');
                    if (skillTiles.length) {
                        gsap.from(skillTiles, {
                            x: -60,
                            opacity: 0,
                            stagger: 0.12,
                            duration: 0.7,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: '#skills',
                                start: 'top 80%',
                                toggleActions: 'play none none reverse'
                            }
                        });

                        // Make tiles draggable on desktop - they snap back on release
                        skillTiles.forEach(tile => {
                            Draggable.create(tile, {
                                type: 'x,y',
                                edgeResistance: 0.85,
                                bounds: window.document.body,
                                inertia: true,
                                onDragEnd: function() {
                                    gsap.to(this.target, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
                                }
                            });
                        });
                    }

                    // Slide-in left-side skill bars
                    const skillBars = document.querySelectorAll('#skills .animate-on-scroll > .mb-6');
                    if (skillBars.length) {
                        gsap.from(skillBars, {
                            y: 40,
                            opacity: 0,
                            stagger: 0.12,
                            duration: 0.7,
                            ease: 'power3.out',
                            scrollTrigger: { trigger: '#skills', start: 'top 80%' }
                        });
                    }
                }
            } catch (err) {
                console.warn('GSAP init error', err);
            }
        });