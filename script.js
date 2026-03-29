/* IBStore — Kaya Unite Style Interactions */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileClose = document.getElementById('mobileNavClose');

  if (menuToggle && mobileOverlay) {
    menuToggle.addEventListener('click', () => {
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeMobileNav = () => {
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) closeMobileNav();
    });
  }

  // ============================================
  // SIZE SELECTOR
  // ============================================
  const sizeBtns = document.querySelectorAll('.size-btn:not(.disabled)');
  sizeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ============================================
  // QUANTITY SELECTOR
  // ============================================
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyInput = document.getElementById('qtyInput');

  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value);
      if (val > 1) qtyInput.value = val - 1;
    });

    qtyPlus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value);
      if (val < 10) qtyInput.value = val + 1;
    });

    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 10) val = 10;
      qtyInput.value = val;
    });
  }

  // ============================================
  // ACCORDIONS
  // ============================================
  const accordionToggles = document.querySelectorAll('[data-accordion-toggle]');
  accordionToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const accordion = toggle.closest('[data-accordion]');
      const isOpen = accordion.classList.contains('open');

      // Close all others
      document.querySelectorAll('[data-accordion]').forEach(a => a.classList.remove('open'));

      // Toggle current
      if (!isOpen) {
        accordion.classList.add('open');
      }
    });
  });

  // Open first accordion by default
  const firstAccordion = document.querySelector('[data-accordion]');
  if (firstAccordion) firstAccordion.classList.add('open');

  // ============================================
  // GALLERY — Scroll reveal (desktop) + Carousel (mobile)
  // ============================================
  const galleryItems = document.querySelectorAll('[data-gallery-item]');
  const galleryList = document.querySelector('.product-gallery__list');
  const galleryDots = document.querySelectorAll('.gallery-dot');
  const prevBtn = document.querySelector('[data-gallery-prev]');
  const nextBtn = document.querySelector('[data-gallery-next]');
  let currentSlide = 0;
  const totalSlides = galleryItems.length;

  // Desktop: IntersectionObserver for fade-in reveal
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    galleryItems.forEach(item => revealObserver.observe(item));
  } else {
    galleryItems.forEach(item => item.classList.add('visible'));
  }

  // Mobile carousel functions
  const isMobile = () => window.innerWidth <= 900;

  const goToSlide = (index) => {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    if (galleryList) {
      galleryList.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    galleryDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  };

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  galleryDots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
    });
  });

  // Touch swipe for mobile carousel
  let touchStartX = 0;
  let touchEndX = 0;
  const galleryEl = document.querySelector('.product-gallery');

  if (galleryEl) {
    galleryEl.addEventListener('touchstart', (e) => {
      if (!isMobile()) return;
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    galleryEl.addEventListener('touchend', (e) => {
      if (!isMobile()) return;
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    }, { passive: true });
  }

  // ============================================
  // IMAGE ZOOM (desktop only)
  // ============================================
  const zoomOverlay = document.getElementById('zoomOverlay');
  const zoomImg = document.getElementById('zoomImg');
  const zoomClose = document.getElementById('zoomClose');
  const galleryImages = document.querySelectorAll('.product-gallery__item img');

  galleryImages.forEach((img) => {
    img.addEventListener('click', () => {
      if (isMobile()) return; // No zoom on mobile
      if (zoomOverlay && zoomImg) {
        zoomImg.src = img.src;
        zoomImg.alt = img.alt;
        zoomOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeZoom = () => {
    if (zoomOverlay) {
      zoomOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (zoomClose) zoomClose.addEventListener('click', closeZoom);
  if (zoomOverlay) {
    zoomOverlay.addEventListener('click', (e) => {
      if (e.target === zoomOverlay) closeZoom();
    });
  }

  // Close overlays with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeZoom();
      closeDrawer();
    }
  });

  // ============================================
  // DRAWER CART
  // ============================================
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCart = document.getElementById('drawerCart');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBody = document.getElementById('drawerBody');
  const drawerFooter = document.getElementById('drawerFooter');
  const drawerTotal = document.getElementById('drawerTotal');
  const cartToggle = document.getElementById('cartToggle');
  const cartCount = document.getElementById('cartCount');

  let cart = [];

  const openDrawer = () => {
    if (drawerOverlay && drawerCart) {
      drawerOverlay.classList.add('active');
      drawerCart.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDrawer = () => {
    if (drawerOverlay && drawerCart) {
      drawerOverlay.classList.remove('active');
      drawerCart.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (cartToggle) cartToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  const formatPrice = (n) => {
    return '$' + n.toLocaleString('es-CL');
  };

  const renderCart = () => {
    if (!drawerBody) return;

    if (cart.length === 0) {
      drawerBody.innerHTML = '<div class="drawer-cart__empty"><p>Tu carrito está vacío</p></div>';
      if (drawerFooter) drawerFooter.style.display = 'none';
      if (cartCount) cartCount.textContent = '0';
      return;
    }

    let total = 0;
    let totalQty = 0;

    drawerBody.innerHTML = cart.map((item, i) => {
      total += item.price * item.qty;
      totalQty += item.qty;
      return `
        <div class="cart-item">
          <div class="cart-item__img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item__details">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__variant">Talla: ${item.size} · Cant: ${item.qty}</div>
            <div class="cart-item__bottom">
              <span class="cart-item__price">${formatPrice(item.price * item.qty)}</span>
              <button class="cart-item__remove" data-index="${i}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind remove buttons
    drawerBody.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        cart.splice(idx, 1);
        renderCart();
      });
    });

    if (drawerFooter) {
      drawerFooter.style.display = 'block';
      if (drawerTotal) drawerTotal.textContent = formatPrice(total);
    }

    if (cartCount) cartCount.textContent = totalQty.toString();
  };

  // ============================================
  // ADD TO CART
  // ============================================
  const addToCartBtn = document.getElementById('addToCart');

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const activeSize = document.querySelector('.size-btn.active');
      const size = activeSize ? activeSize.dataset.size : '40';
      const qty = parseInt(qtyInput?.value || 1);

      // Check if same size already in cart
      const existing = cart.find(item => item.size === size);
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({
          name: 'Jeans Destroyed Negro',
          size: size,
          price: 22990,
          qty: qty,
          image: 'images/product-1.jpg'
        });
      }

      // Button feedback
      addToCartBtn.textContent = 'Añadido ✓';
      addToCartBtn.classList.add('added');

      setTimeout(() => {
        addToCartBtn.textContent = 'Agregar al carrito';
        addToCartBtn.classList.remove('added');
      }, 1500);

      renderCart();
      openDrawer();
    });
  }

});
