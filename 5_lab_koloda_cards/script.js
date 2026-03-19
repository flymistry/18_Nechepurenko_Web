class Card {
    constructor(name, type, description, effect, imagePath = 'images/placeholder.jpg') {
        this.name = name;
        this.type = type;
        this.description = description;
        this.effect = effect;
        this.imagePath = imagePath;
        this.id = Date.now() + Math.random().toString(36).substr(2, 9);
    }
 
    getFrontHTML() {
        return `
            <div class="card-front">
                <div class="card-image">
                    <img src="${this.imagePath}" alt="${this.name}" onerror="this.src='images/placeholder.png'">
                </div>
            </div>
        `;
    }
 
    getBackHTML() {
        return `
            <div class="card-back">
                <h3>${this.name}</h3>
                <div class="card-type">${this.type}</div>
                <div class="card-description">${this.description}</div>
                <div class="card-effect">${this.effect}</div>
            </div>
        `;
    }
 
    getHTML() {
        return `
            <div class="card-container" data-id="${this.id}" onclick="this.classList.toggle('flipped')">
                <div class="card-flipper">
                    ${this.getFrontHTML()}
                    ${this.getBackHTML()}
                </div>
            </div>
        `;
    }
}
 
class QueenCard extends Card {
    constructor(name, description, effect, imagePath, points) {
        super(name, "Королева", description, effect, imagePath);
        this.points = points;
    }
    getBackHTML() {
        return `
            <div class="card-back">
                <h3>${this.name}</h3>
                <div class="card-type">Королева · ${this.points} очков</div>
                <div class="card-description">${this.description}</div>
                <div class="card-effect">${this.effect}</div>
            </div>
        `;
    }
}
 
class KingJesterCard extends Card {
    constructor(name, description, effect, imagePath, action) {
        super(name, "Король / Шут", description, effect, imagePath);
        this.action = action;
    }
    getBackHTML() {
        return `
            <div class="card-back">
                <h3>${this.name}</h3>
                <div class="card-type">Действие</div>
                <div class="card-description">${this.description}</div>
                <div class="card-effect">${this.action}</div>
            </div>
        `;
    }
}
 
class MagicItemCard extends Card {
    constructor(name, description, effect, imagePath, magicType) {
        super(name, "Волшебный предмет", description, effect, imagePath);
        this.magicType = magicType;
    }
    getBackHTML() {
        return `
            <div class="card-back">
                <h3>${this.name}</h3>
                <div class="card-type">${this.magicType}</div>
                <div class="card-description">${this.description}</div>
                <div class="card-effect">${this.effect}</div>
            </div>
        `;
    }
}
 
