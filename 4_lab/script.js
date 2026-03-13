document.addEventListener('DOMContentLoaded', () => {
    initApp();
});


function initApp() {
    createThemeButton();
    loadThemePreference();
    initReviews();
}

let themeToggle = null;

function createThemeButton() {
    console.log('createThemeButton() вызвана'); 
    
    if (document.getElementById('theme-toggle')) {
        themeToggle = document.getElementById('theme-toggle');
        return;
    }
    
    themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = '🌙 Тёмная тема';
    
    themeToggle.style.position = 'fixed';
    themeToggle.style.top = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.padding = '12px 24px';
    themeToggle.style.backgroundColor = '#000';
    themeToggle.style.color = '#fff';
    themeToggle.style.border = '2px solid #ff00ff';
    themeToggle.style.borderRadius = '30px';
    themeToggle.style.fontWeight = 'bold';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.zIndex = '999999';
    themeToggle.style.boxShadow = '4px 4px 0 #00ffff';
    
    themeToggle.addEventListener('click', toggleTheme);
    document.body.appendChild(themeToggle);

}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.innerHTML = isDark ? '☀️ Светлая тема' : '🌙 Тёмная тема';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '☀️ Светлая тема';
        }
    }
}

const defaultReviews = [
    {
        id: 1,
        name: "Тони Старк",
        text: "К сожалению не пригодилось. Дед вышел из комы.",
        image: "daun.jpg",
        date: new Date().toLocaleDateString()
    },
    {
        id: 2,
        name: "Долька лимона",
        text: "Круто, но чет не хватает. Мужика наверное. Мне.",
        image: "долина.jpg",
        date: new Date().toLocaleDateString()
    },
    {
        id: 3,
        name: "Аркадий Паровозов",
        text: "Ноющая боль слева под ребрами.",
        image: "арсенчик.jpg",
        date: new Date().toLocaleDateString()
    },
    {
        id: 4,
        name: "Майкл Джордан",
        text: "Купил 28B место по акции. Думал, будет хуже. А оказалось, что хуже некуда!",
        image: "каньюха.jpg",
        date: new Date().toLocaleDateString()
    }
];

let reviews = [];
let uploadedImageData = null;

function initReviews() {
    loadReviewsFromCookie();
    createReviewForm();
    displayReviews();
}

function createReviewForm() {
    const testimonialsSection = document.querySelector('.testimonials');
    if (!testimonialsSection) return;

    if (document.querySelector('.review-form-container')) return;

    const formContainer = document.createElement('div');
    formContainer.className = 'review-form-container';
    formContainer.innerHTML = `
        <h4>Оставить отзыв</h4>
        <form id="reviewForm">
            <div class="form-group">
                <label for="reviewName">Ваше имя *</label>
                <input type="text" id="reviewName" required minlength="2" maxlength="50" placeholder="Введите ваше имя">
                <small class="form-hint">Минимум 2 символа</small>
            </div>
            <div class="form-group">
                <label for="reviewText">Ваш отзыв *</label>
                <textarea id="reviewText" required minlength="5" maxlength="500" placeholder="Напишите ваш отзыв"></textarea>
                <small class="form-hint">Минимум 5 символов</small>
            </div>
            <div class="form-group">
                <label for="reviewImage">URL изображения (необязательно)</label>
                <input type="url" id="reviewImage" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
                <label for="imageUpload">Или загрузите файл (необязательно)</label>
                <input type="file" id="imageUpload" accept="image/*">
                <div id="imagePreview" class="image-preview"></div>
            </div>
            <button type="submit" id="submitReview">Добавить отзыв</button>
        </form>
    `;

    testimonialsSection.appendChild(formContainer);

    document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmit);
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер - 2MB');
            event.target.value = '';
            preview.innerHTML = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение');
            event.target.value = '';
            preview.innerHTML = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImageData = e.target.result;
            preview.innerHTML = `<img src="${uploadedImageData}" alt="Preview" class="preview-image">`;
        };
        reader.readAsDataURL(file);
    } else {
        uploadedImageData = null;
        preview.innerHTML = '';
    }
}

function validateForm(name, text) {
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Имя должно содержать минимум 2 символа');
    }
    if (!text || text.trim().length < 5) {
        errors.push('Текст отзыва должен содержать минимум 5 символов');
    }
    if (name && name.length > 50) {
        errors.push('Имя не может быть длиннее 50 символов');
    }
    if (text && text.length > 500) {
        errors.push('Текст отзыва не может быть длиннее 500 символов');
    }

    if (errors.length > 0) {
        alert('Ошибки валидации:\n' + errors.join('\n'));
        return false;
    }
    return true;
}


function handleReviewSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('reviewName').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const imageUrl = document.getElementById('reviewImage').value.trim();

    if (!validateForm(name, text)) {
        return;
    }

    let imageToUse = 'default-avatar.jpg';
    if (uploadedImageData) {
        imageToUse = uploadedImageData;
    } else if (imageUrl) {
        imageToUse = imageUrl;
    }

    const newReview = {
        id: Date.now(),
        name: name,
        text: text,
        image: imageToUse,
        date: new Date().toLocaleDateString()
    };

    reviews.push(newReview);
    saveReviewsToCookie();
    displayReviews();
    
    event.target.reset();
    uploadedImageData = null;
    document.getElementById('imagePreview').innerHTML = '';
    
    showNotification('Отзыв успешно добавлен!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        z-index: 10002;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function displayReviews() {
    const reviewsContainer = document.querySelector('.reviews-flex');
    if (!reviewsContainer) return;

    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="no-reviews">Пока нет отзывов. Будьте первым!</p>';
        return;
    }

    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review" data-id="${review.id}">
            <img src="${review.image}" alt="аватар" onerror="this.src='default-avatar.jpg'">
            <p>«${escapeHtml(review.text)}»</p>
            <strong>— ${escapeHtml(review.name)}, ${review.date}</strong>
        </div>
    `).join('');
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function saveReviewsToCookie() {
    if (window.cookieManager) {
        window.cookieManager.set('reviews', reviews, 7);
    } else {
        console.error('cookieManager не найден');
    }
}

function loadReviewsFromCookie() {
    if (window.cookieManager) {
        const savedReviews = window.cookieManager.get('reviews');
        if (savedReviews && Array.isArray(savedReviews) && savedReviews.length > 0) {
            reviews = savedReviews;
        } else {
            reviews = [...defaultReviews];
            saveReviewsToCookie();
        }
    } else {
        console.warn('cookieManager не найден, используем отзывы по умолчанию');
        reviews = [...defaultReviews];
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            top: -100px;
            opacity: 0;
        }
        to {
            top: 20px;
            opacity: 1;
        }
    }

    .notification {
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        font-weight: bold;
    }

    .form-hint {
        display: block;
        color: #666;
        font-size: 0.8rem;
        margin-top: 4px;
    }

    body.dark-theme .form-hint {
        color: #999;
    }

    .image-preview {
        margin-top: 10px;
        max-width: 100px;
    }

    .preview-image {
        width: 100%;
        height: auto;
        border-radius: 5px;
        border: 2px solid #ff00ff;
    }

    .no-reviews {
        text-align: center;
        padding: 40px;
        font-style: italic;
        color: #666;
    }
`;

document.head.appendChild(style);