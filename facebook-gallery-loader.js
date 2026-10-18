(async function () {
  try {
    const response = await fetch('facebook-gallery.json', { cache: 'no-cache' });
    if (!response.ok) return;
    const data = await response.json();
    if (!Array.isArray(data.photos) || !data.photos.length) return;
    document.querySelectorAll('.gallery-grid .gallery-card').forEach((card, index) => {
      const photo = data.photos[index];
      if (!photo || !photo.image?.startsWith('assets/facebook-gallery/')) return;
      const img = card.querySelector('img');
      if (!img) return;
      img.src = photo.image;
      img.alt = photo.alt || 'Bree Made Creations product';
      card.dataset.image = photo.image;
      const label = card.querySelector('span');
      if (label) label.textContent = 'Recent Creation';
    });
  } catch (error) {
    console.warn('Keeping original gallery.', error);
  }
})();
