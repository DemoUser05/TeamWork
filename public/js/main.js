document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const restaurants = track.querySelectorAll('.restaurant-link');
  const totalRestaurants = restaurants.length;
  let currentIndex = 0;
  
  const firstItems = Array.from(restaurants).slice(0, 3);
  const lastItems = Array.from(restaurants).slice(-3);
  
  firstItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });
  
  lastItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.insertBefore(clone, track.firstChild);
  });
  
  currentIndex = 3;
  updateCarousel(false);
  
  function updateCarousel(withTransition = true) {
    const cardWidth = 360;
    const gap = 24;
    const offset = currentIndex * (cardWidth + gap);
    
    track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
  }
  
  function nextSlide() {
    currentIndex++;
    updateCarousel();
    
    if (currentIndex >= totalRestaurants + 3) {
      setTimeout(() => {
        currentIndex = 3;
        updateCarousel(false);
      }, 500);
    }
  }
  
  function prevSlide() {
    currentIndex--;
    updateCarousel();
    
    if (currentIndex < 3) {
      setTimeout(() => {
        currentIndex = totalRestaurants + 2;
        updateCarousel(false);
      }, 500);
    }
  }
  
  document.querySelector('.carousel-btn.left').addEventListener('click', prevSlide);
  document.querySelector('.carousel-btn.right').addEventListener('click', nextSlide);
  
  let autoAdvance = setInterval(nextSlide, 4500);
  
  document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
    clearInterval(autoAdvance);
  });
  
  document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
    autoAdvance = setInterval(nextSlide, 4500);
  });
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(autoAdvance);
    } else {
      autoAdvance = setInterval(nextSlide, 4500);
    }
  });
  
  const style = document.createElement('style');
  style.textContent = `
    .carousel-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .carousel-btn:disabled:hover {
      background: white;
      color: #333;
    }
  `;
  document.head.appendChild(style);

  const deliveryBtn = document.getElementById('delivery-btn');
  const pickupBtn = document.getElementById('pickup-btn');
  
  if (!deliveryBtn.classList.contains('active') && !pickupBtn.classList.contains('active')) {
    deliveryBtn.classList.add('active');
  }
  
  deliveryBtn.addEventListener('click', () => {
    if (!deliveryBtn.classList.contains('active')) {
      deliveryBtn.classList.add('active');
      pickupBtn.classList.remove('active');
    }
  });
  
  pickupBtn.addEventListener('click', () => {
    if (!pickupBtn.classList.contains('active')) {
      pickupBtn.classList.add('active');
      deliveryBtn.classList.remove('active');
    }
  });
}); 