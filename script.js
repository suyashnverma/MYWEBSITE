// ========================
// GLOBAL SCRIPT
// ========================

// ========================
// BREADCRUMB MAPPING
// ========================
const breadcrumbMap = {
  'index.html': { title: 'Home', parent: null },
  
  // Services
  'services.html': { title: 'Services', parent: 'index.html' },
  
  // Editorial Services
  'editorial-services.html': { title: 'Editorial Services', parent: 'services.html' },
  'developmental-editing.html': { title: 'Developmental Editing', parent: 'editorial-services.html' },
  'copyediting.html': { title: 'Copyediting', parent: 'editorial-services.html' },
  'proofreading.html': { title: 'Proofreading', parent: 'editorial-services.html' },
  
  // Design Production
  'design-production.html': { title: 'Design Production', parent: 'services.html' },
  'book-layout.html': { title: 'Book Layout and Typesetting', parent: 'design-production.html' },
  'cover-design.html': { title: 'Cover Design', parent: 'design-production.html' },
  'illustrations.html': { title: 'Illustrations & Graphics', parent: 'design-production.html' },
  
  // Publishing & Distribution
  'publishing-distribution.html': { title: 'Publishing & Distribution', parent: 'services.html' },
  'isbn.html': { title: 'ISBN Registration', parent: 'publishing-distribution.html' },
  'printing.html': { title: 'Printing', parent: 'publishing-distribution.html' },
  'ebook-conversion.html': { title: 'E-book Conversion', parent: 'publishing-distribution.html' },
  'distribution.html': { title: 'Distribution', parent: 'publishing-distribution.html' },
  
  // Marketing & Promotion
  'marketing-promotion.html': { title: 'Marketing & Promotion', parent: 'services.html' },
  
  // Legal & Administrative
  'legal-administrative.html': { title: 'Legal & Administrative', parent: 'services.html' },
  
  // Professional Services
  'professional-services.html': { title: 'Professional Services', parent: 'services.html' },
  'translation.html': { title: 'Literary Translation', parent: 'professional-services.html' },
  'academic-writing.html': { title: 'Academic Assistance', parent: 'professional-services.html' },
  'research-writing.html': { title: 'Research Assistance', parent: 'professional-services.html' },
  'cinematic-writing.html': { title: 'Cinematic Writing Solutions', parent: 'professional-services.html' },
  'mission-driven.html': { title: 'Mission Driven Publishing', parent: 'professional-services.html' },
  
  // Contributors
  'contributors.html': { title: 'Contributors', parent: 'index.html' },
  'contributors-editorial team.html': { title: 'Editorial Team', parent: 'contributors.html' },
  'contributors-publishing specialists.html': { title: 'Publishing Specialists', parent: 'contributors.html' },
  'contributors-marketing professionals.html': { title: 'Marketing Team', parent: 'contributors.html' },
  'contributors-research writers.html': { title: 'Research Writers', parent: 'contributors.html' },
  
  // About & Contact
'about.html': { title: 'About', parent: 'index.html' },
'contact.html': { title: 'Contact', parent: 'index.html' },

// Legal & Policy Pages
'privacy policy.html': { title: 'Privacy Policy', parent: 'index.html' },
'terms of service.html': { title: 'Terms of Service', parent: 'index.html' },
'faq.html': { title: 'FAQs', parent: 'index.html' }
};

// ========================
// BREADCRUMB GENERATION + HELPERS
// ========================

/**
 * small helper to humanize filenames when mapping missing
 */
function humanizeFilename(name) {
  return name
    .replace(/\.html$/i, '')
    .replace(/[-_.]/g, ' ')
    .replace(/\b\w/g, ch => ch.toUpperCase())
    .trim();
}

/**
 * generateBreadcrumbs()
 * Builds breadcrumbs based on breadcrumbMap (must exist globally)
 * Injects into #breadcrumb-list and manages visibility & top offset.
 */
