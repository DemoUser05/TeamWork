// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const restaurants = track.querySelectorAll('.restaurant-link');
  const totalRestaurants = restaurants.length;
  let currentIndex = 0;
  
  // Clone first and last items for infinite loop
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
  
  // Adjust initial position to show first real items
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
    
    // If we've reached the cloned items at the end
    if (currentIndex >= totalRestaurants + 3) {
      // Wait for transition to finish, then jump to real items without animation
      setTimeout(() => {
        currentIndex = 3;
        updateCarousel(false);
      }, 500);
    }
  }
  
  function prevSlide() {
    currentIndex--;
    updateCarousel();
    
    // If we've reached the cloned items at the start
    if (currentIndex < 3) {
      // Wait for transition to finish, then jump to real items without animation
      setTimeout(() => {
        currentIndex = totalRestaurants + 2;
        updateCarousel(false);
      }, 500);
    }
  }
  
  // Add click handlers to buttons
  document.querySelector('.carousel-btn.left').addEventListener('click', prevSlide);
  document.querySelector('.carousel-btn.right').addEventListener('click', nextSlide);
  
  // Auto-advance carousel every 5 seconds
  let autoAdvance = setInterval(nextSlide, 4500);
  
  // Pause auto-advance when user interacts with carousel
  document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
    clearInterval(autoAdvance);
  });
  
  // Resume auto-advance when user stops interacting
  document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
    autoAdvance = setInterval(nextSlide, 4500);
  });
  
  // Handle edge cases when browser tab is inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(autoAdvance);
    } else {
      autoAdvance = setInterval(nextSlide, 4500);
    }
  });
  
  // Add disabled style for buttons
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

  // Delivery toggle functionality
  const deliveryBtn = document.getElementById('delivery-btn');
  const pickupBtn = document.getElementById('pickup-btn');
  
  // Set initial state
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