/* ================================
   HANZALAH SERVICES - JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initPortfolioFilter();
  initTestimonialsSlider();
  initContactForm();
  initScrollAnimations();
  initCounters();
  initBackToTop();
});

/* ================================
   NAVBAR FUNCTIONALITY
   ================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add scrolled class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
  });

  // Update active nav link
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ================================
   MOBILE MENU
   ================================ */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ================================
   SMOOTH SCROLL
   ================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ================================
   PORTFOLIO FILTER
   ================================ */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items
      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const category = item.dataset.category;

        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ================================
   TESTIMONIALS SLIDER
   ================================ */
function initTestimonialsSlider() {
  const slider = document.getElementById('testimonialsSlider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = document.querySelectorAll('.dot');
  const items = document.querySelectorAll('.testimonial-item');

  let currentIndex = 0;
  const totalItems = items.length;
  let autoSlideInterval;

  // Update slider position
  function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateSlider();
  }

  // Previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateSlider();
  }

  // Auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Event listeners
  nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      currentIndex = index;
      updateSlider();
      startAutoSlide();
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  // Touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoSlide();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Start auto slide
  startAutoSlide();
}

/* ================================
   CONTACT FORM VALIDATION
   ================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const message = document.getElementById('message');

    // Reset errors
    resetErrors();

    // Validate fields
    let isValid = true;

    if (!name.value.trim()) {
      showError(name);
      isValid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email);
      isValid = false;
    }

    if (!service.value) {
      showError(service);
      isValid = false;
    }

    if (!message.value.trim()) {
      showError(message);
      isValid = false;
    }

    if (isValid) {
      // Get phone number from the form (optional field)
      const phone = document.getElementById('phone').value;

      // Prepare WhatsApp message
      const whatsappNumber = '923129225163'; // Your WhatsApp number (remove + and spaces)
      const whatsappMessage = `*New Contact Form Submission*%0A%0A` +
        `*Name:* ${name.value}%0A` +
        `*Email:* ${email.value}%0A` +
        `*Phone:* ${phone || 'Not provided'}%0A` +
        `*Service:* ${service.options[service.selectedIndex].text}%0A` +
        `*Message:* ${message.value}`;

      // Open WhatsApp
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
      window.open(whatsappURL, '_blank');

      // Show success message
      showSuccessMessage();

      // Reset form
      form.reset();
    }
  });

  function showError(field) {
    field.closest('.form-group').classList.add('error');
  }

  function resetErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #10b981 0%, #34d399 100%); border-radius: 1rem; color: white; margin-bottom: 1rem;">
        <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3 style="margin-bottom: 0.5rem;">Message Sent Successfully!</h3>
        <p>Thank you for contacting us. We'll get back to you shortly.</p>
      </div>
    `;

    // Insert before form
    form.parentNode.insertBefore(successDiv, form);
    form.style.display = 'none';

    // Remove success message after 5 seconds
    setTimeout(() => {
      successDiv.remove();
      form.style.display = 'grid';
    }, 5000);
  }

  // Real-time validation
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      const group = input.closest('.form-group');

      if (input.hasAttribute('required') && !input.value.trim()) {
        group.classList.add('error');
      } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
        group.classList.add('error');
      } else {
        group.classList.remove('error');
      }
    });

    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('error');
    });
  });
}

/* ================================
   SCROLL ANIMATIONS
   ================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* ================================
   ANIMATED COUNTERS
   ================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  // Observe parent sections
  const heroStats = document.querySelector('.hero-stats');
  const aboutStats = document.querySelector('.stats-row');

  if (heroStats) observer.observe(heroStats);
  if (aboutStats) observer.observe(aboutStats);

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  }
}

/* ================================
   BACK TO TOP BUTTON
   ================================ */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ================================
   UTILITY FUNCTIONS
   ================================ */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
} 

// Add loading animation on page load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Animate hero elements
  const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-buttons, .hero-stats');
  heroElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`;
  });
});

// Handle resize events
window.addEventListener('resize', debounce(() => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768) {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
}, 250));