const initialDeck = [
    new KingJesterCard(
        "Шут",
        "Карта удачи и веселья",
        "Переверните верхнюю карту колоды. Если это Король, Рыцарь, Дракон, Сонное Зелье, Волшебная Палочка или Шут — возьмите её и получите дополнительный ход. Если цифра — сосчитайте игроков, последний берёт Королеву.",
        "images/jester.jpg",
        "Испытай удачу"
    ),
    new QueenCard(
        "Королева Роз",
        "Приносит удачу при пробуждении",
        "Позволяет разбудить дополнительную Королеву",
        "images/rose.jpg",
        5
    ),
    new KingJesterCard(
        "Король Шляп",
        "Король с большой шляпой",
        "Может разбудить любую спящую Королеву",
        "images/hat.jpg",
        "Разбуди Королеву"
    ),
    new MagicItemCard(
        "Волшебная Палочка",
        "Защищает от магии сна",
        "Может остановить действие Сонного Зелья",
        "images/magicstick.jpg","Защита"
    ),
    new Card(
        "8 Подсолнухов",
        "Цифровая карта",
        "Карта с цифрой 8. Можно использовать в математических уравнениях или для сброса.",
        "Можно сбросить с другими картами, составляя уравнения (2+6=8, 3+5=8, 4+4=8 и т.д.)",
        "images/podsolnuh.jpg"
    ),
 
    new QueenCard(
        "Королева Кошек",
        "Гордая и независимая — не терпит собак рядом с собой.",
        "Несовместима с Королевой Собак: если у вас уже есть Королева Кошек, разбудить Королеву Собак нельзя (и наоборот). Если такая ситуация возникла — положите новую королеву обратно лицом вниз. Ход считается потраченным.",
        "images/cat.jpg",
        15
    ),
 
    new KingJesterCard(
        "Рыцарь",
        "Бесстрашный воин, способный забрать чужую принцессу.",
        "Сыграйте Рыцаря, чтобы украсть у любого соперника одну из его проснувшихся принцесс. Противник может немедленно сыграть Дракона с руки — тогда обе карты идут в сброс, оба игрока добирают по 1 карте, ход переходит дальше.",
        "images/knight.jpg",
        "Укради принцессу"
    ),
 
    new KingJesterCard(
        "Дракон",
        "Верный страж, защищающий принцессу от похищения.",
        "Немедленно сыграйте Дракона с руки в ответ на Рыцаря соперника, чтобы защитить свою принцессу. Обе карты (Дракон и Рыцарь) идут в сброс, оба игрока добирают по 1 карте. Это не считается за ваш ход.",
        "images/dragon.jpg",
        "Защити принцессу"
    ),
 
    new MagicItemCard(
        "Сонное Зелье",
        "Коварное зелье, погружающее принцессу обратно в сон.",
        "Сыграйте Сонное Зелье, чтобы усыпить любую проснувшуюся принцессу — свою или чужую. Положите её лицом вниз на свободное место среди спящих. Противник может немедленно сыграть Волшебную Палочку, чтобы этому помешать.",
        "images/potion.jpg",
        "Сонное зелье"
    )
];
 
let deck = [];

function loadFromStorage() {
    const savedDeck = localStorage.getItem('sleepingQueensDeck');
    if (savedDeck) {
        try {
            const parsed = JSON.parse(savedDeck);
            deck = parsed.map(d => {
                switch (d.cardClass) {
                    case 'QueenCard':      return new QueenCard(d.name, d.description, d.effect, d.imagePath, d.points);
                    case 'KingJesterCard': return new KingJesterCard(d.name, d.description, d.effect, d.imagePath, d.action);
                    case 'MagicItemCard':  return new MagicItemCard(d.name, d.description, d.effect, d.imagePath, d.magicType);
                    default:               return new Card(d.name, d.type, d.description, d.effect, d.imagePath);
                }
            });
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            deck = [...initialDeck];
        }
    } else {
        deck = [...initialDeck];
    }
}
 
