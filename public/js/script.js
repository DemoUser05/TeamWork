let selectedCity = null; // або null, або "Київ", "Львів", "Одеса"

const restaurants = [
  { id: "1", name: "Daily Dose", category: [,"бургер", "салат", "піца", "паста"], city: ["Львів", "Дрогобич", "Черкаси"], rating: 4.9, deliveryTime: 20, avgPrice: 220, tags: ["веганське", "без глютену"], promo: true, img: "images/daily_dose.png" },
  { id: "2", name: "Kolos", category: ["сніданок", "напої", "салат", "напої", "кексик"], city: ["Львів", "Дрогобич"] ,rating: 4.3, deliveryTime: 45, avgPrice: 300, tags: ["халяль"], promo: false, img: "images/kolos.png" },
  { id: "3", name: "Una Pinsa", category: ["піца", "сніданок", "паста"], city: "Львів", rating: 4.4, deliveryTime: 35, avgPrice: 170, tags: ["без глютену", "халяль"], promo: true, img: "images/una_pinsa.png" },
  { id: "4", name: "Levova Paliantysia", category: ["салат", "піца", "сніданок", "напої"], city: "Львів", rating: 4.7, deliveryTime: 25, avgPrice: 120, tags: ["халяль"], promo: false, img: "images/levova_paliantysia.png" },

  { id: "5", name: "Burger Star", category: ["бургер","напої", "салат", "фастфуд"], city: "Черкаси", rating: 4.7, deliveryTime: 30, avgPrice: 200, tags: [], promo: true, img: "images/burger_star.jpg" },
  { id: "6", name: "SHOco", category: ["кексик", "напої"], city: "Львів",  promo: false, rating: 4.2, deliveryTime: 50, avgPrice: 160, tags: ["без глютену", "веганське"], img: "images/shoco.jpg" },
  { id: "7", name: "Noa", category: ["суші", "напої", "салат"], city: ["Львів", "Черкаси"], promo: false, rating: 4.8, deliveryTime: 40, avgPrice: 350, tags: ["веганське"], img: "images/noa.webp" },
  { id: "8", name: "Pasta Fresca", category: ["паста", "сніданок", "напої", "кексик"], city: "Дрогобич", promo: true, rating: 3.8, deliveryTime: 45, avgPrice: 210, tags: ["без глютену", "веганське"], img: "images/pasta_fresca.jpeg" },

  { id: "9", name: "Trdlo", category: "кексик", city: "Львів", promo: true, rating: 4.7, deliveryTime: 20, avgPrice: 110, tags: [], img: "images/trdlo.png" },
  { id: "10", name: "mcdonalds", category: ["фастфуд", "бургер", "напої", "салат"], city: ["Львів", "Дрогобич", "Черкаси"], promo: false, rating: 4.7, deliveryTime: 30, avgPrice: 190, tags: [], img: "images/mcdonalds.png" },
  { id: "11", name: "Good Friend", category: ["напої", "піца", "бургер"], city: "Львів",  promo: false, rating: 5.0, deliveryTime: 50, avgPrice: 200, tags: ["халяль"], img: "images/good_friend.jpg" },
  { id: "12", name: "Sushi King", category: "суші", city: "Львів",  promo: true, rating: 3.7, deliveryTime: 50, avgPrice: 290, tags: ["веганське"], img: "images/sushi_king.jpg" }
];

document.getElementById("city-select").addEventListener("change", (e) => {
  const city = e.target.value;
  selectedCity = city === "" ? null : city;
  applyFilters();
});


function renderRestaurants(data) {
  const container = document.getElementById("restaurant-list");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>Нічого не знайдено</p>";
    return;
  }

  data.forEach(r => {
    const div = document.createElement("div");
    div.className = "restaurant";
    div.innerHTML = `
     <a href="menu.html?id=${r.id}" class="restaurant-link">
      <img src="${r.img}" />
      <p>${r.name}</p>
     </a>
`;

    container.appendChild(div);
  });
}

renderRestaurants(restaurants);

document.querySelector(".search-bar input").addEventListener("input", function (e) {
  const query = e.target.value.toLowerCase();
  const filtered = restaurants.filter(r => r.name.toLowerCase().includes(query));
  renderRestaurants(filtered);
});

document.querySelectorAll(".categories button").forEach(btn => {
  btn.addEventListener("click", function () {
    const cat = btn.textContent.trim().toLowerCase().split(" ")[1];
    applyFilters({ category: cat }); // Передаємо категорію
  });
});


document.querySelectorAll(".filters select")[3].addEventListener("change", function (e) {
  if (e.target.value.toLowerCase().includes("знижка") || e.target.value.toLowerCase().includes("доставка")) {
    renderRestaurants(restaurants.filter(r => r.promo));
  } else {
    renderRestaurants(restaurants);
  }
});

let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");

function showSlide(index) {
  const track = document.getElementById("carousel-track");
  const slideWidth = slides[0].offsetWidth;
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function applyFilters(extra = {}) {
  const sortBy = document.getElementById("sort").value;
  const tag = document.getElementById("filter").value;
  const price = document.getElementById("price").value;
  const promo = document.getElementById("promo").value;
  const category = extra.category || null;

  let filtered = [...restaurants];

  // 📍 Фільтр за містом
  if (selectedCity) {
    filtered = filtered.filter(r =>
      Array.isArray(r.city)
        ? r.city.includes(selectedCity)
        : r.city === selectedCity
    );
  }

  // 🏷️ Теги
  if (tag) {
    filtered = filtered.filter(r => r.tags.includes(tag));
  }

  // 💰 Ціна
  if (price) {
    filtered = filtered.filter(r => {
      if (price === "low") return r.avgPrice <= 150;
      if (price === "medium") return r.avgPrice > 150 && r.avgPrice <= 300;
      if (price === "high") return r.avgPrice > 300;
    });
  }

  // 🎁 Промо
  if (promo === "yes") {
    filtered = filtered.filter(r => r.promo === true);
  }

  // 🔁 Сортування
  if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "delivery") {
    filtered.sort((a, b) => a.deliveryTime - b.deliveryTime);
  }

  // Категорії
  if (category) {
    filtered = filtered.filter(r =>
      Array.isArray(r.category)
        ? r.category.includes(category)
        : r.category === category
    );
  }

  renderRestaurants(filtered);
}


// 🟰 Прив’язуємо всі селекти
document.querySelectorAll(".filters select").forEach(sel => {
  sel.addEventListener("change", applyFilters);
});

const deliveryBtn = document.getElementById("delivery-btn");
const pickupBtn = document.getElementById("pickup-btn");
let deliveryMode = "Доставка"; // або "Самовивіз"

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
    text.textContent = link.getAttribute("data-text");
    
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

document.querySelectorAll(".modal-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const modal = document.getElementById("modal");
    const title = document.getElementById("modal-title");
    const text = document.getElementById("modal-text");

    title.textContent = link.getAttribute("data-title");
    
    // Заміняємо <br><br> на окремі <p> елементи
    const formattedText = link.getAttribute("data-text").split("<br><br>").map(line => `<p>${line}</p>`).join("");

    text.innerHTML = formattedText;

    modal.style.display = "flex";
  });
});

document.getElementById("reset-filters").addEventListener("click", () => {
  document.getElementById("sort").value = "";
  document.getElementById("filter").value = "";
  document.getElementById("price").value = "";
  document.getElementById("promo").value = "";

  selectedCity = null;
  document.getElementById("city-select").value = "";
  
  renderRestaurants(restaurants); // Повертає стандартний список ресторанів
});
