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
console.log("Ресторан ID:", restaurantId);


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

const specialOffersContainer = document.getElementById("special-offers-items");
const fullMenuContainer = document.getElementById("full-menu-items");

let filteredSpecialOffers = [...specialOffers];
let filteredFullMenu = [...fullMenu];

renderMenuItems(filteredSpecialOffers, specialOffersContainer);
renderMenuItems(filteredFullMenu, fullMenuContainer);

const searchInput = document.getElementById("search-input");
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
    renderMenuItems(filteredSpecialOffers, specialOffersContainer);
    renderMenuItems(filteredFullMenu, fullMenuContainer);
});

const sortSelect = document.getElementById("sort-select");
sortSelect.addEventListener("change", () => {
    const sortOption = sortSelect.value;
    const sortItems = (items) => {
        if (sortOption === "price-asc") {
            return [...items].sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            return [...items].sort((a, b) => b.price - a.price);
        } else {
            return [...items]; 
        }
    };
    filteredSpecialOffers = sortItems(filteredSpecialOffers);
    filteredFullMenu = sortItems(filteredFullMenu);
    renderMenuItems(filteredSpecialOffers, specialOffersContainer);
    renderMenuItems(filteredFullMenu, fullMenuContainer);
});

const filterBtn = document.getElementById("filter-btn");
filterBtn.addEventListener("click", () => {
    const filterModal = document.createElement("div");
    filterModal.classList.add("modal");
    filterModal.innerHTML = `
        <div class="modal-content filter-modal-content">
            <span class="close-modal">×</span>
            <h2>Фільтри</h2>
            <div class="filter-section">
                <h3>Категорія</h3>
                <label><input type="checkbox" class="filter-checkbox" data-filter="category" value="М'ясо"> М'ясо</label>
                <label><input type="checkbox" class="filter-checkbox" data-filter="category" value="Десерти"> Десерти</label>
                <label><input type="checkbox" class="filter-checkbox" data-filter="category" value="Фастфуд"> Фастфуд</label>
            </div>
            <div class="filter-section">
                <h3>Діапазон цін</h3>
                <label>Від: <input type="number" id="price-min" value="0" min="0"></label>
                <label>До: <input type="number" id="price-max" value="1000" min="0"></label>
            </div>
            <div class="filter-section">
                <h3>Рейтинг</h3>
                <label>Вище: <input type="number" id="rating-min" value="80" min="0" max="100">%</label>
            </div>
            <button id="apply-filters">Застосувати</button>
            <button id="reset-filters">Скинути</button>
        </div>
    `;
    document.body.appendChild(filterModal);

    const closeButton = filterModal.querySelector(".close-modal");
    closeButton.addEventListener("click", () => {
        filterModal.classList.add("fade-out");
        setTimeout(() => filterModal.remove(), 300);
    });

    filterModal.addEventListener("click", (e) => {
        if (e.target === filterModal) {
            filterModal.classList.add("fade-out");
            setTimeout(() => filterModal.remove(), 300);
        }
    });

    const applyFiltersBtn = filterModal.querySelector("#apply-filters");
    applyFiltersBtn.addEventListener("click", () => {
        const selectedCategories = Array.from(filterModal.querySelectorAll(".filter-checkbox:checked"))
            .map(checkbox => checkbox.value);
        const priceMin = parseInt(filterModal.querySelector("#price-min").value) || 0;
        const priceMax = parseInt(filterModal.querySelector("#price-max").value) || Infinity;
        const ratingMin = parseInt(filterModal.querySelector("#rating-min").value) || 0;

        filteredSpecialOffers = specialOffers.filter(item => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
            const matchesPrice = item.price >= priceMin && item.price <= priceMax;
            const rating = parseInt(item.rating.match(/\d+/)[0]);
            const matchesRating = rating >= ratingMin;
            return matchesCategory && matchesPrice && matchesRating;
        });

        filteredFullMenu = fullMenu.filter(item => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
            const matchesPrice = item.price >= priceMin && item.price <= priceMax;
            const rating = parseInt(item.rating.match(/\d+/)[0]);
            const matchesRating = rating >= ratingMin;
            return matchesCategory && matchesPrice && matchesRating;
        });

        renderMenuItems(filteredSpecialOffers, specialOffersContainer);
        renderMenuItems(filteredFullMenu, fullMenuContainer);
        filterModal.classList.add("fade-out");
        setTimeout(() => filterModal.remove(), 300);
    });

    const resetFiltersBtn = filterModal.querySelector("#reset-filters");
    resetFiltersBtn.addEventListener("click", () => {
        filterModal.querySelectorAll(".filter-checkbox").forEach(checkbox => checkbox.checked = false);
        filterModal.querySelector("#price-min").value = 0;
        filterModal.querySelector("#price-max").value = 1000;
        filterModal.querySelector("#rating-min").value = 80;
        filteredSpecialOffers = [...specialOffers];
        filteredFullMenu = [...fullMenu];
        renderMenuItems(filteredSpecialOffers, specialOffersContainer);
        renderMenuItems(filteredFullMenu, fullMenuContainer);
    });

    filterModal.classList.add("fade-in");
});

