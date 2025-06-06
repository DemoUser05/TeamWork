let searchQuery = '';

const restaurants = [
  { id: "1", name: "Daily Dose", category: ["бургер", "салат", "піца", "паста"], city: ["Львів", "Дрогобич", "Черкаси"], rating: 4.9, deliveryTime: 20, avgPrice: 220, tags: ["веганське", "без глютену"], promo: true, img: "images/daily_dose.png" },
  { id: "2", name: "Kolos", category: ["сніданок", "напої", "салат", "кексик"], city: ["Львів", "Дрогобич"], rating: 4.3, deliveryTime: 45, avgPrice: 300, tags: ["халяль"], promo: false, img: "images/kolos.png" },
  { id: "3", name: "Una Pinsa", category: ["піца", "сніданок", "паста"], city: "Львів", rating: 4.4, deliveryTime: 35, avgPrice: 170, tags: ["без глютену", "халяль"], promo: true, img: "images/una_pinsa.png" },
  { id: "4", name: "Levova Paliantysia", category: ["салат", "піца", "сніданок", "напої"], city: "Львів", rating: 4.7, deliveryTime: 25, avgPrice: 120, tags: ["халяль"], promo: false, img: "images/levova_paliantysia.png" },
  { id: "5", name: "Burger Star", category: ["бургер", "напої", "салат", "фастфуд"], city: "Черкаси", rating: 4.7, deliveryTime: 30, avgPrice: 200, tags: [], promo: true, img: "images/burger_star.jpg" },
  { id: "6", name: "SHOco", category: ["кексик", "напої"], city: "Львів", promo: false, rating: 4.2, deliveryTime: 50, avgPrice: 160, tags: ["без глютену", "веганське"], img: "images/shoco.jpeg" },
  { id: "7", name: "Noa", category: ["суші", "напої", "салат"], city: ["Львів", "Черкаси"], promo: false, rating: 4.8, deliveryTime: 40, avgPrice: 350, tags: ["веганське"], img: "images/noa.webp" },
  { id: "8", name: "Pasta Fresca", category: ["паста", "сніданок", "напої", "кексик"], city: "Дрогобич", promo: true, rating: 3.8, deliveryTime: 45, avgPrice: 210, tags: ["без глютену", "веганське"], img: "images/pasta_fresca.jpeg" },
  { id: "9", name: "Trdlo", category: "кексик", city: "Львів", promo: true, rating: 4.7, deliveryTime: 20, avgPrice: 110, tags: [], img: "images/trdlo.png" },
  { id: "10", name: "mcdonalds", category: ["фастфуд", "бургер", "напої", "салат"], city: ["Львів", "Дрогобич", "Черкаси"], promo: false, rating: 4.7, deliveryTime: 30, avgPrice: 190, tags: [], img: "images/mcdonalds.png" },
  { id: "11", name: "Good Friend", category: ["напої", "піца", "бургер"], city: "Львів", promo: false, rating: 5.0, deliveryTime: 50, avgPrice: 200, tags: ["халяль"], img: "images/good_friend.jpg" },
  { id: "12", name: "Sushi King", category: "суші", city: "Львів", promo: true, rating: 3.7, deliveryTime: 50, avgPrice: 290, tags: ["веганське"], img: "images/sushi_king.jpg" }
];

// Глобальні змінні для фільтрів
let currentFilters = {
  category: 'all',
  priceRange: 'all',
  sort: 'rating',
  promoOnly: false
};