function saveToStorage() {
    const data = deck.map(c => ({
        cardClass: c.constructor.name,
        name: c.name, type: c.type,
        description: c.description, effect: c.effect,
        imagePath: c.imagePath,
        points: c.points, action: c.action, magicType: c.magicType
    }));
    localStorage.setItem('sleepingQueensDeck', JSON.stringify(data));
}
 
 
function renderEditGrid() {
    const cardTypeNames = {
        'Card': 'Обычная карта',
        'QueenCard': 'Королева',
        'KingJesterCard': 'Король / Шут',
        'MagicItemCard': 'Волшебный предмет'
    };
 
    const editCardsHTML = deck.map((card, index) => `
        <div class="edit-card" data-index="${index}">
            <button class="remove-card" onclick="removeCard(${index})">×</button>
            <h3>${card.name}</h3>
 
            <label>Название</label>
            <input type="text" class="edit-name"


value="${escHtml(card.name)}" placeholder="Название">
 
            <label>Тип карты</label>
            <select class="edit-card-class">
                ${Object.entries(cardTypeNames).map(([val, label]) =>
                    `<option value="${val}" ${card.constructor.name === val ? 'selected' : ''}>${label}</option>`
                ).join('')}
            </select>
 
            <label>Описание</label>
            <textarea class="edit-description" placeholder="Описание">${escHtml(card.description || '')}</textarea>
 
            <label>Эффект / Действие</label>
            <textarea class="edit-effect" placeholder="Эффект">${escHtml(card.effect || '')}</textarea>
 
            <label>Путь к изображению</label>
            <input type="text" class="edit-image" value="${escHtml(card.imagePath)}" placeholder="images/card.jpg">
            <div class="image-path">${escHtml(card.imagePath)}</div>
        </div>
    `).join('');
 
    document.getElementById('editGrid').innerHTML = editCardsHTML;
}
 
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function openModal() {
    renderEditGrid();
    document.getElementById('editModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}
 
function closeModal() {
    document.getElementById('editModal').classList.remove('open');
    document.body.style.overflow = '';
}

window.addNewCard = function () {
    deck.push(new Card(
        "Новая карта",
        "Обычная карта",
        "Описание новой карты",
        "Эффект карты",
        "images/placeholder.png"
    ));
    renderEditGrid();
};

window.removeCard = function (index) {
    if (deck.length > 1) {
        deck.splice(index, 1);
        renderEditGrid();
    } else {
        alert('Колода должна содержать хотя бы одну карту!');
    }
};

window.saveChanges = function () {
    const editCards = document.querySelectorAll('.edit-card');
    const newDeck = [];
 
    editCards.forEach(ec => {
        const name        = ec.querySelector('.edit-name').value;
        const cardClass   = ec.querySelector('.edit-card-class').value;
        const description = ec.querySelector('.edit-description').value;
        const effect      = ec.querySelector('.edit-effect').value;
        const imagePath   = ec.querySelector('.edit-image').value;
 
        let card;
        switch (cardClass) {
            case 'QueenCard':      card = new QueenCard(name, description, effect, imagePath, 5); break;
            case 'KingJesterCard': card = new KingJesterCard(name, description, effect, imagePath, "Действие"); break;
            case 'MagicItemCard':  card = new MagicItemCard(name, description, effect, imagePath, "Магия"); break;
            default:               card = new Card(name, "Обычная карта", description, effect, imagePath);
        }
        newDeck.push(card);
    });
 
    deck = newDeck;
    saveToStorage();
    switchMode('view');
};

let currentMode = 'view';

function buildDOM() {
    const deco = document.createElement('div');
    deco.setAttribute('aria-hidden', 'true');
    deco.innerHTML = `
        <div class="bg-layer"></div>
        <div class="petals-container" id="petals"></div>
    `;
    document.body.appendChild(deco);
 
    const header = document.createElement('header');
    header.innerHTML = `
        <h1> Спящие Королевы </h1>
        <nav><button id="editModeBtn">Редактировать</button>
        </nav>
    `;
    document.body.appendChild(header);
 
    const main = document.createElement('main');
    main.id = 'mainContent';
    document.body.appendChild(main);
}

function renderViewMode() {
    const main = document.getElementById('mainContent');
    main.innerHTML = '';
 
    const container = document.createElement('div');
    container.className = 'cards-container';
 
    const perRow = 3;
    for (let i = 0; i < deck.length; i += perRow) {
        const row = document.createElement('div');
        row.className = 'row';
        deck.slice(i, i + perRow).forEach(card => {
            row.innerHTML += card.getHTML();
        });
        container.appendChild(row);
    }
    main.appendChild(container);
}

function renderEditMode() {
    const main = document.getElementById('mainContent');
    main.innerHTML = '';
 
    const cardTypeNames = {
        'Card': 'Обычная карта',
        'QueenCard': 'Королева',
        'KingJesterCard': 'Король / Шут',
        'MagicItemCard': 'Волшебный предмет'
    };
 
    const toolbar = document.createElement('div');
    toolbar.className = 'edit-toolbar';
    toolbar.innerHTML = `
        <button onclick="addNewCard()">+ Добавить карту</button>
        <button onclick="saveChanges()" class="save-btn">Сохранить</button>
    `;
    main.appendChild(toolbar);
 
    const grid = document.createElement('div');
    grid.className = 'edit-grid';
    grid.id = 'editGrid';
    main.appendChild(grid);
 
    renderEditGrid();
}

function renderEditGrid() {
    const cardTypeNames = {
        'Card': 'Обычная карта',
        'QueenCard': 'Королева',
        'KingJesterCard': 'Король / Шут',
        'MagicItemCard': 'Волшебный предмет'
    };
 
    document.getElementById('editGrid').innerHTML = deck.map((card, index) => `
        <div class="edit-card" data-index="${index}">
            <button class="remove-card" onclick="removeCard(${index})">×</button>
            <h3>${card.name}</h3>
            <label>Название</label>
            <input type="text" class="edit-name" value="${escHtml(card.name)}" placeholder="Название">
            <label>Тип карты</label>
            <select class="edit-card-class">
                ${Object.entries(cardTypeNames).map(([val, label]) =>
                    `<option value="${val}" ${card.constructor.name === val ? 'selected' : ''}>${label}</option>`
                ).join('')}
            </select>
            <label>Описание</label>
            <textarea class="edit-description" placeholder="Описание">${escHtml(card.description || '')}</textarea>
            <label>Эффект / Действие</label>
            <textarea class="edit-effect" placeholder="Эффект">${escHtml(card.effect || '')}</textarea>
            <label>Путь к изображению</label>
            <input type="text" class="edit-image" value="${escHtml(card.imagePath)}" placeholder="images/card.jpg">
            <div class="image-path">${escHtml(card.imagePath)}</div>
        </div>
    `).join('');
}
 
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function switchMode(mode) {
    currentMode = mode;
    const btn = document.getElementById('editModeBtn');
    if (mode === 'edit') {
        btn.textContent = 'Готово';
        btn.classList.add('active');
        renderEditMode();
    } else {
        btn.textContent = 'Редактировать';
        btn.classList.remove('active');
        renderViewMode();
    }
}

window.addNewCard = function () {
    deck.push(new Card(
        "Новая карта",
        "Обычная карта",
        "Описание новой карты",
        "Эффект карты",
        "images/placeholder.png"
    ));
    renderEditGrid();
};

window.removeCard = function (index) {
    if (deck.length > 1) {
        deck.splice(index, 1);
        renderEditGrid();
    } else {
        alert('Колода должна содержать хотя бы одну карту!');
    }
};

window.saveChanges = function () {
    const editCards = document.querySelectorAll('.edit-card');
    const newDeck = [];
 
    editCards.forEach(ec => {
        const name        = ec.querySelector('.edit-name').value;
        const cardClass   = ec.querySelector('.edit-card-class').value;
        const description = ec.querySelector('.edit-description').value;
        const effect      = ec.querySelector('.edit-effect').value;
        const imagePath   = ec.querySelector('.edit-image').value;
 
        let card;
        switch (cardClass) {
            case 'QueenCard':      card = new QueenCard(name, description, effect, imagePath, 5); break;
            case 'KingJesterCard': card = new KingJesterCard(name, description, effect, imagePath, effect); break;
            case 'MagicItemCard':  card = new MagicItemCard(name, description, effect, imagePath, "Магия"); break;
            default:               card = new Card(name, "Обычная карта", description, effect, imagePath);
        }
        newDeck.push(card);
    });
 
    deck = newDeck;
    saveToStorage();
    switchMode('view');
};

function spawnPetals() {
    const container = document.getElementById('petals');
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        p.style.left              = Math.random() * 100 + 'vw';
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay    = (Math.random() * 14) + 's';
        p.style.width             = (8 + Math.random() * 10) + 'px';
        p.style.height            = (10 + Math.random() * 14) + 'px';
        p.style.opacity           = 0;
        const h = 330 + Math.random() * 30;
        p.style.background = `radial-gradient(ellipse at 40% 30%, hsl(${h},80%,85%), hsl(${h},70%,70%,0.7))`;
        container.appendChild(p);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    buildDOM();
    loadFromStorage();
    spawnPetals();
    switchMode('view');
 
    document.getElementById('editModeBtn').addEventListener('click', () => {
        switchMode(currentMode === 'view' ? 'edit' : 'view');
    });
});