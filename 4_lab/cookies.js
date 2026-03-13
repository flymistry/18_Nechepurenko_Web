function setCookie(name, value, days) {
    try {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        const jsonValue = JSON.stringify(value);
        document.cookie = `${name}=${encodeURIComponent(jsonValue)};${expires};path=/;SameSite=Strict`;
        return true;
    } catch (error) {
        console.error('Ошибка при установке cookie:', error);
        return false;
    }
}

function getCookie(name) {
    try {
        const cookieName = `${name}=`;
        const cookies = document.cookie.split(';');
        
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(cookieName) === 0) {
                const value = cookie.substring(cookieName.length);
                const decodedValue = decodeURIComponent(value);
                return JSON.parse(decodedValue);
            }
        }
        return null;
    } catch (error) {
        console.error('Ошибка при получении cookie:', error);
        return null;
    }
}

function deleteCookie(name) {
    return setCookie(name, '', -1);
}

function getAllCookies() {
    const cookies = {};
    const cookiesArray = document.cookie.split(';');
    
    for (let cookie of cookiesArray) {
        cookie = cookie.trim();
        if (cookie) {
            const [name, value] = cookie.split('=');
            try {
                cookies[name] = JSON.parse(decodeURIComponent(value));
            } catch {
                cookies[name] = decodeURIComponent(value);
            }
        }
    }
    return cookies;
}

window.cookieManager = {
    set: setCookie,
    get: getCookie,
    delete: deleteCookie,
    getAll: getAllCookies
};