// Функція для рендерингу ресторанів
function renderRestaurants(restaurantsToRender) {
  const container = document.querySelector('.restaurants');
  if (!container) {
    console.error('Container .restaurants not found');
    return;
  }
  
  container.innerHTML = '';
  
  if (restaurantsToRender.length === 0) {
    container.innerHTML = '<p style="text-align: center; width: 100%; padding: 20px;">Нічого не знайдено</p>';
    return;
  }
  
  restaurantsToRender.forEach(restaurant => {
    const restaurantElement = document.createElement('a');
    restaurantElement.href = `menu.html?id=${restaurant.id}`;
    restaurantElement.className = 'restaurant-link';
    
    restaurantElement.innerHTML = `
      <div class="restaurant">
        <div class="rating-badge">${restaurant.rating}</div>
        <img src="${restaurant.img}" alt="${restaurant.name}"/>
        <div class="card-content">
          <div class="card-content-left">
            <p>${restaurant.name}</p>
            <div class="card-info">
              <span class="cuisine-type">${Array.isArray(restaurant.category) ? restaurant.category[0] : restaurant.category}</span>
              <span class="delivery-time">${restaurant.deliveryTime}-${restaurant.deliveryTime + 15} хв</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(restaurantElement);
  });
}

// Функція для рендерингу каруселі популярних ресторанів
function renderCarousel(restaurantsToRender) {
  const carouselTrack = document.getElementById('carousel-track');
  if (!carouselTrack) return;

  carouselTrack.innerHTML = '';

  if (restaurantsToRender.length === 0) {
    carouselTrack.innerHTML = '<p style="text-align: center; width: 100%; padding: 20px;">Нічого не знайдено</p>';
    return;
  }

  // Групуємо ресторани по 3 для слайдів
  const slides = [];
  for (let i = 0; i < restaurantsToRender.length; i += 3) {
    slides.push(restaurantsToRender.slice(i, i + 3));
  }

  slides.forEach(slideRestaurants => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    slideRestaurants.forEach(restaurant => {
      const restaurantElement = document.createElement('a');
      restaurantElement.href = `menu.html?id=${restaurant.id}`;
      restaurantElement.className = 'restaurant-link';

      restaurantElement.innerHTML = `
        <div class="card">
          <div class="rating-badge">${restaurant.rating}</div>
          <img src="${restaurant.img}" alt="${restaurant.name}"/>
          <div class="card-content">
            <div class="card-content-left">
              <p>${restaurant.name}</p>
              <div class="card-info">
                <span class="cuisine-type">${Array.isArray(restaurant.category) ? restaurant.category[0] : restaurant.category}</span>
                <span class="delivery-time">${restaurant.deliveryTime}-${restaurant.deliveryTime + 15} хв</span>
              </div>
            </div>
          </div>
        </div>
      `;

      slide.appendChild(restaurantElement);
    });

    carouselTrack.appendChild(slide);
  });

  // Оновлюємо карусель після рендерингу
  currentIndex = 0;
  updateCarousel();
}

// Функція для фільтрації та сортування ресторанів
function filterAndSortRestaurants() {
  let filtered = [...restaurants];
  
  // Фільтрація за категорією
  if (currentFilters.category !== 'all') {
    filtered = filtered.filter(restaurant => {
      const categories = Array.isArray(restaurant.category) ? restaurant.category : [restaurant.category];
      return categories.includes(currentFilters.category);
    });
  }
  
  // Фільтрація за ціною
  if (currentFilters.priceRange !== 'all') {
    filtered = filtered.filter(restaurant => {
      switch(currentFilters.priceRange) {
        case 'cheap':
          return restaurant.avgPrice <= 150;
        case 'medium':
          return restaurant.avgPrice > 150 && restaurant.avgPrice <= 250;
        case 'expensive':
          return restaurant.avgPrice > 250;
        default:
          return true;
      }
    });
  }
  
  // Фільтрація за акціями
  if (currentFilters.promoOnly) {
    filtered = filtered.filter(restaurant => restaurant.promo);
  }
  
  // Сортування
  filtered.sort((a, b) => {
    switch(currentFilters.sort) {
      case 'rating':
        return b.rating - a.rating;
      case 'delivery':
        return a.deliveryTime - b.deliveryTime;
      case 'price_low':
        return a.avgPrice - b.avgPrice;
      case 'price_high':
        return b.avgPrice - a.avgPrice;
      default:
        return 0;
    }
  });
  
  return filtered;
}

// Функція для оновлення відображення
function updateDisplay() {
  const filtered = filterAndSortRestaurants();
  renderRestaurants(filtered);
}

// Функція для скидання всіх фільтрів
function resetFilters() {
  console.log('Resetting filters...');
  
  currentFilters = {
    category: 'all',
    priceRange: 'all',
    sort: 'rating',
    promoOnly: false
  };
  
  // Скидаємо значення всіх селектів
  document.querySelector('#sort-select').value = 'rating';
  document.querySelector('#price-select').value = 'all';
  document.querySelector('#promo-select').value = 'all';
  
  // Знімаємо активний клас з усіх кнопок категорій
  document.querySelectorAll('.categories button').forEach(button => {
    button.classList.remove('active');
  });
  // Активуємо кнопку "Усі"
  const allButton = document.querySelector('.categories button:first-child');
  if (allButton) {
    allButton.classList.add('active');
  }
  
  // Оновлюємо відображення
  updateDisplay();
  console.log('Filters reset complete');
}

// Ініціалізація при завантаженні сторінки
function initializePage() {
  console.log('Initializing page...');
  
  // Початковий рендер всіх ресторанів
  renderRestaurants(restaurants);
  
  // Пошук
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query)
      );
      renderRestaurants(filtered);
    });
  }
  
  // Категорії
  document.querySelectorAll('.categories button').forEach(button => {
    button.addEventListener('click', (e) => {
      // Знімаємо активний клас з усіх кнопок
      document.querySelectorAll('.categories button').forEach(btn => {
        btn.classList.remove('active');
      });
      // Додаємо активний клас натиснутій кнопці
      e.target.classList.add('active');
      
      const category = e.target.textContent.toLowerCase().replace('🍔', '').replace('🍣', '')
        .replace('🍕', '').replace('🍝', '').replace('🍟', '').replace('🧁', '')
        .replace('🥗', '').replace('🍳', '').replace('🥤', '').trim();
      
      currentFilters.category = category === 'усі' ? 'all' : category;
      updateDisplay();
    });
  });
  
  // Сортування
  const sortSelect = document.querySelector('#sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      updateDisplay();
    });
  }
  
  // Фільтр за ціною
  const priceSelect = document.querySelector('#price-select');
  if (priceSelect) {
    priceSelect.addEventListener('change', (e) => {
      currentFilters.priceRange = e.target.value;
      updateDisplay();
    });
  }
  
  // Фільтр за акціями
  const promoSelect = document.querySelector('#promo-select');
  if (promoSelect) {
    promoSelect.addEventListener('change', (e) => {
      currentFilters.promoOnly = e.target.value === 'promo';
      updateDisplay();
    });
  }
  
  // Кнопка скидання фільтрів
  const resetButton = document.querySelector('#reset-filters');
  if (resetButton) {
    console.log('Reset button found');
    resetButton.addEventListener('click', () => {
      console.log('Reset button clicked');
      resetFilters();
    });
  } else {
    console.error('Reset button not found');
  }
}

// Викликаємо ініціалізацію при завантаженні сторінки
document.addEventListener('DOMContentLoaded', initializePage);

// Carousel functionality
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const nextButton = document.querySelector('.carousel-btn.right');
const prevButton = document.querySelector('.carousel-btn.left');
let currentIndex = 0;

function updateCarousel() {
  if (!track) return;
  const slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

// Initialize carousel
if (track && slides.length > 0) {
  updateCarousel();

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateCarousel();
      }
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  }

  window.addEventListener('resize', updateCarousel);

  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  track.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', () => {
    const difference = touchStartX - touchEndX;
    if (Math.abs(difference) > 50) {
      if (difference > 0 && currentIndex < slides.length - 1) {
        currentIndex++;
        updateCarousel();
      } else if (difference < 0 && currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }
  });
}

const deliveryBtn = document.getElementById("delivery-btn");
const pickupBtn = document.getElementById("pickup-btn");
let deliveryMode = "Доставка";

deliveryBtn.addEventListener("click", () => {
  deliveryBtn.classList.add("active");
  pickupBtn.classList.remove("active");
  deliveryMode = "Доставка";
  console.log("Обрано:", deliveryMode);
});

pickupBtn.addEventListener("click", () => {
  pickupBtn.classList.add("active");
  deliveryBtn.classList.remove("active");
  deliveryMode = "Самовивіз";
  console.log("Обрано:", deliveryMode);
});

document.querySelectorAll(".modal-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const modal = document.getElementById("modal");
    const title = document.getElementById("modal-title");
    const text = document.getElementById("modal-text");

    title.textContent = link.getAttribute("data-title");
    const formattedText = link.getAttribute("data-text").split("<br><br>").map(line => `<p>${line}</p>`).join("");
    text.innerHTML = formattedText;

    modal.style.display = "flex";
  });
});

document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal")) {
    document.getElementById("modal").style.display = "none";
  }
});

// Банери для каруселі
const banners = [
  {
    title: "Спробуйте нові сніданки в Daily Dose",
    subtitle: "Спеціальна пропозиція",
    buttonText: "Замовляйте прямо зараз!",
    bgColor: "#FFE8E8",
    image: "images/banner3.jpg",
    link: "menu.html?id=1"
  },
  {
    title: "Доставка улюблених страв",
    subtitle: "Отримуйте 10% знижку на перше замовлення за промокодом!",
    buttonText: "Дізнатись більше",
    bgColor: "#FFF8DC",
    image: "images/banner4.jpg",
    link: "profile.html#promo"
  }
];

// Ініціалізація каруселі банерів
function initBannerCarousel() {
  console.log('Initializing banner carousel...');
  const container = document.querySelector('.banner-carousel');
  if (!container) {
    console.error('Banner carousel container not found');
    return;
  }

  // Очищаємо контейнер перед додаванням нових слайдів
  container.innerHTML = '';

  // Створюємо слайди
  banners.forEach((banner, index) => {
    console.log(`Creating banner slide ${index + 1}:`, banner);
    const slide = document.createElement('div');
    slide.className = 'banner-slide';
    slide.style.display = index === 0 ? 'flex' : 'none';
    slide.style.backgroundColor = banner.bgColor;

    slide.innerHTML = `
      <div class="banner-content">
        <h2>${banner.title}</h2>
        <p>${banner.subtitle}</p>
        <button class="banner-btn" ${banner.link ? `data-link="${banner.link}"` : ''}>${banner.buttonText}</button>
      </div>
      <img src="${banner.image}" alt="${banner.title}">
    `;

    container.appendChild(slide);
  });

  // Додаємо навігаційні кнопки
  const prevBtn = document.createElement('button');
  prevBtn.className = 'banner-nav prev';
  prevBtn.innerHTML = '❮';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'banner-nav next';
  nextBtn.innerHTML = '❯';

  container.appendChild(prevBtn);
  container.appendChild(nextBtn);

  let currentSlide = 0;
  const totalSlides = banners.length;
  console.log('Total slides:', totalSlides);

  // Функція для показу слайду
  function showSlide(index) {
    console.log('Showing slide:', index);
    const slides = container.querySelectorAll('.banner-slide');
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'flex' : 'none';
    });
  }

  // Додаємо обробник кліків для кнопок банера
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('banner-btn')) {
      const link = e.target.dataset.link;
      if (link) {
        if (link.includes('#promo')) {
          // Якщо це посилання на промокод, відкриваємо модальне вікно після переходу
          window.location.href = link;
          // Зберігаємо флаг в localStorage
          localStorage.setItem('openPromoModal', 'true');
        } else {
          window.location.href = link;
        }
      }
    }
  });

  // Обробники для кнопок
  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    console.log('Next slide:', currentSlide);
    showSlide(currentSlide);
  });

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    console.log('Previous slide:', currentSlide);
    showSlide(currentSlide);
  });

  // Автоматична зміна слайдів
  let autoplay = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }, 5000);

  // Зупиняємо автоматичну зміну при наведенні
  container.addEventListener('mouseenter', () => {
    console.log('Mouse enter - stopping autoplay');
    clearInterval(autoplay);
  });

  container.addEventListener('mouseleave', () => {
    console.log('Mouse leave - starting autoplay');
    autoplay = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }, 5000);
  });

  // Показуємо перший слайд
  showSlide(0);
  console.log('Banner carousel initialized');
}

// Викликаємо ініціалізацію при завантаженні сторінки
document.addEventListener('DOMContentLoaded', initBannerCarousel);