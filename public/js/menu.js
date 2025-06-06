const specialOffers = [
    {
        name: "Свинячі ребра",
        price: 149,
        rating: "80% (5)",
        description: "Соковиті ребра з ніжним м'ясом, приготовані на грилі.",
        image: "images/rebra.png",
        category: "М'ясо",
        extras: [
            { name: "Соус Кентуккі Голд", price: 15 },
            { name: "Пепсі 0.33л", price: 25 },
            { name: "Соус BBQ", price: 15 },
            { name: "Куркума (2 порції)", price: 20 },
            { name: "Шейк з арахісовим маслом 180мл", price: 30 }
        ]
    },
    {
        name: "Телятина на кістці",
        price: 265,
        rating: "85% (10)",
        description: "Ніжна телятина, запечена на кістці з ароматними спеціями.",
        image: "images/telyatina.png",
        category: "М'ясо",
        extras: [
            { name: "Соус Кентуккі Голд", price: 35 },
            { name: "Пепсі 0.33л", price: 25 },
            { name: "Соус BBQ", price: 25 }
        ]
    },
    {
        name: "Багет з картоплею фрі",
        price: 849,
        rating: "90% (15)",
        description: "Хрусткий багет з картоплею фрі та соусом на вибір.",
        image: "images/free.png",
        category: "Фастфуд",
        extras: [
            { name: "Соус Кентуккі Голд", price: 35 },
            { name: "Пепсі 0.33л", price: 25 }
        ]
    },
    {
        name: "Кебаб з індички",
        price: 345,
        rating: "78% (8)",
        description: "Соковитий кебаб з індички з овочами та спеціями.",
        image: "images/kebab.png",
        category: "М'ясо",
        extras: [
            { name: "Соус Кентуккі Голд", price: 35 },
            { name: "Пепсі 0.33л", price: 25 },
            { name: "Соус BBQ", price: 25 }
        ]
    },
    {
        name: "Курка Чар Сіу",
        price: 351,
        rating: "88% (12)",
        description: "Курка в соусі Чар Сіу, приготована за азіатським рецептом.",
        image: "images/charsiu.png",
        category: "М'ясо",
        extras: [
            { name: "Соус Кентуккі Голд", price: 35 },
            { name: "Пепсі 0.33л", price: 25 }
        ]
    },
    {
        name: "Фісташковий наполеон",
        price: 329,
        rating: "95% (19)",
        description: "Листкове тісто, заварний крем із згущеним молоком, фісташкова паста. Подається з вишневим конфі.",
        image: "images/napoleon.png",
        category: "Десерти",
        extras: [
            { name: "Пепсі 0.33л", price: 25 },
            { name: "Шейк з арахісовим маслом 180мл", price: 85 }
        ]
    }
];

const fullMenu = [
    {
        name: "Куряче карі",
        price: 381,
        rating: "82% (7)",
        description: "Ніжне куряче карі з кокосовим молоком та спеціями.",
        image: "images/chicken.png",
        category: "М'ясо",
        extras: [
            { name: "Соус Кентуккі Голд", price: 35 },
            { name: "Пепсі 0.33л", price: 25 }
        ]
    },
    {
        name: "Дубайський чізкейк",
        price: 219,
        rating: "95% (20)",
        description: "Сирний чізкейк з екзотичними нотками Дубаю.",
        image: "images/dubai.png",
        category: "Десерти",
        extras: [
            { name: "Пепсі 0.33л", price: 25 },
            { name: "Шейк з арахісовим маслом 180мл", price: 85 }
        ]
    },
    {
        name: "Прошутто Котто",
        price: 389,
        rating: "87% (9)",
        description: "Італійський прошутто котто з ніжним смаком.",
        image: "images/cotto.png",
        category: "М'ясо",
        extras: [
            { name: "Соус Кентуккі Голд", price: 35 },
            { name: "Пепсі 0.33л", price: 25 }
        ]
    },
    {
        name: "Філе міньйон",
        price: 360,
        rating: "91% (14)",
        description: "Ніжний філе міньйон, приготований до ідеальної м'якості.",
        image: "images/filet.png",
        category: "М'ясо",
        extras: [
            { name: "Соус BBQ", price: 35 },
            { name: "Пепсі 0.33л", price: 25 }
        ]
    },
    {
        name: "Рібай",
        price: 579,
        rating: "93% (18)",
        description: "Соковитий стейк Рібай з насиченим смаком.",
        image: "images/rib.png",
        category: "М'ясо",
        extras: [
            { name: "Соус Кентуккі Голд", price: 35 },
            { name: "Пепсі 0.33л", price: 25 },
            { name: "Шейк з арахісовим маслом 180мл", price: 85 }
        ]
    },
    {
        name: "Медальйон з картопляним кремом",
        price: 679,
        rating: "90% (15)",
        description: "Подається з соусом демігляс та спаржею.",
        image: "images/medal.png",
        category: "М'ясо",
        extras: [
            { name: "Соус BBQ", price: 25 },
            { name: "Пепсі 0.33л", price: 25 }
        ]
    }
];

function getRestaurantIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

const restaurantId = getRestaurantIdFromURL();

const restaurantData = {
    "1": { name: "Daily Dose", image: "images/background_menu.png" },
    "2": { name: "Kolos", image: "images/kolos_banner.png" },
    "3": { name: "Una Pinsa", image: "images/unapinsa_banner.png" },
    "4": { name: "Levova Paliantysia", image: "images/levovapalianytsia_banner.png" },
    "5": { name: "Burger Star", image: "images/burgerstar_banner.png" },
    "6": { name: "SHOco", image: "images/shoco_banner.png" },
    "7": { name: "Noa", image: "images/noa_banner.png" },
    "8": { name: "Pasta Fresca", image: "images/pastafresca_banner.png" },
    "9": { name: "Trdlo", image: "images/trdlo_banner.png" },
    "10": { name: "McDonald's", image: "images/mcdonalds_banner.png" },
    "11": { name: "Good Friend", image: "images/goodfriend_banner.png" },
    "12": { name: "Sushi King", image: "images/sushiking_banner.png" }
};

if (restaurantData[restaurantId]) {
    document.getElementById("restaurant-title").textContent = restaurantData[restaurantId].name;
    document.getElementById("restaurant-image").src = restaurantData[restaurantId].image;
}

// Initialize cart service
const cartService = new CartService();

// Save delivery preference and city selection
function saveDeliveryPreference(isDelivery) {
    localStorage.setItem('deliveryMethod', isDelivery ? 'delivery' : 'pickup');
}

function saveCitySelection(city) {
    localStorage.setItem('selectedCity', city);
}

