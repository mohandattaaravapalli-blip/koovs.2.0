/* ============================================================
   KOOVS — MASTER APPLICATION ENGINE (CURATED PLACEHOLDER CATALOG)
   - 10 Curated Capsule Collections (10 Placeholder Items Each)
   - Pre-rendered 3D Circular Carousel Engine (Never Blank)
   - Everyday Apparel Gender & 60% Sliding Hero Flow
   - Camera AR Virtual Fitting Room Engine & PDP Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ----------------------------------------------------------
     1. STICKY HEADER & SCROLL SHADOW
     ---------------------------------------------------------- */
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ----------------------------------------------------------
     2. MOBILE MENU DRAWER CONTROLS
     ---------------------------------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const menuDrawer = document.getElementById('menuDrawer');
  const menuDrawerClose = document.getElementById('menuDrawerClose');
  const menuDrawerOverlay = document.getElementById('menuDrawerOverlay');
  const menuLinks = document.querySelectorAll('.menu-drawer__link');

  const openMenu = () => {
    if (!menuDrawer) return;
    menuDrawer.classList.add('open');
    menuDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!menuDrawer) return;
    menuDrawer.classList.remove('open');
    menuDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (menuDrawerClose) menuDrawerClose.addEventListener('click', closeMenu);
  if (menuDrawerOverlay) menuDrawerOverlay.addEventListener('click', closeMenu);

  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ----------------------------------------------------------
     3. PERSISTENT SHOPPING CART ENGINE & DRAWER CONTROLS
     ---------------------------------------------------------- */
  let koovsCart = JSON.parse(sessionStorage.getItem('koovs_cart_items') || '[]');

  const updateCartHeaderBadge = () => {
    const totalCount = koovsCart.reduce((sum, item) => sum + item.qty, 0);
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
      cartBadge.textContent = totalCount;
    }
  };

  const renderCartDrawerUI = () => {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalItems = document.getElementById('cartTotalItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    if (!cartItemsList) return;

    if (koovsCart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-bag-shopping"></i>
          <p class="font-milker" style="font-size: 18px; color: #fff; margin: 0;">YOUR BAG IS EMPTY</p>
          <span style="font-size: 12px; color: var(--color-gray-400);">Explore Exclusive Drip to start collecting.</span>
        </div>
      `;
      if (cartTotalItems) cartTotalItems.textContent = '0';
      if (cartSubtotal) cartSubtotal.textContent = '₹0';
      return;
    }

    let subtotalCalc = 0;
    let totalItemsCalc = 0;

    cartItemsList.innerHTML = koovsCart.map((item, index) => {
      totalItemsCalc += item.qty;
      const numPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10) || 0;
      subtotalCalc += numPrice * item.qty;

      return `
        <div class="cart-item-card" data-index="${index}">
          <div class="cart-item-img">
            <i class="fa-solid fa-shirt"></i>
          </div>
          <div class="cart-item-details">
            <span class="cart-item-tag">${item.collection || 'EXCLUSIVE DRIP'}</span>
            <span class="cart-item-title">${item.title}</span>
            <span class="cart-item-price">${item.price}</span>
            <div class="cart-item-controls">
              <button type="button" class="cart-qty-btn cart-qty-minus" data-id="${item.id}">-</button>
              <span class="cart-qty-val">${item.qty}</span>
              <button type="button" class="cart-qty-btn cart-qty-plus" data-id="${item.id}">+</button>
            </div>
          </div>
          <button type="button" class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    }).join('');

    if (cartTotalItems) cartTotalItems.textContent = totalItemsCalc;
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotalCalc.toLocaleString('en-IN')}`;

    // Item controls event listeners inside cart drawer
    cartItemsList.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const targetItem = koovsCart.find(i => i.id === id);
        if (targetItem) {
          if (targetItem.qty > 1) {
            targetItem.qty--;
          } else {
            koovsCart = koovsCart.filter(i => i.id !== id);
          }
          saveCart();
        }
      });
    });

    cartItemsList.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const targetItem = koovsCart.find(i => i.id === id);
        if (targetItem) {
          targetItem.qty++;
          saveCart();
        }
      });
    });

    cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        koovsCart = koovsCart.filter(i => i.id !== id);
        saveCart();
      });
    });
  };

  const saveCart = () => {
    sessionStorage.setItem('koovs_cart_items', JSON.stringify(koovsCart));
    updateCartHeaderBadge();
    renderCartDrawerUI();
  };

  const addItemToCart = (item, addQty = 1) => {
    const existing = koovsCart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += addQty;
    } else {
      koovsCart.push({
        id: item.id,
        title: item.title,
        price: item.price,
        collection: item.collection || 'EXCLUSIVE DRIP',
        qty: addQty
      });
    }
    saveCart();
  };

  // Cart Drawer open/close controls
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawerClose = document.getElementById('cartDrawerClose');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

  if (cartBtn && cartDrawer) {
    cartBtn.addEventListener('click', () => {
      cartDrawer.classList.add('open');
      cartDrawer.setAttribute('aria-hidden', 'false');
      renderCartDrawerUI();
    });
  }

  const closeCartDrawer = () => {
    if (cartDrawer) {
      cartDrawer.classList.remove('open');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
  };

  if (cartDrawerClose) cartDrawerClose.addEventListener('click', closeCartDrawer);
  if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCartDrawer);

  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      if (koovsCart.length === 0) {
        alert('Your bag is empty! Add items before proceeding to checkout.');
        return;
      }
      alert('⚡ KOOVS Checkout simulation ready. Thank you for placing your order!');
      koovsCart = [];
      saveCart();
      closeCartDrawer();
    });
  }

  // Initialize cart badge on page load
  updateCartHeaderBadge();

  /* ----------------------------------------------------------
     HOMEPAGE HERO CARDS — INTERACTIVE 3D TILT ENGINE
     ---------------------------------------------------------- */
  const heroCards = document.querySelectorAll('.hero-card');

  heroCards.forEach(card => {
    let rAF = null;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-8 deg to +8 deg max)
      const rotateX = (((y - centerY) / centerY) * -8).toFixed(2);
      const rotateY = (((x - centerX) / centerX) * 8).toFixed(2);

      // Glare position percentage
      const glareX = ((x / rect.width) * 100).toFixed(1);
      const glareY = ((y / rect.height) * 100).toFixed(1);

      if (rAF) cancelAnimationFrame(rAF);

      rAF = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);
        card.style.borderColor = 'var(--color-accent-red)';
        card.style.boxShadow = `0 32px 80px rgba(0, 0, 0, 0.9), 0 0 40px var(--color-accent-glow)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (rAF) cancelAnimationFrame(rAF);

      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
      card.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      card.style.boxShadow = `0 24px 60px rgba(0, 0, 0, 0.8), 0 0 25px var(--color-accent-glow)`;
    });
  });

  /* ----------------------------------------------------------
     4. EXCLUSIVE DRIP — 10 CURATED CAPSULES (10 ITEMS EACH)
     ---------------------------------------------------------- */
  const exclusiveCapsulesData = {
    spiderman: [
      { id: 'spidey-1', title: 'Spider Hoodie 01', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹2,499' },
      { id: 'spidey-2', title: 'Spider Tee 02', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹1,699' },
      { id: 'spidey-3', title: 'Spider Cargo Pants 03', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹2,699' },
      { id: 'spidey-4', title: 'Spider Washed Jacket 04', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹2,999' },
      { id: 'spidey-5', title: 'Symbiote Heavy Crewneck 05', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹2,299' },
      { id: 'spidey-6', title: 'Web-Slinger Denim Jeans 06', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹2,699' },
      { id: 'spidey-7', title: 'Oscorp Tech Anorak 07', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹2,999' },
      { id: 'spidey-8', title: 'Daily Bugle Vintage Tee 08', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹1,899' },
      { id: 'spidey-9', title: 'Peter Parker Flannel Shirt 09', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹2,199' },
      { id: 'spidey-10', title: 'Miles Morales Track Pants 10', tag: 'SPIDER-MAN: BRAND NEW DAY', price: '₹2,499' }
    ],
    drake: [
      { id: 'drake-1', title: 'Drake Oversized Tee 01', tag: 'DRAKE CONCERT COLLECTION', price: '₹1,899' },
      { id: 'drake-2', title: 'Drake Gold Owl Hoodie 02', tag: 'DRAKE CONCERT COLLECTION', price: '₹2,499' },
      { id: 'drake-3', title: 'Drake Heavy Trousers 03', tag: 'DRAKE CONCERT COLLECTION', price: '₹2,699' },
      { id: 'drake-4', title: 'Drake Leather Varsity Jacket 04', tag: 'DRAKE CONCERT COLLECTION', price: '₹2,999' },
      { id: 'drake-5', title: 'Nocturna Tour Sweatshirt 05', tag: 'DRAKE CONCERT COLLECTION', price: '₹2,299' },
      { id: 'drake-6', title: 'Champagne Papi Silk Shirt 06', tag: 'DRAKE CONCERT COLLECTION', price: '₹2,499' },
      { id: 'drake-7', title: 'Certified Lover Denim 07', tag: 'DRAKE CONCERT COLLECTION', price: '₹2,699' },
      { id: 'drake-8', title: 'Her Loss Washed Cap & Tee 08', tag: 'DRAKE CONCERT COLLECTION', price: '₹1,499' },
      { id: 'drake-9', title: 'Revenge Tour Tracksuit 09', tag: 'DRAKE CONCERT COLLECTION', price: '₹2,999' },
      { id: 'drake-10', title: "October's Very Own Shorts 10", tag: 'DRAKE CONCERT COLLECTION', price: '₹1,899' }
    ],
    cjp: [
      { id: 'cjp-1', title: 'CJP Rally Tee 01', tag: 'CJP PROTEST COLLECTION', price: '₹1,699' },
      { id: 'cjp-2', title: 'CJP Distressed Hoodie 02', tag: 'CJP PROTEST COLLECTION', price: '₹2,499' },
      { id: 'cjp-3', title: 'CJP Tactical Cargo 03', tag: 'CJP PROTEST COLLECTION', price: '₹2,699' },
      { id: 'cjp-4', title: 'CJP Denim Jacket 04', tag: 'CJP PROTEST COLLECTION', price: '₹2,999' },
      { id: 'cjp-5', title: 'Justice Manifesto Sweatshirt 05', tag: 'CJP PROTEST COLLECTION', price: '₹2,299' },
      { id: 'cjp-6', title: 'Activist Utility Vest 06', tag: 'CJP PROTEST COLLECTION', price: '₹2,499' },
      { id: 'cjp-7', title: 'Liberation Heavy Trousers 07', tag: 'CJP PROTEST COLLECTION', price: '₹2,699' },
      { id: 'cjp-8', title: 'Unity Graphic Longsleeve 08', tag: 'CJP PROTEST COLLECTION', price: '₹1,899' },
      { id: 'cjp-9', title: 'Freedom Heavyweight Fleece 09', tag: 'CJP PROTEST COLLECTION', price: '₹2,499' },
      { id: 'cjp-10', title: 'Protest Raw Hem Shorts 10', tag: 'CJP PROTEST COLLECTION', price: '₹1,899' }
    ],
    sabrina: [
      { id: 'sabrina-1', title: 'Sabrina Tour Baby Tee 01', tag: 'SABRINA CARPENTER TOUR', price: '₹1,499' },
      { id: 'sabrina-2', title: 'Sabrina Espresso Tee 02', tag: 'SABRINA CARPENTER TOUR', price: '₹1,699' },
      { id: 'sabrina-3', title: 'Sabrina Tour Hoodie 03', tag: 'SABRINA CARPENTER TOUR', price: '₹2,299' },
      { id: 'sabrina-4', title: 'Sabrina Corset Top 04', tag: 'SABRINA CARPENTER TOUR', price: '₹2,199' },
      { id: 'sabrina-5', title: "Short n' Sweet Sweater 05", tag: 'SABRINA CARPENTER TOUR', price: '₹2,499' },
      { id: 'sabrina-6', title: 'Taste Tour Satin Shorts 06', tag: 'SABRINA CARPENTER TOUR', price: '₹1,699' },
      { id: 'sabrina-7', title: 'Please Please Please Denim 07', tag: 'SABRINA CARPENTER TOUR', price: '₹2,699' },
      { id: 'sabrina-8', title: 'Coquette Lace Streetwear Top 08', tag: 'SABRINA CARPENTER TOUR', price: '₹1,899' },
      { id: 'sabrina-9', title: 'Sweetheart Track Pants 09', tag: 'SABRINA CARPENTER TOUR', price: '₹2,499' },
      { id: 'sabrina-10', title: 'Tour VIP Zip-Up Hoodie 10', tag: 'SABRINA CARPENTER TOUR', price: '₹2,699' }
    ],
    avengers: [
      { id: 'avengers-1', title: 'Doomsday Varsity Jacket 01', tag: 'AVENGERS: DOOMSDAY', price: '₹2,999' },
      { id: 'avengers-2', title: 'Doomsday Armor Tee 02', tag: 'AVENGERS: DOOMSDAY', price: '₹1,899' },
      { id: 'avengers-3', title: 'Doomsday Heavy Hoodie 03', tag: 'AVENGERS: DOOMSDAY', price: '₹2,699' },
      { id: 'avengers-4', title: 'Doomsday Cargo Pants 04', tag: 'AVENGERS: DOOMSDAY', price: '₹2,699' },
      { id: 'avengers-5', title: 'Latverian Anorak Shell 05', tag: 'AVENGERS: DOOMSDAY', price: '₹2,999' },
      { id: 'avengers-6', title: 'Victor Von Doom Crewneck 06', tag: 'AVENGERS: DOOMSDAY', price: '₹2,499' },
      { id: 'avengers-7', title: 'Vibranium Tactical Vest 07', tag: 'AVENGERS: DOOMSDAY', price: '₹2,699' },
      { id: 'avengers-8', title: 'Stark Tech Joggers 08', tag: 'AVENGERS: DOOMSDAY', price: '₹2,499' },
      { id: 'avengers-9', title: 'Multiverse Graphic Longsleeve 09', tag: 'AVENGERS: DOOMSDAY', price: '₹1,999' },
      { id: 'avengers-10', title: 'Endgame Oversized Tee 10', tag: 'AVENGERS: DOOMSDAY', price: '₹1,699' }
    ],
    f1: [
      { id: 'f1-1', title: 'F1 Paddock Track Pants 01', tag: 'FORMULA ONE WEEKEND', price: '₹2,699' },
      { id: 'f1-2', title: 'F1 Pit Crew Jacket 02', tag: 'FORMULA ONE WEEKEND', price: '₹2,999' },
      { id: 'f1-3', title: 'F1 Apex Heavy Tee 03', tag: 'FORMULA ONE WEEKEND', price: '₹1,699' },
      { id: 'f1-4', title: 'F1 Telemetry Hoodie 04', tag: 'FORMULA ONE WEEKEND', price: '₹2,499' },
      { id: 'f1-5', title: 'Monaco Grand Prix Sweater 05', tag: 'FORMULA ONE WEEKEND', price: '₹2,499' },
      { id: 'f1-6', title: 'Silverstone Racing Shorts 06', tag: 'FORMULA ONE WEEKEND', price: '₹1,699' },
      { id: 'f1-7', title: 'Paddock Club Leather Jacket 07', tag: 'FORMULA ONE WEEKEND', price: '₹2,999' },
      { id: 'f1-8', title: 'Checkered Flag Longsleeve 08', tag: 'FORMULA ONE WEEKEND', price: '₹1,899' },
      { id: 'f1-9', title: 'Pole Position Cargo Pants 09', tag: 'FORMULA ONE WEEKEND', price: '₹2,699' },
      { id: 'f1-10', title: 'Scuderia Vintage Tee 10', tag: 'FORMULA ONE WEEKEND', price: '₹1,699' }
    ],
    nba: [
      { id: 'nba-1', title: 'NBA Courtside Tee 01', tag: 'NBA FINALS COLLECTION', price: '₹1,699' },
      { id: 'nba-2', title: 'NBA Mesh Jersey 02', tag: 'NBA FINALS COLLECTION', price: '₹1,899' },
      { id: 'nba-3', title: 'NBA MVP Hoodie 03', tag: 'NBA FINALS COLLECTION', price: '₹2,499' },
      { id: 'nba-4', title: 'NBA Satin Bomber 04', tag: 'NBA FINALS COLLECTION', price: '₹2,999' },
      { id: 'nba-5', title: 'Hardwood Classic Trousers 05', tag: 'NBA FINALS COLLECTION', price: '₹2,699' },
      { id: 'nba-6', title: 'Championship Warmup Pants 06', tag: 'NBA FINALS COLLECTION', price: '₹2,499' },
      { id: 'nba-7', title: 'Draft Night Vintage Jacket 07', tag: 'NBA FINALS COLLECTION', price: '₹2,999' },
      { id: 'nba-8', title: 'Hall of Fame Heavy Tee 08', tag: 'NBA FINALS COLLECTION', price: '₹1,699' },
      { id: 'nba-9', title: 'Retro Basketball Shorts 09', tag: 'NBA FINALS COLLECTION', price: '₹1,899' },
      { id: 'nba-10', title: 'Finals VIP Crewneck 10', tag: 'NBA FINALS COLLECTION', price: '₹2,299' }
    ],
    anime: [
      { id: 'anime-1', title: 'Cyberpunk Neo-Tokyo Tee 01', tag: 'ANIME CAPSULE', price: '₹1,999' },
      { id: 'anime-2', title: 'Shinigami Flame Hoodie 02', tag: 'ANIME CAPSULE', price: '₹2,499' },
      { id: 'anime-3', title: 'Mech Unit Tactical Pants 03', tag: 'ANIME CAPSULE', price: '₹2,699' },
      { id: 'anime-4', title: 'Akira Distressed Jacket 04', tag: 'ANIME CAPSULE', price: '₹2,999' },
      { id: 'anime-5', title: 'Evangelion Oversized Crewneck 05', tag: 'ANIME CAPSULE', price: '₹2,299' },
      { id: 'anime-6', title: 'Hunter Acid Wash Tee 06', tag: 'ANIME CAPSULE', price: '₹1,699' },
      { id: 'anime-7', title: 'Manga Panel Denim 07', tag: 'ANIME CAPSULE', price: '₹2,699' },
      { id: 'anime-8', title: 'Shinobi Masked Hoodie 08', tag: 'ANIME CAPSULE', price: '₹2,499' },
      { id: 'anime-9', title: 'Kaiju Heavy Longsleeve 09', tag: 'ANIME CAPSULE', price: '₹1,899' },
      { id: 'anime-10', title: 'Mech Pilot Track Shorts 10', tag: 'ANIME CAPSULE', price: '₹1,699' }
    ],
    festival: [
      { id: 'festival-1', title: 'Festival VIP Hoodie 01', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹2,499' },
      { id: 'festival-2', title: 'Festival Holographic Tee 02', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹1,699' },
      { id: 'festival-3', title: 'Festival Mud-Wash Shorts 03', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹1,899' },
      { id: 'festival-4', title: 'Festival Lineup Longsleeve 04', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹1,999' },
      { id: 'festival-5', title: 'Mainstage Anorak Jacket 05', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹2,999' },
      { id: 'festival-6', title: 'Rave Glow Mesh Top 06', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹1,499' },
      { id: 'festival-7', title: 'Backstage Pass Cargo Pants 07', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹2,699' },
      { id: 'festival-8', title: 'Sunset Amphitheater Sweater 08', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹2,299' },
      { id: 'festival-9', title: 'Pyrotechnic Heavy Tee 09', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹1,699' },
      { id: 'festival-10', title: 'DJ Booth Distressed Denim 10', tag: 'MUSIC FESTIVAL COLLECTION', price: '₹2,699' }
    ],
    archive: [
      { id: 'archive-1', title: 'Vault 01 Pleated Trousers', tag: 'KOOVS LIMITED ARCHIVE', price: '₹2,699' },
      { id: 'archive-2', title: 'Vault 02 Heavy Hoodie', tag: 'KOOVS LIMITED ARCHIVE', price: '₹2,499' },
      { id: 'archive-3', title: 'Vault 03 Canvas Jacket', tag: 'KOOVS LIMITED ARCHIVE', price: '₹2,999' },
      { id: 'archive-4', title: 'Vault 04 Oversized Tee', tag: 'KOOVS LIMITED ARCHIVE', price: '₹1,699' },
      { id: 'archive-5', title: 'Vault 05 Vintage Crewneck', tag: 'KOOVS LIMITED ARCHIVE', price: '₹2,299' },
      { id: 'archive-6', title: 'Vault 06 Raw Denim Shorts', tag: 'KOOVS LIMITED ARCHIVE', price: '₹1,899' },
      { id: 'archive-7', title: 'Vault 07 Tactical Vest', tag: 'KOOVS LIMITED ARCHIVE', price: '₹2,499' },
      { id: 'archive-8', title: 'Vault 08 Distressed Sweater', tag: 'KOOVS LIMITED ARCHIVE', price: '₹2,299' },
      { id: 'archive-9', title: 'Vault 09 Leather Bomber', tag: 'KOOVS LIMITED ARCHIVE', price: '₹2,999' },
      { id: 'archive-10', title: 'Vault 10 Monogram Cargo Pants', tag: 'KOOVS LIMITED ARCHIVE', price: '₹2,699' }
    ]
  };

  // Feeling Lucky CTA Button (`index.html`)
  const luckyBtn = document.getElementById('luckyBtn');
  if (luckyBtn) {
    luckyBtn.addEventListener('click', () => {
      const capsuleKeys = Object.keys(exclusiveCapsulesData);
      const randomKey = capsuleKeys[Math.floor(Math.random() * capsuleKeys.length)];
      window.location.href = `exclusive-drip.html?collection=${randomKey}`;
    });
  }

  // Curated Collection Selector Logic (`exclusive-drip.html`)
  const dripTabs = document.querySelectorAll('#exclusiveCollectionBar .collection-tab');
  const hypeVal = document.getElementById('hypeVal');
  const hypeFill = document.getElementById('hypeFill');
  const ambientLayer = document.getElementById('ambientLayer');

  const updateHypeAndAmbient = (capsuleKey) => {
    // Generate random Hype % (85 - 99%)
    const randomHype = Math.floor(Math.random() * 15) + 85;
    if (hypeVal) hypeVal.textContent = `${randomHype}%`;
    if (hypeFill) hypeFill.style.width = `${randomHype}%`;

    // Ambient overlay theme switching
    if (ambientLayer) {
      ambientLayer.className = `ambient-layer ambient--${capsuleKey || 'spiderman'}`;
    }
  };

  if (dripTabs.length > 0) {
    dripTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        dripTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const capsuleKey = tab.getAttribute('data-drip');
        if (capsuleKey && exclusiveCapsulesData[capsuleKey]) {
          const selectedProducts = exclusiveCapsulesData[capsuleKey];
          buildDynamicCarouselCards(selectedProducts);
          updateHypeAndAmbient(capsuleKey);
        }
      });
    });

    // Check URL query param `?collection=` on page load
    const collectionParam = new URLSearchParams(window.location.search).get('collection');
    if (collectionParam && exclusiveCapsulesData[collectionParam]) {
      const targetTab = Array.from(dripTabs).find(t => t.getAttribute('data-drip') === collectionParam);
      if (targetTab) {
        targetTab.click();
      }
    }
  }

  // Drop Countdown Timer Loop (`03:21:17` -> restarts automatically)
  const dropTimer = document.getElementById('dropTimer');
  if (dropTimer) {
    let totalSeconds = 3 * 3600 + 21 * 60 + 17; // 03:21:17
    setInterval(() => {
      totalSeconds--;
      if (totalSeconds < 0) {
        totalSeconds = 4 * 3600; // Reset to 4 hours on zero
      }
      const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(totalSeconds % 60).padStart(2, '0');
      dropTimer.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
  }

  /* ----------------------------------------------------------
     5. EVERYDAY APPAREL — GENDER & CATEGORY SHOWCASE FLOW
     ---------------------------------------------------------- */
  const genderSelectionView = document.getElementById('genderSelectionView');
  const showcaseView = document.getElementById('showcaseView');

  const selectMenBtn = document.getElementById('selectMenBtn');
  const selectWomenBtn = document.getElementById('selectWomenBtn');
  const switchGenderBtn = document.getElementById('switchGenderBtn');
  const switchGenderLabel = document.getElementById('switchGenderLabel');

  const eaHeroBanner = document.getElementById('eaHeroBanner');
  const eaBannerImg = document.getElementById('eaBannerImg');
  const bannerTag = document.getElementById('bannerTag');
  const bannerTitle = document.getElementById('bannerTitle');
  const bannerDesc = document.getElementById('bannerDesc');
  const thinCategoryList = document.getElementById('thinCategoryList');

  let activeGender = 'men';
  let activeCategory = 'All';

  const categoriesMap = {
    men: ['All', 'T-Shirts', 'Shirts', 'Jeans', 'Pants', 'Shorts', 'Casual Wear', 'Formal Wear', 'Hoodies', 'Jackets'],
    women: ['All', 'Tops', 'Dresses', 'Casual Wear', 'Party Wear', 'Formal Wear', 'Pants', 'Jackets']
  };

  const getProductsForCategory = (gender, category) => {
    const isMen = gender === 'men';
    const tagPrefix = isMen ? "MEN'S" : "WOMEN'S";

    const allProducts = [
      { id: `${gender}-1`, cat: 'T-Shirts', title: `Oversized Heavy ${category === 'All' ? 'Tee' : category}`, tag: `${tagPrefix} ESSENTIALS`, price: '₹5,499' },
      { id: `${gender}-2`, cat: 'Shirts', title: `Vintage Enzyme ${category === 'All' ? 'Shirt' : category}`, tag: `${tagPrefix} ESSENTIALS`, price: '₹6,499' },
      { id: `${gender}-3`, cat: 'Jeans', title: `Japanese Selvedge ${category === 'All' ? 'Denim' : category}`, tag: `${tagPrefix} TAILORED`, price: '₹8,999' },
      { id: `${gender}-4`, cat: 'Pants', title: `Tactical Utility ${category === 'All' ? 'Pants' : category}`, tag: `${tagPrefix} ESSENTIALS`, price: '₹9,499' },
      { id: `${gender}-5`, cat: 'Casual Wear', title: `Studio Relaxed ${category === 'All' ? 'Wear' : category}`, tag: `${tagPrefix} CASUAL`, price: '₹5,999' },
      { id: `${gender}-6`, cat: 'Formal Wear', title: `Double-Breasted ${category === 'All' ? 'Blazer' : category}`, tag: `${tagPrefix} FORMAL`, price: '₹9,999' },
      { id: `${gender}-7`, cat: 'Hoodies', title: `450 GSM Terry ${category === 'All' ? 'Hoodie' : category}`, tag: `${tagPrefix} ESSENTIALS`, price: '₹7,999' },
      { id: `${gender}-8`, cat: 'Jackets', title: `Technical Shell ${category === 'All' ? 'Jacket' : category}`, tag: `${tagPrefix} OUTERWEAR`, price: '₹9,499' }
    ];

    if (category === 'All') return allProducts;
    return allProducts.filter(p => p.cat.toLowerCase() === category.toLowerCase() || category === 'All');
  };

  const launchShowcase = (gender) => {
    activeGender = gender;
    activeCategory = 'All';

    if (genderSelectionView) genderSelectionView.style.display = 'none';
    if (showcaseView) showcaseView.style.display = 'block';

    if (eaHeroBanner) {
      eaHeroBanner.style.animation = 'none';
      void eaHeroBanner.offsetWidth;
      eaHeroBanner.style.animation = 'slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }

    if (gender === 'men') {
      if (eaBannerImg) eaBannerImg.src = 'assets/images/men_banner.png';
      if (bannerTag) bannerTag.textContent = 'COLLECTION 01';
      if (bannerTitle) bannerTitle.textContent = "MEN'S ESSENTIALS";
      if (bannerDesc) bannerDesc.textContent = 'Clean, wearable daily silhouettes built for every single day.';
      if (switchGenderLabel) switchGenderLabel.textContent = 'Switch to Women';
    } else {
      if (eaBannerImg) eaBannerImg.src = 'assets/images/women_banner.png';
      if (bannerTag) bannerTag.textContent = 'COLLECTION 02';
      if (bannerTitle) bannerTitle.textContent = "WOMEN'S ESSENTIALS";
      if (bannerDesc) bannerDesc.textContent = 'Effortless casual luxury, tailoring, partywear and modern Gen Z fits.';
      if (switchGenderLabel) switchGenderLabel.textContent = 'Switch to Men';
    }

    renderThinCategoryBar(gender);
    const initialProducts = getProductsForCategory(gender, 'All');
    buildDynamicCarouselCards(initialProducts);
  };

  const renderThinCategoryBar = (gender) => {
    if (!thinCategoryList) return;
    thinCategoryList.innerHTML = '';

    categoriesMap[gender].forEach(catName => {
      const btn = document.createElement('button');
      btn.className = `thin-category-btn ${catName === 'All' ? 'active' : ''}`;
      btn.textContent = catName;

      btn.addEventListener('click', () => {
        const allBtns = thinCategoryList.querySelectorAll('.thin-category-btn');
        allBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeCategory = catName;
        const filteredProducts = getProductsForCategory(gender, catName);
        buildDynamicCarouselCards(filteredProducts);
      });

      thinCategoryList.appendChild(btn);
    });
  };

  if (selectMenBtn) selectMenBtn.addEventListener('click', () => launchShowcase('men'));
  if (selectWomenBtn) selectWomenBtn.addEventListener('click', () => launchShowcase('women'));

  if (switchGenderBtn) {
    switchGenderBtn.addEventListener('click', () => {
      const nextGender = activeGender === 'men' ? 'women' : 'men';
      launchShowcase(nextGender);
    });
  }

  /* ----------------------------------------------------------
     6. 3D INFINITE CIRCULAR CAROUSEL PHYSICS ENGINE
     ---------------------------------------------------------- */
  const ring = document.getElementById('circularRing');
  const stage = document.getElementById('circularStage');

  const spotlightTitle = document.getElementById('spotlightTitle');
  const spotlightTag = document.getElementById('spotlightTag');
  const spotlightPrice = document.getElementById('spotlightPrice');
  const spotlightCta = document.getElementById('spotlightCta');

  let activeCarouselCards = [];
  let currentAngle = 0;
  let targetVelocity = 0;
  let velocity = 0;
  let isDragging = false;
  let previousX = 0;

  // Initialize from HTML static cards if present (e.g. Spider-Man pre-rendered in exclusive-drip.html)
  const initialHtmlCards = Array.from(document.querySelectorAll('.circular-card'));
  if (initialHtmlCards.length > 0) {
    activeCarouselCards = initialHtmlCards;
    initialHtmlCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        if (id) window.location.href = `product-detail.html?id=${id}`;
      });
    });
  }

  function buildDynamicCarouselCards(products) {
    if (!ring) return;
    ring.innerHTML = '';
    activeCarouselCards = [];

    if (!products || products.length === 0) return;

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'circular-card';
      card.setAttribute('data-id', p.id);
      card.setAttribute('data-title', p.title);
      card.setAttribute('data-tag', p.tag);
      card.setAttribute('data-price', p.price);

      card.innerHTML = `
        <div class="circular-card__inner">
          <span class="circular-card__badge">COMING SOON</span>
          <div class="circular-card__placeholder">
            <span class="circular-card__watermark">KOOVS</span>
            <i class="fa-solid fa-shirt circular-card__icon"></i>
            <span class="placeholder-tag">IMAGE COMING SOON</span>
          </div>
          <div class="circular-card__content">
            <span class="circular-card__tag">${p.tag}</span>
            <h3 class="circular-card__title font-milker">${p.title}</h3>
            <span class="circular-card__price">${p.price}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        window.location.href = `product-detail.html?id=${p.id}`;
      });

      ring.appendChild(card);
      activeCarouselCards.push(card);
    });

    currentAngle = 0;
    targetVelocity = 0;
    velocity = 0;
  }

  // 60 FPS 3D Orbit Physics Loop
  const getRadius = () => window.innerWidth < 768 ? 320 : 500;

  function updateCarouselFrame() {
    if (activeCarouselCards.length === 0) return;

    velocity += (targetVelocity - velocity) * 0.15;
    currentAngle += velocity;
    targetVelocity *= 0.92;

    const numCards = activeCarouselCards.length;
    const stepAngle = 360 / numCards;
    const radius = getRadius();
    let minDistance = Infinity;
    let focusedCard = null;

    activeCarouselCards.forEach((card, index) => {
      let rawAngle = (currentAngle + index * stepAngle) % 360;
      if (rawAngle < 0) rawAngle += 360;

      const rad = (rawAngle * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const z = Math.cos(rad) * radius - radius;
      const normZ = Math.cos(rad);
      const scale = 0.72 + 0.38 * ((normZ + 1) / 2);
      const opacity = Math.max(0.25, Math.min(1.0, 0.35 + 0.65 * ((normZ + 1) / 2)));
      const rotateY = rawAngle;

      card.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity.toFixed(2);
      card.style.zIndex = Math.round(1000 + z);

      let distance = Math.abs(rawAngle > 180 ? 360 - rawAngle : rawAngle);
      if (distance < minDistance) {
        minDistance = distance;
        focusedCard = card;
      }
    });

    if (focusedCard) {
      activeCarouselCards.forEach(c => c.classList.remove('is-focused'));
      focusedCard.classList.add('is-focused');

      const title = focusedCard.getAttribute('data-title');
      const tag = focusedCard.getAttribute('data-tag');
      const price = focusedCard.getAttribute('data-price');
      const id = focusedCard.getAttribute('data-id');

      if (spotlightTitle && title) spotlightTitle.textContent = title;
      if (spotlightTag && tag) spotlightTag.textContent = tag;
      if (spotlightPrice && price) spotlightPrice.textContent = price;
      if (spotlightCta && id) spotlightCta.href = `product-detail.html?id=${id}`;
    }
  }

  if (stage && ring) {
    const loop = () => {
      updateCarouselFrame();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    // Mouse Wheel Scroll Input
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY || e.deltaX;
      targetVelocity += delta * 0.04;
    }, { passive: false });

    // Drag Controls
    const handleDragStart = (x) => {
      isDragging = true;
      previousX = x;
    };

    const handleDragMove = (x) => {
      if (!isDragging) return;
      const deltaX = x - previousX;
      targetVelocity -= deltaX * 0.15;
      previousX = x;
    };

    const handleDragEnd = () => {
      isDragging = false;
    };

    stage.addEventListener('mousedown', (e) => handleDragStart(e.clientX));
    window.addEventListener('mousemove', (e) => handleDragMove(e.clientX));
    window.addEventListener('mouseup', handleDragEnd);

    stage.addEventListener('touchstart', (e) => handleDragStart(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', (e) => handleDragMove(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', handleDragEnd);
  }

  /* ----------------------------------------------------------
     7. CAMERA AR VIRTUAL FITTING ROOM ENGINE
     ---------------------------------------------------------- */
  const arModal = document.getElementById('arModal');
  const arModalClose = document.getElementById('arModalClose');
  const arModalOverlay = document.getElementById('arModalOverlay');
  const arVideoFeed = document.getElementById('arVideoFeed');
  const arPrompt = document.getElementById('arPrompt');
  const arReticle = document.getElementById('arReticle');
  const arTriggers = document.querySelectorAll('#navArBtn, #pdpArTryBtn, .trigger-ar-modal');
  let mediaStream = null;

  const launchArCamera = async () => {
    if (!arModal) return;
    arModal.classList.add('open');
    arModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (arVideoFeed) {
          arVideoFeed.srcObject = mediaStream;
          arVideoFeed.style.display = 'block';
        }
        if (arPrompt) arPrompt.style.display = 'none';
        if (arReticle) arReticle.style.display = 'flex';
      } catch (err) {
        console.warn('Camera access not granted or unavailable:', err);
        if (arPrompt) {
          arPrompt.style.display = 'flex';
          const pTag = arPrompt.querySelector('p');
          if (pTag) pTag.textContent = 'Camera Preview Active (Simulation Mode)';
        }
      }
    }
  };

  const stopArCamera = () => {
    if (!arModal) return;
    arModal.classList.remove('open');
    arModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  };

  arTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      launchArCamera();
    });
  });

  if (arModalClose) arModalClose.addEventListener('click', stopArCamera);
  if (arModalOverlay) arModalOverlay.addEventListener('click', stopArCamera);

  const arCaptureBtn = document.getElementById('arCaptureBtn');
  if (arCaptureBtn) {
    arCaptureBtn.addEventListener('click', () => {
      arCaptureBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        arCaptureBtn.style.transform = '';
        alert('AR Snapshot Saved! Selected garment mapped to your proportions.');
      }, 200);
    });
  }

  /* ----------------------------------------------------------
     8. PRODUCT DETAIL PAGE INTERACTION
     ---------------------------------------------------------- */
  const pdpThumbs = document.querySelectorAll('.pdp-thumb');
  const pdpViewLabel = document.getElementById('pdpViewLabel');

  pdpThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      pdpThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const viewName = thumb.getAttribute('data-view');
      if (pdpViewLabel && viewName) {
        pdpViewLabel.textContent = viewName.toUpperCase();
      }
    });
  });

  const sizeBtns = document.querySelectorAll('.pdp-size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyVal = document.getElementById('qtyVal');
  let currentQty = 1;

  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyVal.textContent = currentQty;
      }
    });
    qtyPlus.addEventListener('click', () => {
      currentQty++;
      qtyVal.textContent = currentQty;
    });
  }

  const pdpAddToCartBtn = document.getElementById('pdpAddToCartBtn');
  const fitMatchToast = document.getElementById('fitMatchToast');
  const vibeMatchVal = document.getElementById('vibeMatchVal');
  let toastTimer = null;

  const showFitMatchToast = () => {
    if (!fitMatchToast) return;
    const randomVibe = Math.floor(Math.random() * 6) + 94; // 94-99%
    if (vibeMatchVal) vibeMatchVal.textContent = `${randomVibe}%`;

    fitMatchToast.classList.add('show');
    fitMatchToast.setAttribute('aria-hidden', 'false');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      fitMatchToast.classList.remove('show');
      fitMatchToast.setAttribute('aria-hidden', 'true');
    }, 3000);
  };

  if (pdpAddToCartBtn) {
    pdpAddToCartBtn.addEventListener('click', () => {
      // Find current item details from PDP
      const currentItem = productsDatabase[productId] || {
        id: productId || 'spidey-1',
        title: document.getElementById('pdpTitle')?.textContent || 'Exclusive Garment',
        price: document.getElementById('pdpPrice')?.textContent || '₹2,499',
        collection: document.getElementById('pdpCollection')?.textContent || 'EXCLUSIVE DRIP'
      };

      addItemToCart({
        id: currentItem.id || productId || 'spidey-1',
        title: currentItem.title,
        price: currentItem.price,
        collection: currentItem.collection
      }, currentQty);

      pdpAddToCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added to Cart!';
      pdpAddToCartBtn.style.backgroundColor = 'var(--color-accent-hover)';

      showFitMatchToast();

      setTimeout(() => {
        pdpAddToCartBtn.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Add to Cart';
        pdpAddToCartBtn.style.backgroundColor = 'var(--color-accent-red)';
      }, 2000);
    });
  }

  /* ----------------------------------------------------------
     10. INTERACTIVE LIVE SEARCH MODAL ENGINE
     ---------------------------------------------------------- */
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchBtn = document.getElementById('searchBtn');
  const searchModalClose = document.getElementById('searchModalClose');
  const searchModalOverlay = document.getElementById('searchModalOverlay');

  const renderSearchResults = (query) => {
    if (!searchResults) return;
    const cleanQuery = query.toLowerCase().trim();
    const allProducts = Object.keys(productsDatabase).map(key => ({
      id: key,
      ...productsDatabase[key]
    }));

    const filtered = allProducts.filter(p => {
      if (!cleanQuery) return true;
      return (p.title && p.title.toLowerCase().includes(cleanQuery)) ||
             (p.collection && p.collection.toLowerCase().includes(cleanQuery)) ||
             (p.desc && p.desc.toLowerCase().includes(cleanQuery));
    });

    if (filtered.length === 0) {
      searchResults.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; color: var(--color-gray-400);">
          <i class="fa-solid fa-ghost" style="font-size: 36px; color: var(--color-accent-red); margin-bottom: 12px;"></i>
          <p style="font-size: 16px; font-weight: 700; color: #fff; margin: 0;">NO DROPS FOUND</p>
          <span style="font-size: 13px;">No items match "${query}". Try searching "Spider", "Drake", "Hoodie", or "Shirt".</span>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = filtered.slice(0, 18).map(p => `
      <a href="product-detail.html?id=${p.id}" class="search-result-card">
        <span class="search-result-tag">${p.collection || 'EXCLUSIVE DRIP'}</span>
        <span class="search-result-title">${p.title}</span>
        <span class="search-result-price">${p.price}</span>
      </a>
    `).join('');
  };

  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('open');
      searchModal.setAttribute('aria-hidden', 'false');
      if (searchInput) {
        searchInput.focus();
        renderSearchResults('');
      }
    });
  }

  const closeSearchModal = () => {
    if (searchModal) {
      searchModal.classList.remove('open');
      searchModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (searchModalClose) searchModalClose.addEventListener('click', closeSearchModal);
  if (searchModalOverlay) searchModalOverlay.addEventListener('click', closeSearchModal);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  /* ----------------------------------------------------------
     9. DYNAMIC PDP DATA LOADER (ALL 100 ITEMS DATABASE)
     ---------------------------------------------------------- */
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Build full products dictionary dynamically from exclusiveCapsulesData
  const productsDatabase = {
    'men-1': { title: 'Oversized Heavy Tee', collection: "MEN'S ESSENTIALS", price: '₹5,499', desc: '450 GSM organic French Terry cotton with enzyme wash.' },
    'women-1': { title: 'Minimalist Relaxed Fit Top', collection: "WOMEN'S ESSENTIALS", price: '₹5,999', desc: 'Pure cotton jersey with relaxed drop-shoulder tailoring.' }
  };

  Object.keys(exclusiveCapsulesData).forEach(capsuleKey => {
    exclusiveCapsulesData[capsuleKey].forEach(item => {
      productsDatabase[item.id] = {
        title: item.title,
        collection: item.tag,
        price: item.price,
        desc: `450 GSM Heavyweight Terry Cotton with custom capsule graphics, enzyme vintage wash, and dropped shoulder Gen Z fit.`
      };
    });
  });

  if (productId && productsDatabase[productId]) {
    const item = productsDatabase[productId];
    const pdpTitle = document.getElementById('pdpTitle');
    const pdpCollection = document.getElementById('pdpCollection');
    const pdpPrice = document.getElementById('pdpPrice');
    const pdpDesc = document.getElementById('pdpDesc');
    const pdpBreadcrumbTitle = document.getElementById('pdpBreadcrumbTitle');

    if (pdpTitle) pdpTitle.textContent = item.title;
    if (pdpCollection) pdpCollection.textContent = item.collection;
    if (pdpPrice) pdpPrice.textContent = item.price;
    if (pdpDesc) pdpDesc.textContent = item.desc;
    if (pdpBreadcrumbTitle) pdpBreadcrumbTitle.textContent = item.title;
  }

  /* ----------------------------------------------------------
     10. INTERACTIVE 3D PERSPECTIVE TILT FOR HOMEPAGE CARDS
     ---------------------------------------------------------- */
  const heroCards = document.querySelectorAll('#cardDrip, #cardEveryday');
  heroCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateX = (-deltaY * 8).toFixed(2);
      const rotateY = (deltaX * 8).toFixed(2);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  /* ----------------------------------------------------------
     11. CATALOG TOOLBAR (SORT BY & FILTER DROPDOWNS)
     ---------------------------------------------------------- */
  const sortDropdown = document.getElementById('sortDropdown');
  const sortBtn = document.getElementById('sortBtn');
  const filterDropdown = document.getElementById('filterDropdown');
  const filterBtn = document.getElementById('filterBtn');

  if (sortBtn && sortDropdown) {
    sortBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (filterDropdown) filterDropdown.classList.remove('open');
      sortDropdown.classList.toggle('open');
    });
  }

  if (filterBtn && filterDropdown) {
    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sortDropdown) sortDropdown.classList.remove('open');
      filterDropdown.classList.toggle('open');
    });
  }

  document.addEventListener('click', () => {
    if (sortDropdown) sortDropdown.classList.remove('open');
    if (filterDropdown) filterDropdown.classList.remove('open');
  });

  const sortOptions = document.querySelectorAll('.toolbar-option');
  sortOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      sortOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      if (sortDropdown) sortDropdown.classList.remove('open');
      if (sortBtn) {
        const span = sortBtn.querySelector('span');
        if (span) span.textContent = `Sort: ${opt.textContent.trim()}`;
      }
    });
  });

  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = pill.parentElement;
      if (parent) {
        parent.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      }
      pill.classList.add('active');
    });
  });
});
