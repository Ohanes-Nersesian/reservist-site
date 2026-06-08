// ==========================================
// 1. НАЛАШТУВАННЯ СИНХРОНІЗАЦІЇ
// ==========================================
// Твоя актуальна адреса веб-додатка Google Apps Script
const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbxluqYrmKHPnzGAHef0XPr8d-Oet2ux9v8vZs7QkjYWNPyIOVfm52xW31-x3FLduoe6/exec";

// Змінна, яка динамічно зберігає вибрану точку (за замовчуванням CQB арена)
let CURRENT_LOCATION = "CQB арена";

// Функція перемикання локації (спрацьовує при зміні у випадаючому списку)
function updateLocation() {
    const select = document.getElementById('point-select');
    if (select) {
        CURRENT_LOCATION = select.value;
    }
}

// ==========================================
// 2. КАТАЛОГ ТОВАРІВ
// ==========================================
const products = [
    { id: 1, name: "Пачка куль", price: 200 },
    { id: 2, name: "Граната Картон", price: 80 },
    { id: 3, name: "Граната з Чикою", price: 140 },
    { id: 4, name: "Солодка вода", price: 40 },
    { id: 5, name: "Вода мінеральна ", price: 20 },
    { id: 6, name: "Енергетик", price: 50 },
    { id: 7, name: "Снікерс", price: 50 },
    { id: 8, name: "Батончик", price: 30 },
];

let cart = [];

// ==========================================
// 3. ЛОГІКА ІНТЕРФЕЙСУ ТА КОШИКА
// ==========================================

// Генерація карток товарів на екрані
function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<b>${prod.name}</b><br><span>${prod.price} грн</span>`;
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

// Видалення позиції з чеку через хрестик
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateUI();
}

// Перерахунок суми та оновлення відображення чеку
function updateUI() {
    const cartContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    const payBtn = document.getElementById('pay-btn');
    
    if (!cartContainer || !totalEl) return;

    // Якщо чек порожній
    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="color:#9ca3af; text-align: center; margin-top: 20px;">Чек порожній</p>`;
        totalEl.innerText = '0';
        if (payBtn) payBtn.disabled = true;
        return;
    }

    // Якщо в чеку є товари
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

    // Зчитуємо спосіб оплати (Готівка чи Картка)
    const payMethod = document.querySelector('input[name="pay-method"]:checked').value;

    // Пакуємо кошик разом із поточною вибраною точкою
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
    renderProducts();
    updateUI();
};