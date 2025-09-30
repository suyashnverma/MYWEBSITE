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

    


  // Desktop hover behavior
menuItems.forEach(menuItem => {
  menuItem.addEventListener('mouseenter', () => {
    if (window.innerWidth > 860) {
      menuItems.forEach(item => item.classList.remove('open'));
      menuItem.classList.add('open');
    }
  });

  menuItem.addEventListener('mouseleave', () => {
    if (window.innerWidth > 860) {
      setTimeout(() => {
        if (!menuItem.matches(':hover')) {
          menuItem.classList.remove('open');
        }
      }, 100);
    }
  });
});



    // Mobile: Handle submenu toggle button clicks
    menuItems.forEach(menuItem => {
      const submenuToggle = menuItem.querySelector('.submenu-toggle');
      
    if (submenuToggle) {
  submenuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close all other submenus first
    menuItems.forEach(item => {
      if (item !== menuItem) {
        item.classList.remove('open');
        const otherToggle = item.querySelector('.submenu-toggle');
        if (otherToggle) {
          otherToggle.setAttribute('aria-expanded', 'false');
          otherToggle.textContent = '▸';
        }
      }
    });
    
    // Toggle this submenu
    const isOpen = menuItem.classList.toggle('open');
    
    // Change arrow to X when open, back to arrow when closed
    submenuToggle.textContent = isOpen ? '✕' : '▸';
    
    // Update aria attribute
    submenuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}
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

  // Contributors carousel – manual navigation per card WITH touch support
  document.querySelectorAll('.contributor-card').forEach(card => {
    const slides = card.querySelectorAll('.slide');
    const dots = card.querySelectorAll('.dot');

    // Dot click functionality
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        slides[i].classList.add('active');
        dot.classList.add('active');
      });
    });

    // Touch-based swipe functionality for mobile
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const carousel = card.querySelector('.carousel');
    if (carousel) {
      // Touch start
      carousel.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isSwiping = false;
      }, { passive: false });

      // Touch move
      carousel.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        // If horizontal swipe is detected, prevent vertical scrolling
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
          e.preventDefault();
          isSwiping = true;
        }
      }, { passive: false });

      // Touch end
      carousel.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > minSwipeDistance) {
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
        
        isSwiping = false;
      }, { passive: false });
    }
  });

  // ========================
  // LIGHTBOX IMAGE VIEWER
  // ========================

  // Lightbox elements
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxCurrent = document.getElementById('lightbox-current');
  const lightboxTotal = document.getElementById('lightbox-total');

  // Variables to track current state
  let currentCard = null;
  let currentImages = [];
  let currentIndex = 0;

  // Function to open lightbox
  function openLightbox(card, slideIndex) {
    currentCard = card;
    
    // Get all images from this card's carousel
    const slides = card.querySelectorAll('.slide img');
    currentImages = Array.from(slides).map(img => ({
      src: img.src,
      alt: img.alt
    }));
    
    currentIndex = slideIndex;
    
    // Update lightbox
    updateLightboxImage();
    
    // Show lightbox
    lightbox.style.display = 'flex';
    setTimeout(() => {
      lightbox.classList.add('show');
    }, 10);
    
    // Prevent body scroll
    document.body.classList.add('lightbox-open');
  }

  // Function to close lightbox
  function closeLightbox() {
    lightbox.classList.remove('show');
    setTimeout(() => {
      lightbox.style.display = 'none';
    }, 300);
    
    // Re-enable body scroll
    document.body.classList.remove('lightbox-open');
    
    // Reset
    currentCard = null;
    currentImages = [];
    currentIndex = 0;
  }

  // Function to update lightbox image
  function updateLightboxImage() {
    if (currentImages.length === 0) return;
    
    const image = currentImages[currentIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    
    // Update counter
    lightboxCurrent.textContent = currentIndex + 1;
    lightboxTotal.textContent = currentImages.length;
  }

  // Function to show next image
  function showNextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightboxImage();
  }

  // Function to show previous image
  function showPrevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
  }

  // Event Listeners for Expand Icons
  document.querySelectorAll('.expand-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent carousel navigation
      
      const slideIndex = parseInt(icon.dataset.slideIndex);
      const card = icon.closest('.contributor-card');
      
      openLightbox(card, slideIndex);
    });
  });

  // Event Listener for Close Button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Event Listeners for Navigation Buttons
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrevImage();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextImage();
    });
  }

  // Close lightbox when clicking on dark background
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      // Only close if clicking the background, not the image or buttons
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    // Only respond if lightbox is open
    if (!lightbox.classList.contains('show')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrevImage();
        e.preventDefault();
        break;
      case 'ArrowRight':
        showNextImage();
        e.preventDefault();
        break;
    }
  });

  // Touch/Swipe Support for Lightbox
  let lightboxTouchStartX = 0;
  let lightboxTouchStartY = 0;
  let lightboxIsSwiping = false;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      if (!lightbox.classList.contains('show')) return;
      
      const touch = e.touches[0];
      lightboxTouchStartX = touch.clientX;
      lightboxTouchStartY = touch.clientY;
      lightboxIsSwiping = false;
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
      if (!lightbox.classList.contains('show')) return;
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - lightboxTouchStartX;
      const deltaY = touch.clientY - lightboxTouchStartY;
      
      // Detect horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        lightboxIsSwiping = true;
      }
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      if (!lightbox.classList.contains('show')) return;
      if (!lightboxIsSwiping) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - lightboxTouchStartX;
      const minSwipeDistance = 50;
      
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right - show previous
          showPrevImage();
        } else {
          // Swipe left - show next
          showNextImage();
        }
      }
      
      lightboxIsSwiping = false;
    }, { passive: true });
  }

  // Prevent image dragging in lightbox
  if (lightboxImg) {
    lightboxImg.addEventListener('dragstart', (e) => {
      e.preventDefault();
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