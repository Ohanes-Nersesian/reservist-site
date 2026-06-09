// ==========================================
// 1. НАЛАШТУВАННЯ СИНХРОНІЗАЦІЇ
// ==========================================
const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbwXmcVIAUmRFK8y1jctDDId6v_Gz4TXd2F3ebL3VDrqKMdvY8qps_r6icdLD5HbXAJE/exec";

let CURRENT_LOCATION = "CQB арена";

function updateLocation() {
    const select = document.getElementById('point-select');
    if (select) {
        CURRENT_LOCATION = select.value;
    }
}

// ==========================================
// 2. КАТАЛОГ ТОВАРІВ З КАТЕГОРІЯМИ
// ==========================================
const products = [
    // --- ДОДАТКОВІ ПРОДАЖІ ---
    { id: 1, name: "Пачка куль", price: 200, category: "Доп.продаж" },
    { id: 2, name: "Граната Картон", price: 80, category: "Доп.продаж" },
    { id: 3, name: "Граната з Чикою", price: 140, category: "Доп.продаж" },
    { id: 4, name: "Заряди ВОГ", price: 80, category: "Доп.продаж" },

    // --- НАПОЇ ТА ЇЖА ---
    { id: 5, name: "Солодка вода", price: 40, category: "Напої/Їжа" },
    { id: 6, name: "Вода мінеральна ", price: 20, category: "Напої/Їжа" },
    { id: 7, name: "Енергетик", price: 50, category: "Напої/Їжа" },
    { id: 8, name: "Снікерс", price: 50, category: "Напої/Їжа" },
    { id: 9, name: "Батончик", price: 30, category: "Напої/Їжа" }, 

    // --- ПОВНИЙ АРСЕНАЛ ОРЕНДИ (Всі позиції з картинки) ---
    { id: 10, name: "Привід AR", price: 600, category: "Оренда" },
    { id: 11, name: "Привод Ак74", price: 600, category: "Оренда" },
    { id: 12, name: "Привод АКСУ", price: 600, category: "Оренда" },
    { id: 13, name: "Тюнінгований привід", price: 800, category: "Оренда" },
    { id: 14, name: "Кулемет М249", price: 2500, category: "Оренда" },
    { id: 15, name: "Снайперська гвинтівка (спрінгова)", price: 1700, category: "Оренда" },
    { id: 16, name: "Електричні пістолети", price: 400, category: "Оренда" },
    { id: 17, name: "Пусковий гранатомет РПГ-18 \"Муха\"", price: 800, category: "Оренда" },
    { id: 18, name: "Пусковий гранатомет АТ", price: 800, category: "Оренда" },
    { id: 19, name: "Комплект захисту коліна+лікті", price: 180, category: "Оренда" },
    { id: 20, name: "Шолом страйкбольний", price: 200, category: "Оренда" },
    { id: 21, name: "Плитоноска з імітацією плит", price: 200, category: "Оренда" },
    { id: 22, name: "Форма", price: 250, category: "Оренда" },
    { id: 23, name: "Окуляри сітка", price: 80, category: "Оренда" },
    { id: 24, name: "Маска", price: 80, category: "Оренда" },
    { id: 25, name: "Варблет/РПС", price: 150, category: "Оренда" },
    { id: 26, name: "Акумулятори 7.4v", price: 100, category: "Оренда" },
    { id: 27, name: "Механічний/бункерний магазин)", price: 80, category: "Оренда" }
];

// Словник фірмових кольорів для твоїх категорій
const categoryColors = {
    "Всі": "#a93c33",         
    "Доп.продаж": "#083a8b",  
    "Напої/Їжа": "#0d885f",   
    "Оренда": "#bd8e00"       
};

let CURRENT_CATEGORY = "Всі";
let cart = [];

// ==========================================
// 3. ЛОГІКА ІНТЕРФЕЙСУ ТА КАТЕГОРІЙ
// ==========================================