function generateBreadcrumbs() {
  const breadcrumbContainer = document.getElementById('breadcrumb-container');
  const breadcrumbList = document.getElementById('breadcrumb-list');
  if (!breadcrumbContainer || !breadcrumbList) return;

  // determine current page file name
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  currentPage = currentPage.split('?')[0].split('#')[0];

  // ✅ decode URL encoding (%20 → space, etc.)
  currentPage = decodeURIComponent(currentPage);

  // hide on homepage
  if (currentPage === '' || currentPage === 'index.html') {
    document.body.classList.add('homepage');
    breadcrumbContainer.style.display = 'none';
    return;
  } else {
    breadcrumbContainer.style.display = ''; // ensure visible when applicable
    document.body.classList.remove('homepage');
  }

  // ...rest of your existing code stays unchanged


  // build trail
  let trail = [];
  let page = currentPage;

  if (breadcrumbMap && breadcrumbMap[page]) {
    while (page && breadcrumbMap[page]) {
      trail.unshift({
        title: breadcrumbMap[page].title || humanizeFilename(page),
        url: breadcrumbMap[page].url || page
      });
      page = breadcrumbMap[page].parent;
    }
  } else {
    // fallback: single breadcrumb from filename
    trail = [{ title: humanizeFilename(currentPage), url: currentPage }];
  }

  // render
  breadcrumbList.innerHTML = '';
  trail.forEach((item, index) => {
    const li = document.createElement('li');

    if (index < trail.length - 1) { // not last => link + separator
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.appendChild(a);

      const sep = document.createElement('span');
      sep.classList.add('breadcrumb-separator');
      sep.textContent = '›';
      li.appendChild(sep);
    } else { // last => current page
      const span = document.createElement('span');
      span.textContent = item.title;
      span.classList.add('current');
      span.setAttribute('aria-current', 'page');
      li.appendChild(span);
    }

    breadcrumbList.appendChild(li);
  });

 // Set initial breadcrumb position based on header height
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    const updateBreadcrumbPosition = () => {
      const headerHeight = headerEl.getBoundingClientRect().height;
      breadcrumbContainer.style.setProperty('--header-height', `${headerHeight}px`);
    };
    updateBreadcrumbPosition();
  }

  // show/hide on scroll (only attach once)
  if (!generateBreadcrumbs._scrollAttached) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        breadcrumbContainer.classList.add('visible');
      } else {
        breadcrumbContainer.classList.remove('visible');
      }
    }, { passive: true });

    generateBreadcrumbs._scrollAttached = true;
  }

  // Header hide/show on scroll
  if (!generateBreadcrumbs._headerScrollAttached) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const nav = document.getElementById('navMenu');
          
          // Close mobile menu if open during scroll
          if (nav && nav.classList.contains('open')) {
            nav.classList.remove('open');
            const hamburger = document.getElementById('hamburger');
            if (hamburger) {
              hamburger.setAttribute('aria-expanded', 'false');
            }
          }

          // Hide header on scroll down, show on scroll up
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down & past threshold
            headerEl?.classList.add('hidden');
            breadcrumbContainer?.classList.add('header-hidden');
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up
            headerEl?.classList.remove('hidden');
            breadcrumbContainer?.classList.remove('header-hidden');
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    generateBreadcrumbs._headerScrollAttached = true;
  }
}

/**
 * waitForElement(selector, timeoutMs) -> Promise
 * Use when header is injected asynchronously and you can't easily call generateBreadcrumbs immediately.
 */