// Update cart icon click handler
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    const deliveryBtn = document.getElementById('deliveryBtn');
    const pickupBtn = document.getElementById('pickupBtn');
    const citySelect = document.getElementById('city-select');

    // Initialize delivery method from localStorage or default to delivery
    const savedDeliveryMethod = localStorage.getItem('deliveryMethod') || 'delivery';
    if (savedDeliveryMethod === 'pickup') {
        deliveryBtn.classList.remove('active');
        pickupBtn.classList.add('active');
    } else {
        deliveryBtn.classList.add('active');
        pickupBtn.classList.remove('active');
    }

    // Initialize city selection from localStorage
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
        citySelect.value = savedCity;
    }

    // Delivery toggle handlers
    deliveryBtn.addEventListener('click', () => {
        if (!deliveryBtn.classList.contains('active')) {
            deliveryBtn.classList.add('active');
            pickupBtn.classList.remove('active');
            saveDeliveryPreference(true);
        }
    });

    pickupBtn.addEventListener('click', () => {
        if (!pickupBtn.classList.contains('active')) {
            pickupBtn.classList.add('active');
            deliveryBtn.classList.remove('active');
            saveDeliveryPreference(false);
        }
    });

    // City selection handler
    citySelect.addEventListener('change', (e) => {
        saveCitySelection(e.target.value);
    });

    // Cart icon handler with proper auth check
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            // Перевіряємо чи користувач авторизований через Firebase
            const unsubscribe = auth.onAuthStateChanged((user) => {
                unsubscribe(); // Відписуємось від слухача після перевірки
                if (!user) {
                    // Зберігаємо поточний URL для повернення після логіну
                    const returnUrl = encodeURIComponent('order.html');
                    window.location.href = `login.html?returnUrl=${returnUrl}`;
                    return;
                }
                window.location.href = 'order.html';
            });
        });
    }

    // Initialize menu items
    renderMenuItems(filteredSpecialOffers, document.getElementById("special-offers-items"));
    renderMenuItems(filteredFullMenu, document.getElementById("full-menu-items"));

    // Filter modal functionality
    const filterBtn = document.getElementById('filter-btn');
    const filterModal = document.getElementById('filterModal');
    const applyBtn = document.querySelector('.apply-btn');
    const resetBtn = document.querySelector('.reset-btn');

    // Open modal
    filterBtn.addEventListener('click', () => {
        filterModal.style.display = 'flex';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });

    // Apply filters
    applyBtn.addEventListener('click', () => {
        // Get filter values
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(cb => cb.value);
        const priceFrom = parseInt(document.getElementById('priceFrom').value) || 0;
        const priceTo = parseInt(document.getElementById('priceTo').value) || Infinity;
        const ratingMin = parseInt(document.getElementById('rating').value) || 0;

        // Filter special offers
        filteredSpecialOffers = specialOffers.filter(item => {
            const itemRating = parseInt(item.rating.match(/\d+/)[0]);
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
            const matchesPrice = item.price >= priceFrom && item.price <= priceTo;
            const matchesRating = itemRating >= ratingMin;
            
            return matchesCategory && matchesPrice && matchesRating;
        });

        // Filter full menu
        filteredFullMenu = fullMenu.filter(item => {
            const itemRating = parseInt(item.rating.match(/\d+/)[0]);
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
            const matchesPrice = item.price >= priceFrom && item.price <= priceTo;
            const matchesRating = itemRating >= ratingMin;
            
            return matchesCategory && matchesPrice && matchesRating;
        });

        // Apply current sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            const currentSort = sortSelect.value;
            filteredSpecialOffers = applySort(filteredSpecialOffers, currentSort);
            filteredFullMenu = applySort(filteredFullMenu, currentSort);
        }

        // Re-render menu items
        renderMenuItems(filteredSpecialOffers, document.getElementById("special-offers-items"));
        renderMenuItems(filteredFullMenu, document.getElementById("full-menu-items"));
        
        // Close modal
        filterModal.style.display = 'none';
    });

    // Reset filters
    resetBtn.addEventListener('click', () => {
        // Reset checkboxes
        document.querySelectorAll('input[name="category"]')
            .forEach(cb => cb.checked = false);
        
        // Reset number inputs
        document.getElementById('priceFrom').value = '0';
        document.getElementById('priceTo').value = '1000';
        document.getElementById('rating').value = '80';

        // Reset filtered items
        filteredSpecialOffers = [...specialOffers];
        filteredFullMenu = [...fullMenu];

        // Apply current sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            const currentSort = sortSelect.value;
            filteredSpecialOffers = applySort(filteredSpecialOffers, currentSort);
            filteredFullMenu = applySort(filteredFullMenu, currentSort);
        }

        // Re-render menu items
        renderMenuItems(filteredSpecialOffers, document.getElementById("special-offers-items"));
        renderMenuItems(filteredFullMenu, document.getElementById("full-menu-items"));
    });

    // Initialize sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const currentSort = sortSelect.value;
            filteredSpecialOffers = applySort(filteredSpecialOffers, currentSort);
            filteredFullMenu = applySort(filteredFullMenu, currentSort);
            
            renderMenuItems(filteredSpecialOffers, document.getElementById("special-offers-items"));
            renderMenuItems(filteredFullMenu, document.getElementById("full-menu-items"));
        });
    }

    // Initialize search
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase();
            filteredSpecialOffers = specialOffers.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm)
            );
            filteredFullMenu = fullMenu.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm)
            );
            filteredSpecialOffers = applySort(filteredSpecialOffers);
            filteredFullMenu = applySort(filteredFullMenu);
            renderMenuItems(filteredSpecialOffers, document.getElementById("special-offers-items"));
            renderMenuItems(filteredFullMenu, document.getElementById("full-menu-items"));
        });
    }

    // Update auth section on page load
    updateAuthSection();
});

function createMenuItem(item) {
    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.setAttribute("data-category", item.category);
    div.innerHTML = `
        <div class="menu-details">
            <h3>${item.name}</h3>
            <div class="price-rating">
                <p class="price">${item.price} грн</p>
                <p class="rating">${item.rating}</p>
            </div>
            <p class="description">${item.description}</p>
        </div>
        <div class="menu-image-container">
            <img src="${item.image}" alt="${item.name}" class="menu-image">
            <div class="add-to-cart">+</div>
        </div>
    `;
    return div;
}

