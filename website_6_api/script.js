function showSection(id) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");

    document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
    const activeLink = document.querySelector(`nav a[onclick*="${id}"]`);
    if (activeLink) activeLink.classList.add("active");
}

async function getJoke() {
    const result = document.getElementById("jokeResult");
    result.innerHTML = "<p class='loading'>Загрузка шутки...</p>";

    try {
        const res = await fetch("https://official-joke-api.appspot.com/jokes/random");
        if (!res.ok) throw new Error("Ошибка API: " + res.status);

        const data = await res.json();
        result.innerHTML = `
            <div class="result-card">
                <p class="joke-setup">${data.setup}</p>
                <p class="joke-punchline">${data.punchline}</p>
            </div>
        `;
    } catch (err) {
        result.innerHTML = `<p class='error'>Ошибка: ${err.message}</p>`;
        console.error("Joke API Error:", err);
    }
}

async function getWeather() {
    const result = document.getElementById("weatherResult");
    const lat = parseFloat(document.getElementById("latitude").value);
    const lon = parseFloat(document.getElementById("longitude").value);

    if (isNaN(lat) || isNaN(lon)) {
        result.innerHTML = "<p class='error'>Введите корректные координаты</p>";
        return;
    }

    result.innerHTML = "<p class='loading'>Загрузка погоды...</p>";

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Ошибка API: " + res.status);

        const data = await res.json();
        const w = data.current_weather;
        const windDirLabel = getWindDirection(w.winddirection);

        result.innerHTML = `
            <div class="result-card weather-card">
                <div class="weather-temp">${w.temperature}&#176;C</div>
                <div class="weather-details">
                    <div class="weather-detail-item">
                        <span class="weather-label">Скорость ветра</span>
                        <span class="weather-value">${w.windspeed} км/ч</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="weather-label">Направление</span>
                        <span class="weather-value">${windDirLabel} (${w.winddirection}&#176;)</span>
                    </div>
                    <div class="weather-detail-item">
                        <span class="weather-label">Координаты</span>
                        <span class="weather-value">${lat}, ${lon}</span>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        result.innerHTML = `<p class='error'>Ошибка: ${err.message}</p>`;
        console.error("Weather API Error:", err);
    }
}

function getWindDirection(deg) {
    const dirs = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
    return dirs[Math.round(deg / 45) % 8];
}

async function convertCurrency() {
    const result = document.getElementById("currencyResult");
    const amount = parseFloat(document.getElementById("currencyAmount").value);
    const from   = document.getElementById("currencyFrom").value;
    const to     = document.getElementById("currencyTo").value;

    if (isNaN(amount) || amount <= 0) {
        result.innerHTML = "<p class='error'>Введите корректную сумму</p>";
        return;
    }

    if (from === to) {
        result.innerHTML = "<p class='error'>Выберите разные валюты</p>";
        return;
    }

    result.innerHTML = "<p class='loading'>Загружаем курс...</p>";

    try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        if (!res.ok) throw new Error("Ошибка API: " + res.status);

        const data = await res.json();
        if (data.result !== "success") throw new Error("API вернул ошибку");

        const rate      = data.rates[to];
        const converted = (amount * rate).toFixed(2);
        const updated   = new Date(data.time_last_update_utc).toLocaleDateString("ru-RU");

        const popular = ["USD", "EUR", "GBP", "JPY", "CHF"].filter(c => c !== from);
        const extraRates = popular.map(code => `
            <div class="currency-extra-row">
                <span class="currency-extra-code">${code}</span>
                <span class="currency-extra-val">${(data.rates[code]).toFixed(4)}</span>
            </div>
        `).join("");

        result.innerHTML = `
            <div class="result-card currency-card">
                <div class="currency-main">
                    <div class="currency-from-val">${amount.toLocaleString("ru-RU")} ${from}</div>
                    <div class="currency-arrow">&darr;</div>
                    <div class="currency-to-val">${Number(converted).toLocaleString("ru-RU")} ${to}</div>
                </div>
                <div class="currency-rate-info">
                    1 ${from} = ${rate.toFixed(4)} ${to}
                </div>
                <div class="currency-extra">
                    <div class="currency-extra-title">Другие курсы к ${from}</div>
                    ${extraRates}
                </div>
            </div>
        `;
    } catch (err) {
        result.innerHTML = `<p class='error'>Ошибка: ${err.message}</p>`;
        console.error("Currency API Error:", err);
    }
}


async function getBooks() {
    const result = document.getElementById("booksResult");
    result.innerHTML = "<p class='loading'>Загрузка книг...</p>";

    try {
        const res = await fetch("https://stephen-king-api.onrender.com/api/books");
        if (!res.ok) throw new Error("Ошибка API: " + res.status);

        const data = await res.json();
        const books = data.data.slice(0, 12);

        result.innerHTML = `
            <div class="books-grid">
                ${books.map(book => `
                    <div class="book-card">
                        <div class="book-year">${book.Year}</div>
                        <div class="book-title">${book.Title}</div>
                        ${book.Pages ? `<div class="book-pages">${book.Pages} стр.</div>` : ""}
                    </div>
                `).join("")}
            </div>
        `;
    } catch (err) {
        result.innerHTML = `<p class='error'>Ошибка загрузки книг: ${err.message}</p>`;
        console.error(err);
    }
}

async function getRandomDog() {
    const result = document.getElementById("dogResult");
    result.innerHTML = "<div class='loading'>Ищем собаку...</div>";

    try {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        if (!res.ok) throw new Error("Ошибка API: " + res.status);

        const data = await res.json();
        const breedRaw = data.message.split("/breeds/")[1]
            ? data.message.split("/breeds/")[1].split("/")[0]
            : "";
        const breed = breedRaw.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());

        result.innerHTML = `
            <div class="result-card dog-card">
                <h3>${breed || "Случайная собака"}</h3>
                <img src="${data.message}" alt="Фото собаки" class="dog-img">
                <button onclick="getRandomDog()" class="btn dog-btn">Другую собаку</button>
            </div>
        `;
    } catch (err) {
        result.innerHTML = `<div class='error'>Ошибка загрузки: ${err.message}</div>`;
    }
}
