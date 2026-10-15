console.log("CAR POINT загружен");

/* =====================================================
   КАТАЛОГ АВТОМОБИЛЕЙ (только catalog.html)
   ===================================================== */

(function () {
    const grid = document.getElementById("carsGrid");
    if (!grid) return; // это не страница каталога

    /* ---------- 1. Данные: 12 автомобилей ---------- */
    const CARS = [
        { brand: "BMW",           model: "320i",    year: 2020, engine: 2.0, fuel: "Бензин", mileage: 120000, price: 22500 },
        { brand: "Mercedes-Benz", model: "E 220",   year: 2019, engine: 2.0, fuel: "Дизель", mileage: 150000, price: 26800 },
        { brand: "Audi",          model: "A4",      year: 2021, engine: 2.0, fuel: "Бензин", mileage: 90000,  price: 27500 },
        { brand: "Volkswagen",    model: "Tiguan",  year: 2018, engine: 2.0, fuel: "Дизель", mileage: 140000, price: 19900 },
        { brand: "Skoda",         model: "Octavia", year: 2020, engine: 1.6, fuel: "Дизель", mileage: 110000, price: 16500 },
        { brand: "Toyota",        model: "Corolla", year: 2019, engine: 2.0, fuel: "Бензин", mileage: 95000,  price: 14800 },
        { brand: "Hyundai",       model: "Tucson",  year: 2021, engine: 2.0, fuel: "Бензин", mileage: 70000,  price: 22000 },
        { brand: "Ford",          model: "Focus",   year: 2018, engine: 1.5, fuel: "Бензин", mileage: 130000, price: 13900 },
        { brand: "BMW",           model: "X5",      year: 2019, engine: 3.0, fuel: "Дизель", mileage: 160000, price: 38500 },
        { brand: "Audi",          model: "Q5",      year: 2020, engine: 2.0, fuel: "Дизель", mileage: 105000, price: 34200 },
        { brand: "Mercedes-Benz", model: "C 200",   year: 2021, engine: 1.5, fuel: "Бензин", mileage: 60000,  price: 31900 },
        { brand: "Volkswagen",    model: "Golf",    year: 2019, engine: 1.4, fuel: "Бензин", mileage: 98000,  price: 15700 }
    ];

    /* ---------- 2. Иконки ---------- */
    const ICON = {
        car:    '<svg class="car-ph" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><path d="M14 26l4-11c.7-2 2.6-3.3 4.7-3.3h18.6c2.1 0 4 1.3 4.7 3.3l4 11c2.6.6 4 2.5 4 5v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2H18v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V31c0-2.5 1.4-4.4 4-5zm6.5-8L18 26h28l-2.5-8h-23zM19 33a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm26 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>',
        heart:  '<svg width="18" height="18" viewBox="0 0 24 24" stroke-linejoin="round"><path d="M12 21s-7-4.6-9.5-9.2C.7 8.4 2.5 4.5 6.2 4.5c2 0 3.3 1 3.8 2 .5-1 1.8-2 3.8-2 3.7 0 5.5 3.9 3.7 7.3C19 16.4 12 21 12 21z"/></svg>',
        year:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
        engine: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h3l2-2h6v3h3v6h-3v2H9l-2-2H4z"/></svg>',
        fuel:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M3 21h14M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/></svg>',
        road:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
    };

    /* ---------- 3. Элементы страницы ---------- */
    const foundCount  = document.getElementById("foundCount");
    const foundWord   = document.getElementById("foundWord");
    const emptyMsg    = document.getElementById("emptyMsg");
    const searchInput = document.querySelector(".search-input");
    const favorites   = new Set();

    /* ---------- 4. Вспомогательные функции ---------- */
    const formatNumber = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    function pluralCars(n) {
        const m10 = n % 10, m100 = n % 100;
        if (m10 === 1 && m100 !== 11) return "автомобиль";
        if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return "автомобиля";
        return "автомобилей";
    }

    /* ---------- 5. Отрисовка ---------- */
    function cardHTML(car) {
        const name  = `${car.brand} ${car.model}`;
        const isFav = favorites.has(name) ? " on" : "";

        return `
        <article class="car-card">
            <div class="car-img">
                ${ICON.car}
                <button type="button" class="fav${isFav}" data-name="${name}" aria-label="В избранное">${ICON.heart}</button>
            </div>

            <h3 class="car-title">${name}</h3>

            <ul class="car-specs">
                <li>${ICON.year}${car.year}</li>
                <li>${ICON.engine}${car.engine.toFixed(1)} л</li>
                <li>${ICON.fuel}${car.fuel}</li>
                <li>${ICON.road}${formatNumber(car.mileage)} км</li>
            </ul>

            <div class="car-bottom">
                <span class="car-price">${formatNumber(car.price)} €</span>
                <a href="#" class="car-btn">Подробнее →</a>
            </div>
        </article>`;
    }

    function render() {
        // поиск в шапке (если ничего не введено — показываем все машины)
        const query = searchInput.value.trim().toLowerCase();
        const cars  = CARS.filter((c) => `${c.brand} ${c.model}`.toLowerCase().includes(query));

        grid.innerHTML = cars.map(cardHTML).join("");
        emptyMsg.hidden = cars.length > 0;

        foundCount.textContent = cars.length;
        foundWord.textContent  = pluralCars(cars.length);
    }

    /* ---------- 6. События ---------- */
    // поиск в шапке
    document.querySelector(".search").addEventListener("submit", (e) => {
        e.preventDefault();
        render();
    });

    // сердечко «в избранное»
    grid.addEventListener("click", (e) => {
        const btn = e.target.closest(".fav");
        if (!btn) return;

        const name = btn.dataset.name;
        favorites.has(name) ? favorites.delete(name) : favorites.add(name);
        btn.classList.toggle("on");
    });

    // переключатель «плитка / список»
    document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            grid.classList.toggle("list", btn.dataset.view === "list");
        });
    });

    /* ---------- 7. Старт ---------- */
    render();
})();