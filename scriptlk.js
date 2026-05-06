const menuItems = [
    { id: 1, title: "Зеленый боул с лососем", price: 560, kcal: 450, img: "img/green_bowl_salmon.jpg" },
    { id: 2, title: "Салат Цезарь Light", price: 390, kcal: 280, img: "img/caesar_light.jpg" },
    { id: 3, title: "Стейк из индейки", price: 480, kcal: 320, img: "img/turkey_steak.jpg" },
    { id: 4, title: "Смузи Ягода-Мята", price: 250, kcal: 120, img: "img/berry_mint_smoothie.jpg" },
    { id: 5, title: "Киноа с овощами", price: 410, kcal: 310, img: "img/quinoa_vegetables.jpg" },
    { id: 6, title: "Запеченная треска", price: 520, kcal: 290, img: "img/baked_cod.jpg" },
    { id: 7, title: "Греческий салат", price: 350, kcal: 210, img: "img/greek_salad.jpg" },
    { id: 8, title: "Матча-латте", price: 280, kcal: 85, img: "img/matcha_latte.jpg" },
    { id: 9, title: "Протеиновые панкейки", price: 340, kcal: 380, img: "img/protein_pancakes.jpg" },
    { id: 10, title: "Поке с тунцом", price: 590, kcal: 410, img: "img/tuna_poke.jpg" }
];

let cart = [];
let discount = 0;
let users = JSON.parse(localStorage.getItem(`bf_users`)) || [];
let currentUser = JSON.parse(localStorage.getItem(`bf_curr`)) || null;

// Живые отзывы покупателей
let reviews = JSON.parse(localStorage.getItem(`bf_revs`)) || [
    { name: `Алана`, rating: 5, text: `Заказываю тут постоянно после тренировок. Боул с лососем просто божественный!` },
    { name: `Санджи`, rating: 5, text: `Наконец-то в Элисте появилось нормальное ПП. Калькулятор ИМТ очень кстати.` },
    { name: `Виктория`, rating: 4, text: `Очень вкусно, но один раз курьер задержался на 10 минут. В остальном все супер!` },
    { name: `Эрдни`, rating: 5, text: `Стейк из индейки сочный, калории честные. Похудел на 3 кг за месяц с вами!` }
];

function toggleTheme() {
    document.body.classList.toggle(`dark-theme`);
}

function calculateBMI() {
    const w = document.getElementById(`bmi-w`).value;
    const h = document.getElementById(`bmi-h`).value / 100;
    const res = document.getElementById(`bmi-res`);
    if(w > 0 && h > 0) {
        const bmi = (w / (h * h)).toFixed(1);
        res.innerHTML = `Ваш ИМТ: <b>${bmi}</b>`;
    }
}

function renderMenu(items) {
    const cont = document.getElementById(`menu-container`);
    if(!cont) return;
    cont.innerHTML = items.map(i => `
        <div class="card">
            <div class="card__img" style="background-image:url('${i.img}')"></div>
            <h3>${i.title}</h3>
            <p>${i.kcal} ккал | ${i.price} ₽</p>
            <button class="btn" onclick="addToCart(${i.id})">В корзину</button>
        </div>
    `).join(``);
}

function addToCart(id) {
    cart.push(menuItems.find(i => i.id === id));
    updateCart();
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    updateCart();
}

