// ========================
// GLOBAL SCRIPT
// ========================

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------
  // Logo fallback
  // ------------------------
  const logo = document.getElementById('logoImg');
  if (logo) {
    logo.addEventListener('error', () => {
      if (!logo.dataset.triedFallback) {
        logo.dataset.triedFallback = '1';
        logo.src = 'image/logo.png';
      }
    });
  }

  // ------------------------
  // Include header and footer
  // ------------------------
  function loadHTML(elementId, filePath) {
    fetch(filePath)
      .then(response => response.text())
      .then(html => {
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = html;
        }
      })
      .catch(error => console.log('Error loading ' + filePath + ':', error));
  }

  // Load header and initialize dropdown after it loads
  fetch('./header.html')
    .then(response => response.text())
    .then(html => {
      const element = document.getElementById('header-placeholder');
      if (element) {
        element.innerHTML = html;
        // Initialize dropdown functionality AFTER header is loaded
        initializeDropdown();
        initializeMobileNav();
      }
    })
    .catch(error => console.log('Error loading header.html:', error));

  // Load footer (no special timing needed)
  loadHTML('footer-placeholder', 'footer.html');

  // ------------------------
  // Mobile nav toggle function
  // ------------------------
  function initializeMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('navMenu');
    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
      });
    }
  }

  // ------------------------
  // Multi-level dropdown function
  // ------------------------
  function initializeDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const toggle = document.querySelector('.dropdown-toggle');
    const menu = document.getElementById('servicesMenu');
    const menuItems = document.querySelectorAll('.menu-item.has-submenu');

    function openDropdown() {
      if (!dropdown) return;
      dropdown.classList.add('open');
      toggle?.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      if (!dropdown) return;
      dropdown.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      menuItems.forEach(item => item.classList.remove('open'));
    }

    function toggleDropdown() {
      if (!dropdown) return;
      dropdown.classList.contains('open') ? closeDropdown() : openDropdown();
    }

    toggle?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });

    menuItems.forEach(menuItem => {
      const submenu = menuItem.querySelector('.submenu');
      menuItem.addEventListener('mouseenter', () => {
        menuItems.forEach(item => { if (item !== menuItem) item.classList.remove('open'); });
        menuItem.classList.add('open');
      });
      menuItem.addEventListener('mouseleave', (e) => {
        if (!submenu) return;
        const rect = submenu.getBoundingClientRect();
        const { clientX: mouseX, clientY: mouseY } = e;
        if (mouseX < rect.left || mouseX > rect.right || mouseY < rect.top || mouseY > rect.bottom) {
          setTimeout(() => {
            if (!menuItem.matches(':hover') && !submenu.matches(':hover')) {
              menuItem.classList.remove('open');
            }
          }, 100);
        }
      });
      submenu?.addEventListener('mouseenter', () => { menuItem.classList.add('open'); });
      submenu?.addEventListener('mouseleave', () => { menuItem.classList.remove('open'); });
    });

    // Extra touch handler for submenu toggle on mobile
    menuItems.forEach(menuItem => {
      menuItem.addEventListener('click', (e) => {
        const itemRect = menuItem.getBoundingClientRect();
        const clickX = e.clientX - itemRect.left;

        // if click is in the rightmost 40px, toggle submenu
        if (clickX > itemRect.width - 40) {
          e.preventDefault(); // stop link navigation
          menuItem.classList.toggle('open');
        }
        // otherwise, let the <a> link behave normally
      });
    });

    document.addEventListener('click', (e) => {
      if (!dropdown) return;
      if (!dropdown.contains(e.target)) { closeDropdown(); }
    });

    toggle?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeDropdown(); }
      if (e.key === 'ArrowDown') {
        openDropdown();
        const first = menu?.querySelector('.menu-item');
        first?.focus();
        e.preventDefault();
      }
    });

    menu?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeDropdown(); toggle?.focus(); }
    });
  }

  // ------------------------
  // Carousel (only if exists)
  // ------------------------
  const slides = document.getElementsByClassName("carousel-slide");
  const dotsContainer = document.querySelector(".dots-container");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");

  if (slides.length > 0 && dotsContainer) {
    let slideIndex = 0;

    function showSlides(n) {
      if (n >= slides.length) slideIndex = 0;
      if (n < 0) slideIndex = slides.length - 1;
      for (let slide of slides) slide.style.display = "none";
      const dots = document.getElementsByClassName("dot");
      for (let dot of dots) dot.classList.remove("active");
      slides[slideIndex].style.display = "block";
      if (dots.length) dots[slideIndex].classList.add("active");
    }

    function currentSlide(n) { slideIndex = n; showSlides(slideIndex); }

    // Create dots dynamically
    for (let i = 0; i < slides.length; i++) {
      let dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => currentSlide(i));
      dotsContainer.appendChild(dot);
    }

    function autoSlide() { slideIndex++; showSlides(slideIndex); setTimeout(autoSlide, 5000); }

    showSlides(slideIndex);
    autoSlide();
  }

  // =========================
  // FAQ collapse functionality
  // =========================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const arrow = question.querySelector('.arrow');

    question.addEventListener('click', () => {
      // Toggle the show class
      const isShowing = answer.classList.toggle('show');
      
      // Update arrow
      if (arrow) {
        arrow.textContent = isShowing ? '−' : '+';
      }
    });
  });

}); // <-- end of DOMContentLoaded listener
