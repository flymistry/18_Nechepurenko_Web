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
                <div class="weather-temp">${w.temperature}°C</div>
                <div class="weather-details">
                    <div class="weather-detail-item"><span class="weather-label">Скорость ветра</span><span class="weather-value">${w.windspeed} км/ч</span></div>
                    <div class="weather-detail-item"><span class="weather-label">Направление</span><span class="weather-value">${windDirLabel} (${w.winddirection}°)</span></div>
                </div>
            </div>
        `;
    } catch (err) {
        result.innerHTML = `<p class='error'>Ошибка: ${err.message}</p>`;
    }
}

function getWindDirection(deg) {
    const dirs = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
    return dirs[Math.round(deg / 45) % 8];
}

async function convertCurrency() {
    const result = document.getElementById("currencyResult");
    const amount = parseFloat(document.getElementById("currencyAmount").value);
    const from = document.getElementById("currencyFrom").value;
    const to = document.getElementById("currencyTo").value;

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
        const rate = data.rates[to];
        const converted = (amount * rate).toFixed(2);

        result.innerHTML = `
            <div class="result-card currency-card">
                <div class="currency-main">
                    <div class="currency-from-val">${amount} ${from}</div>
                    <div class="currency-arrow">↓</div>
                    <div class="currency-to-val">${converted} ${to}</div>
                </div>
            </div>
        `;
    } catch (err) {
        result.innerHTML = `<p class='error'>Ошибка: ${err.message}</p>`;
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
    }
}

async function getRandomDog() {
    const result = document.getElementById("dogResult");
    result.innerHTML = "<div class='loading'>Ищем собаку...</div>";

    try {
        const res = await fetch("https://dog.ceo/api/breeds/image/random");
        if (!res.ok) throw new Error("Ошибка API: " + res.status);
        const data = await res.json();
        const breedRaw = data.message.split("/breeds/")[1] || "";
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


let allThreads = [];
let threadViews = {};
let threadComments = {};
let isLoadingThreads = false;

async function loadThreads() {
    if (isLoadingThreads) return;
    isLoadingThreads = true;

    const publishBtn = document.getElementById("publishBtn");
    if (publishBtn) {
        publishBtn.disabled = true;
        publishBtn.textContent = 'Загрузка…';
    }

    document.getElementById('threads-list').innerHTML = "<p class='loading'>Загружаем обсуждения...</p>";
    setStatus('threads-status', 'loading', 'Загружаем обсуждения… GET /posts');

    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
        if (!res.ok) throw new Error("Ошибка: " + res.status);

        const raw = await res.json();

        allThreads = raw.map((p, i) => ({
            ...p,
            title: p.title || "Обсуждение #" + (i+1),
            body: p.body || "Текст обсуждения...",
            author: "Пользователь " + (i % 5 + 1),
            tag: ["discussion", "question", "news"][i % 3],
            tagLabel: ["Обсуждение", "Вопрос", "Новость"][i % 3],
            votes: Math.floor(Math.random() * 50) + 5
        }));

        threadViews = {};
        threadComments = {};
        allThreads.forEach(t => {
            threadViews[t.id] = Math.floor(Math.random() * 300) + 50;
            threadComments[t.id] = Math.floor(Math.random() * 25) + 3;
        });

        renderThreads();

    } catch (e) {
        document.getElementById('threads-list').innerHTML = `<p class='error'>Не удалось загрузить обсуждения</p>`;
        setStatus('threads-status', 'error', 'Ошибка загрузки. Попробуйте позже.');
    } finally {
        isLoadingThreads = false;
        if (publishBtn) {
            publishBtn.disabled = false;
            publishBtn.textContent = 'Опубликовать';
        }
    }
}

function renderThreads() {
    const container = document.getElementById('threads-list');
    if (!allThreads.length) {
        container.innerHTML = `<div class="empty-state"><span class="empty-icon"></span><div class="empty-title">Обсуждений пока нет</div></div>`;
        return;
    }

    let html = '';
    allThreads.forEach(t => {
        html += `
            <div class="thread-card">
                <div class="thread-meta">
                    <span class="thread-author">${t.author}</span>
                    <span class="thread-time">только что</span>
                    <span class="thread-tag tag-${t.tag}">${t.tagLabel}</span>
                </div>
                <div class="thread-title">${t.title}</div>
                <div class="thread-preview">${t.body.substring(0, 180)}${t.body.length > 180 ? '...' : ''}</div>
                <div class="thread-footer">
                    <span class="thread-stat">${threadComments[t.id] || 0} комментариев</span>
                    <span class="thread-stat">${threadViews[t.id] || 0} просмотров</span>
                </div>
                <div class="thread-actions">
                    <button onclick="openThread(${t.id})" class="btn" style="background:#FFBA87;color:#1A1A1A;">Открыть</button>
                    <button onclick="deleteThread(${t.id})" class="btn" style="background:#E9A5A2;">Удалить</button>
                </div>
            </div>`;
    });
    container.innerHTML = html;
}

async function createThread() {
    const title = document.getElementById('new-title').value.trim();
    const body = document.getElementById('new-body').value.trim();

    if (!title || !body) {
        alert("Заполните заголовок и текст");
        return;
    }

    const publishBtn = document.getElementById("publishBtn");
    publishBtn.disabled = true;
    publishBtn.textContent = 'Публикуем...';

    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, userId: 1 })
        });

        if (!res.ok) throw new Error("Ошибка создания");

        const data = await res.json();
        const newId = Date.now();

        allThreads.unshift({
            ...data,
            id: newId,
            title,
            body,
            author: "Вы",
            tag: "discussion",
            tagLabel: "Обсуждение",
            votes: 0
        });

        threadViews[newId] = 1;
        threadComments[newId] = 0;

        document.getElementById('new-title').value = '';
        document.getElementById('new-body').value = '';

        renderThreads();
        setStatus('threads-status', 'success', 'Пост успешно опубликован (POST)');

    } catch (e) {
        alert("Ошибка при публикации: " + e.message);
    } finally {
        publishBtn.disabled = false;
        publishBtn.textContent = 'Опубликовать';
    }
}

function openThread(id) {
    const thread = allThreads.find(t => t.id === id);
    if (!thread) return;

    threadViews[id] = (threadViews[id] || 0) + 1;
    alert(`Открыт тред: "${thread.title}"\n\n${thread.body}\n\nПросмотров: ${threadViews[id]}`);
    renderThreads();
}

async function deleteThread(id) {
    if (!confirm("Удалить это обсуждение?")) return;

    try {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: "DELETE" });
        allThreads = allThreads.filter(t => t.id !== id);
        renderThreads();
        setStatus('threads-status', 'success', 'Пост удалён (DELETE)');
    } catch (e) {
        alert("Ошибка удаления");
    }
}

function setStatus(id, type, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = type ? type : '';
    el.innerHTML = text ? `<p class="${type}">${text}</p>` : '';
}