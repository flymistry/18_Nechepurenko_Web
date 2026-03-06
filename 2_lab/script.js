const movingAd = document.getElementById('movingAd');
const closeBtn = document.getElementById('closeBtn');

function getRandomPosition() {
    const container = document.querySelector('.main');
    
    const containerRect = container.getBoundingClientRect();
    const adRect = movingAd.getBoundingClientRect();
    
    const maxLeft = containerRect.width - adRect.width - 20;
    const maxTop = containerRect.height - adRect.height - 20;
    
    const randomLeft = Math.max(10, Math.min(maxLeft, Math.random() * maxLeft));
    const randomTop = Math.max(10, Math.min(maxTop, Math.random() * maxTop));
    
    return { left: randomLeft, top: randomTop };
}

function moveAd() {
    movingAd.classList.add('teleport');
    
    const { left, top } = getRandomPosition();
    
    movingAd.style.transform = 'scale(1.1)';
    movingAd.style.position = 'absolute';
    movingAd.style.left = left + 'px';
    movingAd.style.top = top + 'px';
    movingAd.style.margin = '0';
    movingAd.style.zIndex = '9999';
    
    setTimeout(() => {
        movingAd.classList.remove('teleport');
        movingAd.style.transform = 'scale(1)';
    }, 500);
    
    console.log('Реклама убежала на:', left, top);
}

movingAd.addEventListener('mouseenter', moveAd);
closeBtn.addEventListener('mouseenter', moveAd);

window.addEventListener('resize', () => {
    movingAd.style.position = 'relative';
    movingAd.style.left = '0';
    movingAd.style.top = '0';
    movingAd.style.margin = '20px 0';
    movingAd.style.transform = 'scale(1)';
});