function renderMenuItems(items, container) {
    container.innerHTML = "";
    items.forEach(item => {
        const menuItem = createMenuItem(item);
        container.appendChild(menuItem);
        const addButton = menuItem.querySelector(".add-to-cart");
        addButton.addEventListener("click", () => openModal(item));
    });
}

let filteredSpecialOffers = [...specialOffers];
let filteredFullMenu = [...fullMenu];
let currentSortOption = "popularity-desc"; // Змінено початкове значення за замовчуванням

function getPopularity(item) {
    return parseInt(item.rating.match(/\d+/)[0]); // Отримуємо числове значення рейтингу (відсоток)
}

function applySort(items, sortOption) {
    if (sortOption === "price-asc") {
        return [...items].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
        return [...items].sort((a, b) => b.price - a.price);
    } else if (sortOption === "popularity-asc") {
        return [...items].sort((a, b) => getPopularity(a) - getPopularity(b));
    } else if (sortOption === "popularity-desc") {
        return [...items].sort((a, b) => getPopularity(b) - getPopularity(a));
    } else {
        return [...items];
    }
}

function openModal(item) {
    const existingModal = document.querySelector('.menu-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'menu-modal';
    modal.innerHTML = `
        <div class="menu-modal-content">
            <div class="menu-modal-header">
                <h3>${item.name}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="menu-modal-body">
                <div class="modal-left">
                    <img src="${item.image}" alt="${item.name}" class="modal-image">
                    <p class="modal-description">${item.description}</p>
                </div>
                <div class="modal-info">
                    <div class="modal-price-container">
                        <div class="modal-price">${item.price} грн</div>
                    </div>
                    
                    ${item.extras && item.extras.length ? `
                        <div class="extras-section">
                            <h4>Додаткові опції</h4>
                            <div class="extras-list">
                                ${item.extras.map(extra => `
                                    <div class="extra-item">
                                        <label>${extra.name}</label>
                                        <div class="extra-price">
                                            <span>${extra.price} грн</span>
                                            <button class="add-extra" data-name="${extra.name}" data-price="${extra.price}">+</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="special-instructions">
                        <h4>Спеціальні інструкції</h4>
                        <textarea placeholder="Додайте примітку"></textarea>
                    </div>

                    <div class="quantity-control">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">1</span>
                        <button class="quantity-btn plus">+</button>
                        <button class="add-to-cart-btn">Додати до замовлення</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    let quantity = 1;
    let selectedExtras = [];
    let totalPrice = item.price;

    function updatePrice() {
        const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
        totalPrice = (item.price + extrasTotal) * quantity;
        modal.querySelector('.modal-price').textContent = `${totalPrice} грн`;
    }

    // Handle quantity controls
    const quantityDisplay = modal.querySelector('.quantity');
    
    modal.querySelector('.minus').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
            updatePrice();
        }
    });

    modal.querySelector('.plus').addEventListener('click', () => {
        quantity++;
        quantityDisplay.textContent = quantity;
        updatePrice();
    });

    // Handle extras
    modal.querySelectorAll('.add-extra').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = Number(button.dataset.price);
            
            if (button.textContent === '+') {
                button.textContent = '✓';
                button.style.background = '#FE9A9B';
                button.style.color = 'white';
                selectedExtras.push({ name, price });
            } else {
                button.textContent = '+';
                button.style.background = 'white';
                button.style.color = '#FE9A9B';
                selectedExtras = selectedExtras.filter(extra => extra.name !== name);
            }
            
            updatePrice();
        });
    });

    // Handle close
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });

    // Handle click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });

    // Handle add to cart
    modal.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        const notes = modal.querySelector('textarea').value;
        cartService.addItem(
            { ...item, notes }, 
            selectedExtras,
            quantity
        );
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

// Function to check if user is logged in
function isUserLoggedIn() {
    return auth.currentUser !== null;
}

// Function to update auth section based on login state
function updateAuthSection() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    const user = auth.currentUser;
    if (user) {
        authButtons.innerHTML = `
            <a href="profile.html" class="btn">
                <img src="images/profile.png" alt="Profile" style="width: 24px; height: 24px; filter: brightness(0) invert(1);" />
            </a>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn">Увійти</a>
            <a href="register.html" class="btn">Реєстрація</a>
        `;
    }
}