function openModal(item) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">×</span>
            <div class="modal-inner">
                <div class="modal-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="modal-info">
                    <h2>${item.name}</h2>
                    <p class="modal-price">${item.price} грн</p>
                    <h3>Додаткові опції</h3>
                    <ul class="modal-extras">
                        ${item.extras.map(extra => `
                            <li data-price="${extra.price}">
                                <span>${extra.name}</span>
                                <span>${extra.price} грн</span>
                                <button class="add-extra">+</button>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="modal-notes">
                        <h3>Спеціальні інструкції</h3>
                        <input type="text" placeholder="Додайте примітку" class="note-input">
                    </div>
                    <p class="extra-charge">За додаткові опції може стягуватися плата.</p>
                    <div class="modal-actions">
                        <button class="quantity-btn">-</button>
                        <span class="quantity">1</span>
                        <button class="quantity-btn">+</button>
                        <button class="add-to-order">Додати до замовлення - <span class="total-price">${item.price}</span> грн</button>
                    </div>
                    <button class="see-details">Дивитися деталі</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector(".close-modal");
    closeButton.addEventListener("click", () => {
        modal.classList.add("fade-out");
        setTimeout(() => modal.remove(), 300);
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("fade-out");
            setTimeout(() => modal.remove(), 300);
        }
    });

    const addExtraButtons = modal.querySelectorAll(".add-extra");
    let selectedExtras = [];
    addExtraButtons.forEach(button => {
        button.addEventListener("click", () => {
            const li = button.parentElement;
            li.classList.toggle("selected");
            const price = parseInt(li.getAttribute("data-price"));
            if (li.classList.contains("selected")) {
                selectedExtras.push(price);
            } else {
                selectedExtras = selectedExtras.filter(p => p !== price);
            }
            updateTotalPrice();
        });
    });

    const quantityButtons = modal.querySelectorAll(".quantity-btn");
    let quantity = 1;
    quantityButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.textContent === "+" && quantity < 10) {
                quantity++;
                button.classList.add("scale-up");
                setTimeout(() => button.classList.remove("scale-up"), 200);
            }
            if (button.textContent === "-" && quantity > 1) {
                quantity--;
                button.classList.add("scale-up");
                setTimeout(() => button.classList.remove("scale-up"), 200);
            }
            modal.querySelector(".quantity").textContent = quantity;
            updateTotalPrice();
        });
    });

    function updateTotalPrice() {
        const basePrice = item.price * quantity;
        const extraTotal = selectedExtras.reduce((sum, price) => sum + price, 0);
        const totalPrice = basePrice + extraTotal;
        modal.querySelector(".total-price").textContent = totalPrice;
    }

    modal.classList.add("fade-in");
}

document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        window.location.href = 'order.html'; // або інший шлях до сторінки кошика
      });
    }
  });  