function updateCart() {
    document.getElementById(`cart-count`).innerText = cart.length;
    let total = 0;
    document.getElementById(`cart-list`).innerHTML = cart.map((i, idx) => {
        total += i.price;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span>${i.title}</span>
            <span>${i.price} ₽ <b onclick="removeFromCart(${idx})" style="color:red; cursor:pointer; margin-left:10px;">✖</b></span>
        </div>`;
    }).join(``);
    const final = total - (total * discount);
    document.getElementById(`total-price-display`).innerText = `Итого: ${final.toFixed(0)} ₽`;
}

function applyPromo() {
    if(document.getElementById(`promo-code`).value === `BIO2026`) {
        discount = 0.1;
        alert(`Скидка 10% активирована!`);
        updateCart();
    }
}

function toggleCartModal() {
    const m = document.getElementById(`cart-modal`);
    m.style.display = m.style.display === `block` ? `none` : `block`;
}

function toggleAuthModal() {
    const m = document.getElementById(`auth-modal`);
    m.style.display = m.style.display === `block` ? `none` : `block`;
    if(currentUser) showProfile();
}

function handleAuth() {
    const n = document.getElementById(`auth-name`).value;
    const e = document.getElementById(`auth-email`).value;
    const p = document.getElementById(`auth-pass`).value;
    if(!e || !p) return alert(`Заполните поля`);
    
    currentUser = { name: n || `Гость`, email: e, water: 0 };
    localStorage.setItem(`bf_curr`, JSON.stringify(currentUser));
    location.reload();
}

function showProfile() {
    document.getElementById(`login-form`).style.display = `none`;
    document.getElementById(`profile-card`).style.display = `block`;
    document.getElementById(`profile-name`).innerText = currentUser.name;
    document.getElementById(`water-count`).innerText = currentUser.water || 0;
}

function logout() {
    localStorage.removeItem(`bf_curr`);
    location.reload();
}

function addWater() {
    currentUser.water = (currentUser.water || 0) + 1;
    if (currentUser.water > 8) currentUser.water = 8; // Лимит 8 стаканов
    
    document.getElementById(`water-count`).innerText = currentUser.water;
    
    // Обновляем полоску прогресса
    const progress = (currentUser.water / 8) * 100;
    document.getElementById('water-progress').style.width = progress + '%';
    
    localStorage.setItem(`bf_curr`, JSON.stringify(currentUser));
}

function renderReviews() {
    const cont = document.getElementById(`reviews-container`);
    cont.innerHTML = reviews.map(r => `
        <div class="review-card" style="background:#fff; padding:20px; border-radius:15px; margin-bottom:15px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            <h4>${r.name}</h4>
            <div style="color:#ffd700;">${`⭐`.repeat(r.rating)}</div>
            <p>${r.text}</p>
        </div>
    `).join(``);
}

function submitReview() {
    const txt = document.getElementById(`review-text`).value;
    if(!txt) return;
    reviews.push({ name: currentUser.name, rating: 5, text: txt });
    localStorage.setItem(`bf_revs`, JSON.stringify(reviews));
    renderReviews();
    document.getElementById(`review-text`).value = ``;
}

window.onscroll = () => {
    document.getElementById(`to-top`).style.display = window.scrollY > 400 ? `block` : `none`;
};

function scrollToTop() {
    window.scrollTo({top: 0, behavior: `smooth`});
}

document.addEventListener(`DOMContentLoaded`, () => {
    renderMenu(menuItems);
    renderReviews();
    if(currentUser) {
        document.getElementById(`auth-btn`).innerText = currentUser.name;
        document.getElementById(`review-auth-warning`).style.display = `none`;
        document.getElementById(`review-form-block`).style.display = `block`;
    }
});
// --- БЛОК ЛОГИКИ ПОИСКА ---
const searchInput = document.getElementById('search');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        // 1. Получаем текст из поля ввода и приводим к нижнему регистру
        const searchTerm = e.target.value.toLowerCase().trim();

        // 2. Фильтруем массив menuItems по названию блюда
        const filteredItems = menuItems.filter(item => {
            return item.title.toLowerCase().includes(searchTerm);
        });

        // 3. Вызываем функцию отрисовки только для найденных блюд
        renderMenu(filteredItems);
        
        // 4. Если ничего не найдено, можно вывести сообщение (опционально)
        const container = document.getElementById('menu-container');
        if (filteredItems.length === 0) {
            container.innerHTML =`<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Блюдо "${searchTerm}" не найдено</p>`;
        }
    });
}
// --- КОНЕЦ БЛОКА ПОИСКА ---