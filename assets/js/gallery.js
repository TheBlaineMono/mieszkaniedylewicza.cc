function initGallery() {
  const map = {
    salon: [
      'images/salon/salon-11.jpeg',
      'images/salon/salon-10.jpeg',
      'images/salon/salon-14.jpeg',
      'images/salon/salon-18.jpeg',
      'images/salon/salon-2.jpeg'
    ],
    kuchnia: [
      'images/kuchnia/kuchnia-1.jpeg',
      'images/kuchnia/kuchnia-2.jpeg',
      'images/kuchnia/kuchnia-3.jpeg',
      'images/kuchnia/kuchnia-4.jpeg',
      'images/kuchnia/kuchnia-5.jpeg'
    ],
    przedpokoj: [
      'images/przedpokoj/przedpokoj-1.jpg',
      'images/przedpokoj/przedpokoj-2.jpg',
      'images/przedpokoj/przedpokoj-3.jpeg',
      'images/przedpokoj/balkon-2.jpg'
    ],
    duza_lazienka: [
      'images/duza_lazienka/duza_lazienka-1.jpg',
      'images/duza_lazienka/duza_lazienka-2.jpg',
      'images/duza_lazienka/duza_lazienka-3.jpg',
      'images/duza_lazienka/duza_lazienka-4.jpg'
    ],
    toaleta: [
      'images/toaleta/toaleta-1.jpeg',
      'images/toaleta/toaleta-2.jpeg',
      'images/toaleta/toaleta-3.jpeg',
      'images/toaleta/toaleta-4.jpeg'
    ],
    sypialnia: [
      'images/sypialnia/sypialnia-1.jpg',
      'images/sypialnia/sypialnia-3.jpg',
      'images/sypialnia/sypialnia-7.jpg',
      'images/sypialnia/sypialnia-8.jpg'
    ],
    drugi_pokoj: [
      'images/drugi_pokoj/maly_pokoj-1.jpg',
      'images/drugi_pokoj/maly_pokoj-3.jpg',
      'images/drugi_pokoj/maly_pokoj-4.jpg',
      'images/drugi_pokoj/maly_pokoj-5.jpg'
    ]
  };

  let lightboxState = { isOpen: false, roomId: null, index: 0 };
  let sectionIndexes = {}; // Track index for each room section

  const openLightbox = (src, alt, roomId, index) => {
    const overlay = document.getElementById('lightboxOverlay');
    const image = document.getElementById('lightboxImage');
    if (!overlay || !image) return;
    image.src = src;
    image.alt = alt;
    lightboxState = { isOpen: true, roomId, index };
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    const overlay = document.getElementById('lightboxOverlay');
    const image = document.getElementById('lightboxImage');
    if (!overlay || !image) return;
    
    // Sync the gallery index with the lightbox state before closing
    if (lightboxState.roomId && sectionIndexes[lightboxState.roomId] !== undefined) {
      const section = document.getElementById(lightboxState.roomId);
      if (section) {
        const stage = section.querySelector('.subgallery-stage');
        if (stage) {
          const slides = stage.querySelectorAll('.subslide');
          slides.forEach((s, i) => s.classList.toggle('active', i === lightboxState.index));
          sectionIndexes[lightboxState.roomId] = lightboxState.index;
        }
      }
    }
    
    overlay.style.display = 'none';
    image.src = '';
    document.body.style.overflow = '';
    lightboxState = { isOpen: false, roomId: null, index: 0 };
  };

  const updateLightboxImage = () => {
    if (!lightboxState.isOpen || !lightboxState.roomId) return;
    const images = map[lightboxState.roomId];
    if (!images) return;
    const src = images[lightboxState.index];
    const image = document.getElementById('lightboxImage');
    if (image) {
      image.src = src;
      image.alt = `${lightboxState.roomId} ${lightboxState.index + 1}`;
    }
  };

  const overlay = document.getElementById('lightboxOverlay');
  const closeButton = document.getElementById('lightboxClose');
  const prevButton = document.getElementById('lightboxPrev');
  const nextButton = document.getElementById('lightboxNext');
  
  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) closeLightbox();
  });
  closeButton?.addEventListener('click', closeLightbox);
  
  prevButton?.addEventListener('click', () => {
    if (!lightboxState.isOpen || !lightboxState.roomId) return;
    lightboxState.index = (lightboxState.index - 1 + map[lightboxState.roomId].length) % map[lightboxState.roomId].length;
    updateLightboxImage();
  });
  
  nextButton?.addEventListener('click', () => {
    if (!lightboxState.isOpen || !lightboxState.roomId) return;
    lightboxState.index = (lightboxState.index + 1) % map[lightboxState.roomId].length;
    updateLightboxImage();
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (event) => {
    if (!lightboxState.isOpen) return;
    if (event.key === 'ArrowLeft') {
      lightboxState.index = (lightboxState.index - 1 + map[lightboxState.roomId].length) % map[lightboxState.roomId].length;
      updateLightboxImage();
    } else if (event.key === 'ArrowRight') {
      lightboxState.index = (lightboxState.index + 1) % map[lightboxState.roomId].length;
      updateLightboxImage();
    } else if (event.key === 'Escape') {
      closeLightbox();
    }
  });

  document.querySelectorAll('.content-section').forEach((section) => {
    const id = section.id;
    const stage = section.querySelector('.subgallery-stage');
    const prev = section.querySelector('[data-prev]');
    const next = section.querySelector('[data-next]');
    if (!id || !stage || !prev || !next || !map[id]) return;

    const images = map[id];
    sectionIndexes[id] = 0; // Initialize index for this room

    stage.innerHTML = images.map((src, i) => `
      <div class="subslide${i === 0 ? ' active' : ''}">
        <img loading="lazy" decoding="async" src="${src}" alt="${id} ${i + 1}" data-lightbox>
      </div>
    `).join('');

    const slides = () => stage.querySelectorAll('.subslide');

    const render = (n) => {
      sectionIndexes[id] = (n + images.length) % images.length;
      slides().forEach((s, i) => s.classList.toggle('active', i === sectionIndexes[id]));
      
      // If lightbox is open and shows this room, update it
      if (lightboxState.isOpen && lightboxState.roomId === id) {
        lightboxState.index = sectionIndexes[id];
        updateLightboxImage();
      }
    };

    stage.addEventListener('click', (event) => {
      const img = event.target.closest('img');
      if (!img) return;
      // Find which subslide contains the clicked image
      const clickedSlide = img.closest('.subslide');
      if (!clickedSlide) return;
      const allSlides = Array.from(slides());
      const actualIndex = allSlides.indexOf(clickedSlide);
      if (actualIndex === -1) return;
      openLightbox(images[actualIndex], `${id} ${actualIndex + 1}`, id, actualIndex);
      sectionIndexes[id] = actualIndex; // Sync idx with the clicked image
    });

    prev.addEventListener('click', () => render(sectionIndexes[id] - 1));
    next.addEventListener('click', () => render(sectionIndexes[id] + 1));
  });

}

if (document.querySelector('[data-include]')) {
  document.addEventListener('includes:loaded', initGallery);
} else {
  document.addEventListener('DOMContentLoaded', initGallery);
}