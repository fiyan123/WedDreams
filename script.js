document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen Logic
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    let progress = 0;
    const duration = 5000; // 5 seconds
    const intervalTime = 50; // Update every 50ms
    const increment = (intervalTime / duration) * 100;

    const loadingInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);

            // Finish loading
            setTimeout(() => {
                if (loader) {
                    loader.classList.add('fade-out');

                    // Attempt autoplay
                    const weddingMusic = document.getElementById('wedding-music');
                    const musicBtn = document.getElementById('music-toggle');

                    const startMusic = () => {
                        if (weddingMusic && weddingMusic.paused) {
                            weddingMusic.play().then(() => {
                                if (musicBtn) musicBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
                                document.removeEventListener('click', startMusic);
                                document.removeEventListener('touchstart', startMusic);
                            }).catch(e => console.log("Still blocked or failed:", e));
                        }
                    };

                    document.addEventListener('click', startMusic);
                    document.addEventListener('touchstart', startMusic);

                    if (weddingMusic) {
                        weddingMusic.play().then(() => {
                            if (musicBtn) musicBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
                            document.removeEventListener('click', startMusic);
                            document.removeEventListener('touchstart', startMusic);
                        }).catch(e => {
                            console.log("Autoplay blocked. Waiting for interaction.");
                        });
                    }

                    // Remove loader from DOM after fade-out transition
                    setTimeout(() => {
                        loader.remove();
                    }, 1000);
                }
            }, 500);
        }

        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressPercent) progressPercent.textContent = Math.floor(progress);
    }, intervalTime);

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Handle "Open Invitation"
    const btnOpen = document.getElementById('btn-open');
    const hero = document.getElementById('hero');
    const mainContent = document.getElementById('main-content');
    const audio = document.getElementById('wedding-music');
    const musicBtn = document.getElementById('music-toggle');

    btnOpen.addEventListener('click', () => {
        // Hide the button instead of the entire hero-content
        btnOpen.style.transition = 'all 0.6s ease';
        btnOpen.style.opacity = '0';
        btnOpen.style.pointerEvents = 'none';
        setTimeout(() => btnOpen.style.display = 'none', 600);

        // Hide guest card smoothly (the part containing the button)
        const guestCard = document.querySelector('.guest-card');
        if (guestCard) {
            guestCard.style.transition = 'all 0.8s ease';
            guestCard.style.background = 'transparent';
            guestCard.style.boxShadow = 'none';
            guestCard.style.border = 'none';
        }

        // Start Flower Shower Effect immediately
        startFlowerShower();

        // Start music immediately
        audio.play().catch(e => console.log("Audio play deferred"));

        // Wait a bit before scrolling
        setTimeout(() => {
            // Unlock scroll
            document.body.classList.remove('no-scroll');

            // Unlock content
            mainContent.classList.replace('content-hidden', 'content-visible');

            // Scroll to content
            mainContent.scrollIntoView({ behavior: 'smooth' });

            // Refresh AOS
            setTimeout(() => {
                AOS.refresh();
            }, 500);
        }, 800);
    });

    // Music Toggle
    let isPlaying = false;
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            musicBtn.classList.add('pulse');
        } else {
            audio.pause();
            musicBtn.classList.remove('pulse');
        }
    });

    // Countdown Timer
    const weddingDate = new Date('April 11, 2026 08:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdown').innerHTML = "HAPPY WEDDING!";
        }
    };

    const countdownTimer = setInterval(updateCountdown, 1000);
    updateCountdown();

    // Flower Shower Effect
    function startFlowerShower() {
        const container = document.createElement('div');
        container.className = 'petal-container';
        document.body.appendChild(container);

        const petalCount = 120; // Increased count
        const colors = ['#ff4d6d', '#ff758f', '#ff85a1', '#f8bbd0', '#c9184a', '#a4133c']; // More vibrant colors

        for (let i = 0; i < petalCount; i++) {
            createPetal(container, colors);
        }

        // Smooth fade out before removal
        setTimeout(() => {
            container.classList.add('fade-out');
        }, 8000);

        // Remove container after animations and fade-out are done
        setTimeout(() => {
            container.remove();
        }, 10000);
    }

    function createPetal(container, colors) {
        const petal = document.createElement('div');
        petal.className = 'petal';

        const size = Math.random() * 15 + 10 + 'px';
        const left = Math.random() * 100 + 'vw';
        const delay = Math.random() * 5 + 's';
        const duration = Math.random() * 3 + 5 + 's';
        const color = colors[Math.floor(Math.random() * colors.length)];

        petal.style.width = size;
        petal.style.height = size;
        petal.style.left = left;
        petal.style.top = '-20px';
        petal.style.backgroundColor = color;
        petal.style.animationDuration = duration;
        petal.style.animationDelay = delay;

        container.appendChild(petal);
    }

    window.startFlowerShower = startFlowerShower; // Expose for debugging if needed

    // Image Modal Logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.modal-close');
    const galleryImages = document.querySelectorAll('.gallery-item img, .portrait-frame img');

    if (modal && modalImg && closeBtn) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = "block";
                modalImg.src = img.src;
                document.body.classList.add('no-scroll');
            });
        });

        const closeModal = () => {
            modal.style.display = "none";
            const mainContent = document.getElementById('main-content');
            if (mainContent && mainContent.classList.contains('content-visible')) {
                document.body.classList.remove('no-scroll');
            }
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Hero Background Slideshow (Smooth Cross-fade)
    const heroImages = [
        'assets/hero.png',
        'assets/gallery_1.png',
        'assets/gallery_2.png',
        'assets/gallery_3.png',
        'assets/gallery_4.png'
    ];
    let currentHeroIndex = 0;
    const sliderBgs = document.querySelectorAll('.hero-slider-bg');
    let activeBgIndex = 0;

    function nextHeroBackground() {
        // Prepare next image
        currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
        
        // Find next background layer
        const nextBgIndex = (activeBgIndex + 1) % sliderBgs.length;
        const nextBg = sliderBgs[nextBgIndex];
        const currentBg = sliderBgs[activeBgIndex];

        // Set next image and fade in
        nextBg.style.backgroundImage = `url('${heroImages[currentHeroIndex]}')`;
        nextBg.classList.add('active');
        
        // Fade out current
        currentBg.classList.remove('active');
        
        // Update active index
        activeBgIndex = nextBgIndex;
    }

    // Change background every 6 seconds (includes 2s transition)
    setInterval(nextHeroBackground, 6000);

    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Function to set theme
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    };

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemDarkMode.matches) {
        setTheme('dark');
    }

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Toggle Gift Details
    const btnGiftToggle = document.getElementById('btn-gift-toggle');
    const giftContent = document.getElementById('gift-content');

    if (btnGiftToggle && giftContent) {
        btnGiftToggle.addEventListener('click', () => {
            const isHidden = giftContent.classList.contains('gift-content-hidden');
            
            if (isHidden) {
                giftContent.classList.replace('gift-content-hidden', 'gift-content-visible');
                btnGiftToggle.innerHTML = '<i class="fas fa-times"></i> Tutup';
                
                // Refresh AOS to trigger animations inside the revealed content
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            } else {
                giftContent.classList.replace('gift-content-visible', 'gift-content-hidden');
                btnGiftToggle.innerHTML = '<i class="fas fa-gift"></i> Kirim Hadiah';
            }
        });
    }

    // Display Guest Name from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestElement = document.getElementById('guest-name');
    const guestFooterElement = document.getElementById('guest-name-footer');

    if (guestName) {
        // urlParams.get naturally handles '+' as spaces
        if (guestElement) guestElement.innerHTML = guestName;
        if (guestFooterElement) guestFooterElement.innerHTML = guestName;
    }

    // Listen for system theme changes
    systemDarkMode.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});

// Copy to Clipboard Function for Wedding Gift
function copyToClipboard(id, btn) {
    const el = document.getElementById(id);
    const textToCopy = el.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
    });
}

