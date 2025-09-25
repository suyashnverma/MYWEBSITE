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
// Hero Carousel (for video background hero section)
// ------------------------
const carouselImages = document.querySelectorAll('.carousel-image');

let currentSlide = 0;
let carouselInterval;

if (carouselImages.length > 0) {
  function showSlide(index) {
  // Hide all images
  carouselImages.forEach(img => img.classList.remove('active'));
  
  // Show current image
  carouselImages[index].classList.add('active');
}


  function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselImages.length;
    showSlide(currentSlide);
  }

  function startCarousel() {
    carouselInterval = setInterval(nextSlide, 4000); // 4 seconds
  }

  function stopCarousel() {
    clearInterval(carouselInterval);
  }

  // Start the carousel
  startCarousel();

  

  // Pause carousel on hover
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);
  }
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



// Contributors carousel – manual navigation per card
document.querySelectorAll('.contributor-card').forEach(card => {
  const slides = card.querySelectorAll('.slide');
  const dots = card.querySelectorAll('.dot');

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      slides[i].classList.add('active');
      dot.classList.add('active');
    });
  });
});



// CORRECTED Pointer-based swipe functionality
let startX = 0;
let startY = 0;
let isDragging = false;

const carousel = card.querySelector('.carousel');
if (carousel) {
  carousel.addEventListener('pointerdown', (e) => {
    e.preventDefault(); // Prevent image dragging
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
  });

  carousel.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling and dragging
    
    const deltaX = Math.abs(e.clientX - startX);
    const deltaY = Math.abs(e.clientY - startY);
    
    // If horizontal movement is greater than vertical, we're swiping
    if (deltaX > deltaY && deltaX > 10) {
      document.body.style.overflow = 'hidden'; // Prevent page scroll during swipe
    }
  });

  carousel.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.overflow = ''; // Restore page scroll
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const minSwipeDistance = 50;
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      const currentActive = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
      let newIndex;
      
      if (deltaX > 0) {
        // Swipe right - go to previous slide
        newIndex = currentActive > 0 ? currentActive - 1 : slides.length - 1;
      } else {
        // Swipe left - go to next slide
        newIndex = currentActive < slides.length - 1 ? currentActive + 1 : 0;
      }
      
      // Update slides and dots
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      
      slides[newIndex].classList.add('active');
      dots[newIndex].classList.add('active');
    }
  });

  carousel.addEventListener('pointercancel', () => {
    isDragging = false;
    document.body.style.overflow = ''; // Restore page scroll
  });
}


}); // <-- end of DOMContentLoaded listener

// Close dropdowns and nav on page show (including back/forward navigation)
window.addEventListener('pageshow', function() {
  // Close any open dropdowns
  document.querySelectorAll('.dropdown.open').forEach(function(drop) {
    drop.classList.remove('open');
  });
  // Close nav (if open)
  var nav = document.querySelector('.nav.open');
  if (nav) nav.classList.remove('open');
});