function waitForElement(selector, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timed out waiting for ${selector}`));
    }, timeoutMs);
  });
}




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

      // ✅ Generate breadcrumbs now that header exists
      generateBreadcrumbs();
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

      // If nav is being closed, also reset submenus
      if (!isOpen) {
        document.querySelectorAll('.menu-item.has-submenu').forEach(item => {
          item.classList.remove('open');
        });
        document.querySelectorAll('.submenu-toggle').forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '▸';
        });
      }
    });
  }
}


  // ------------------------
  // Multi-level dropdown function
  // ------------------------
function initializeDropdown() {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    const menuItems = dropdown.querySelectorAll('.menu-item.has-submenu');

    function openDropdown() {
  // Close all other dropdowns first
  dropdowns.forEach(d => {
    if (d !== dropdown) {
      d.classList.remove('open');
      const otherToggle = d.querySelector('.dropdown-toggle');
      if (otherToggle) {
        otherToggle.setAttribute('aria-expanded', 'false');
      }
      // Also close any submenus inside
      d.querySelectorAll('.menu-item.has-submenu').forEach(item => item.classList.remove('open'));
    }
  });

  // Now open this one
  dropdown.classList.add('open');
  toggle?.setAttribute('aria-expanded', 'true');
}


    function closeDropdown() {
      dropdown.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      menuItems.forEach(item => item.classList.remove('open'));
    }

    function toggleDropdown() {
      dropdown.classList.contains('open') ? closeDropdown() : openDropdown();
    }

    // Toggle dropdown on click
    toggle?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });

    // Desktop hover for items with submenu
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

    // Mobile submenu toggles (only for dropdowns that have them)
    menuItems.forEach(menuItem => {
      const submenuToggle = menuItem.querySelector('.submenu-toggle');
      if (submenuToggle) {
        submenuToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Close others
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

          // Toggle this one
          const isOpen = menuItem.classList.toggle('open');
          submenuToggle.textContent = isOpen ? '✕' : '▸';
          submenuToggle.setAttribute('aria-expanded', String(isOpen));
        });
      }
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) { closeDropdown(); }
    });

    // Keyboard navigation
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

// ========================
// SERVICES PAGE - DYNAMIC ARROW CONNECTIONS WITH SMART ROUTING
// ========================

// Only run on services page
if (document.querySelector('.section--process-flow')) {
  
  const canvas = document.querySelector('.arrow-canvas');
  const processContainer = document.querySelector('.process-flow-container');
  
  if (canvas && processContainer) {
    
    // Create arrowhead markers
    function createArrowMarkers() {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      
      // Main arrow marker (for card-to-card connections)
      const mainMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      mainMarker.setAttribute('id', 'arrowhead-main');
      mainMarker.setAttribute('markerWidth', '10');
      mainMarker.setAttribute('markerHeight', '10');
      mainMarker.setAttribute('refX', '9');
      mainMarker.setAttribute('refY', '3');
      mainMarker.setAttribute('orient', 'auto');
      mainMarker.setAttribute('markerUnits', 'strokeWidth');
      mainMarker.classList.add('main-arrow-marker');
      
      const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      mainPath.setAttribute('d', 'M0,0 L0,6 L9,3 z');
      mainMarker.appendChild(mainPath);
      
      // Sub-service arrow marker
      const subMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      subMarker.setAttribute('id', 'arrowhead-sub');
      subMarker.setAttribute('markerWidth', '8');
      subMarker.setAttribute('markerHeight', '8');
      subMarker.setAttribute('refX', '7');
      subMarker.setAttribute('refY', '3');
      subMarker.setAttribute('orient', 'auto');
      subMarker.setAttribute('markerUnits', 'strokeWidth');
      
      const subPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      subPath.setAttribute('d', 'M0,0 L0,6 L7,3 z');
      subMarker.appendChild(subPath);
      
      defs.appendChild(mainMarker);
      defs.appendChild(subMarker);
      canvas.appendChild(defs);
    }
    
    // Get center point of an element relative to container
    function getCenter(element, container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      return {
        x: elementRect.left + elementRect.width / 2 - containerRect.left,
        y: elementRect.top + elementRect.height / 2 - containerRect.top
      };
    }
    
    // Get connection points for card edges
    function getCardConnectionPoint(card, side) {
      const containerRect = processContainer.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      let x, y;
      
      if (side === 'right') {
        x = cardRect.right - containerRect.left;
        y = cardRect.top + cardRect.height / 2 - containerRect.top;
      } else if (side === 'left') {
        x = cardRect.left - containerRect.left;
        y = cardRect.top + cardRect.height / 2 - containerRect.top;
      } else if (side === 'bottom') {
        x = cardRect.left + cardRect.width / 2 - containerRect.left;
        y = cardRect.bottom - containerRect.top;
      } else if (side === 'top') {
        x = cardRect.left + cardRect.width / 2 - containerRect.left;
        y = cardRect.top - containerRect.top;
      }
      
      return { x, y };
    }
    
    // Create curved path between two points
    function createCurvedPath(start, end, isHorizontal) {
      if (isHorizontal) {
        // Horizontal flow with curve
        const midX = (start.x + end.x) / 2;
        return `M ${start.x},${start.y} C ${midX},${start.y} ${midX},${end.y} ${end.x},${end.y}`;
      } else {
        // Vertical flow with curve
        const midY = (start.y + end.y) / 2;
        return `M ${start.x},${start.y} C ${start.x},${midY} ${end.x},${midY} ${end.x},${end.y}`;
      }
    }
    
   // Create smart routed path that goes around obstacles
function createRoutedPath(start, end, currentCard, nextCard, isMobile) {
  const containerRect = processContainer.getBoundingClientRect();
  const currentRect = currentCard.getBoundingClientRect();
  const nextRect = nextCard.getBoundingClientRect();
  
  // Calculate card boundaries relative to container
  const currentBottom = currentRect.bottom - containerRect.top;
  const currentRight = currentRect.right - containerRect.left;
  const nextTop = nextRect.top - containerRect.top;
  const nextLeft = nextRect.left - containerRect.left;
  const nextRight = nextRect.right - containerRect.left;
  const nextCenterX = (nextLeft + nextRight) / 2;
  
  if (isMobile) {
    // Mobile: Simple vertical path with clearance
    const clearance = 30;
    return `M ${start.x},${start.y} L ${start.x},${end.y} L ${end.x},${end.y}`;
  } else {
    // Desktop: Route around cards
    const clearance = 50;
    
    // Check if cards are on same row (Y position similar)
    const sameRow = Math.abs(currentRect.top - nextRect.top) < 50;
    
    if (sameRow) {
      // Side by side: simple straight horizontal line
      return `M ${start.x},${start.y} L ${end.x},${end.y}`;
    } else {
      // Different rows: L-shaped path positioned in the middle of the gap
      const horizontalEnd = currentRight + clearance;
      
      // Position the horizontal line in the MIDDLE of the vertical gap
      const middleY = (currentBottom + nextTop) / 2;
      
      return `M ${start.x},${start.y} 
              L ${horizontalEnd},${start.y} 
              L ${horizontalEnd},${middleY} 
              L ${nextCenterX},${middleY} 
              L ${nextCenterX},${end.y}`;
    }
  }
}
    
    // Draw arrows between sub-services within a card
function drawSubServiceArrows() {
  const subServiceGroups = document.querySelectorAll('.sub-services');
  
  subServiceGroups.forEach(group => {
    const items = group.querySelectorAll('.sub-service-item');
    
    for (let i = 0; i < items.length - 1; i++) {
      const current = items[i];
      const next = items[i + 1];
      
      // Determine if mobile (vertical) or desktop (could be horizontal)
      const isMobile = window.innerWidth <= 768;
      
      let start, end;
      
      if (isMobile) {
        // Mobile: vertical arrows
        start = getCardConnectionPoint(current, 'bottom');
        end = getCardConnectionPoint(next, 'top');
      } else {
        // Desktop: check if items are stacked or side-by-side
        const currentRect = current.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        
        // If next item is below current (vertically stacked)
        if (nextRect.top > currentRect.bottom - 10) {
          start = getCardConnectionPoint(current, 'bottom');
          end = getCardConnectionPoint(next, 'top');
        } else {
          // Side by side
          start = getCardConnectionPoint(current, 'right');
          end = getCardConnectionPoint(next, 'left');
        }
      }
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const pathData = createCurvedPath(start, end, !isMobile && end.y === start.y);
      
      path.setAttribute('d', pathData);
            path.classList.add('sub-arrow');
      
      canvas.appendChild(path);
    }
  });
}
    
    // Draw arrows between main service cards with smart routing
function drawMainCardArrows() {
  const cards = document.querySelectorAll('.service-flow-card');
  
  if (cards.length < 2) return;
  
  const isMobile = window.innerWidth <= 768;
  
  for (let i = 0; i < cards.length - 1; i++) {
    const current = cards[i];
    const next = cards[i + 1];
    
    let start, end;
    
    if (isMobile) {
      // Mobile: vertical connection
      start = getCardConnectionPoint(current, 'bottom');
      end = getCardConnectionPoint(next, 'top');
    } else {
      // Desktop: check if cards are on same row
      const currentRect = current.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      const sameRow = Math.abs(currentRect.top - nextRect.top) < 50;
      
      if (sameRow) {
        // Same row: connect right to left
        start = getCardConnectionPoint(current, 'right');
        end = getCardConnectionPoint(next, 'left');
      } else {
        // Different rows: connect right to top
        start = getCardConnectionPoint(current, 'right');
        end = getCardConnectionPoint(next, 'top');
      }
    }
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = createRoutedPath(start, end, current, next, isMobile);
    
    path.setAttribute('d', pathData);
        path.classList.add('main-arrow');
    
    canvas.appendChild(path);
  }
}
    
    // Main draw function
    function drawAllArrows() {
      // Clear existing arrows
      while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
      }
      
      // Recreate markers
      createArrowMarkers();
      
      // Draw all arrows
      drawSubServiceArrows();
      drawMainCardArrows();
    }
    
    // Initialize
    drawAllArrows();
    
    // Redraw on window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        drawAllArrows();
      }, 150);
    });
    
    // Redraw when images load (in case layout shifts)
    const images = document.querySelectorAll('.sub-service-icon');
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', () => {
          drawAllArrows();
        });
      }
    });
  }
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