// Створення кнопок категорій на екрані з індивідуальним підсвічуванням
function renderCategories() {
    const container = document.getElementById('category-tabs');
    if (!container) return;

    const categories = ["Всі", ...new Set(products.map(p => p.category))];

    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        
        btn.style.padding = "8px 16px";
        btn.style.border = "1px solid #d1d5db";
        btn.style.borderRadius = "20px";
        btn.style.cursor = "pointer";
        btn.style.fontWeight = "600";
        btn.style.fontSize = "14px";
        btn.style.transition = "all 0.2s";
        
        const activeColor = categoryColors[cat] || "#6B7280";

        if (cat === CURRENT_CATEGORY) {
            btn.style.background = activeColor;
            btn.style.color = "white";
            btn.style.borderColor = activeColor;
        } else {
            btn.style.background = "white";
            btn.style.color = "#323232";
            btn.style.borderColor = "#d1d5db";
        }

        btn.onclick = () => {
            CURRENT_CATEGORY = cat;
            renderCategories(); 
            renderProducts();   
        };

        container.appendChild(btn);
    });
}

// Відображення товарів без іконок, але з тонким колірним акцентом зліва
function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    const filteredProducts = CURRENT_CATEGORY === "Всі" 
        ? products 
        : products.filter(p => p.category === CURRENT_CATEGORY);

    filteredProducts.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const borderColor = categoryColors[prod.category] || "#e5e7eb";
        
        card.style.borderLeft = `5px solid ${borderColor}`;
        card.style.textAlign = "left";
        card.style.paddingLeft = "15px";
        
        card.innerHTML = `
            <b style="color: #1f2937; display: block; margin-bottom: 5px;">${prod.name}</b>
            <span style="color: #4b5563; font-weight: 500;">${prod.price} грн</span>
        `;
        
        card.onclick = () => addToCart(prod);
        container.appendChild(card);
    });
}

// Додавання товару в поточний чек
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateUI();
}

// Зміна кількості в чеку (+1 або -1)
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateUI();
}

// Видалення позиції з чеку
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateUI();
}

// Повне очищення поточного чека
function clearCart() {
    if (cart.length === 0) return; 
    
    if (confirm("Ви впевнені, що хочете повністю очистити поточний чек?")) {
        cart = [];  
        updateUI(); 
    }
}

// Перерахунок суми
function updateUI() {
    const cartContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    const payBtn = document.getElementById('pay-btn');
    
    if (!cartContainer || !totalEl) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="color:#9ca3af; text-align: center; margin-top: 20px;">Чек порожній</p>`;
        totalEl.innerText = '0';
        if (payBtn) payBtn.disabled = true;
        return;
    }

    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const sum = item.price * item.quantity;
        total += sum;

        const row = document.createElement('div');
        row.className = 'item';
        row.innerHTML = `
            <div>
                <div><b>${item.name}</b></div>
                <small>${item.price} грн х ${item.quantity} = ${sum} грн</small>
            </div>
            <div>
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                <button class="del-btn" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
        cartContainer.appendChild(row);
    });

    totalEl.innerText = total;
    if (payBtn) payBtn.disabled = false;
}

// ==========================================
// 4. ВІДПРАВКА ДАНИХ В GOOGLE ТАБЛИЦЮ
// ==========================================
function sendToGoogle() {
    if (cart.length === 0) {
        alert("Чек порожній! Спочатку додайте товари.");
        return;
    }
    
    const btn = document.getElementById('pay-btn');
    if (btn) { btn.disabled = true; btn.innerText = "Обробка..."; }

    const payMethod = document.querySelector('input[name="pay-method"]:checked').value;

    const packet = {
        cart: cart,
        payMethod: payMethod,
        location: CURRENT_LOCATION 
    };

    fetch(GOOGLE_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(packet)
    })
    .then(() => {
        alert(`Замовлення оплачено (${payMethod}) для локації "${CURRENT_LOCATION}" та внесено в звіт!`);
        cart = [];
        updateUI();
    })
    .catch(err => alert("Помилка відправки: " + err))
    .finally(() => {
        if (btn) { btn.disabled = false; btn.innerText = "Оплатити замовлення"; }
    });
}

// Ініціалізація системи при завантаженні сторінки
window.onload = () => {
    renderCategories(); 
    renderProducts();   
    updateUI();
};