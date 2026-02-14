// ticker.js - улучшенная версия

export function initTicker() {
    const tickerTrack = document.querySelector('.ticker-track');
    
    if (!tickerTrack) {
        return;
    }
    
    console.log('Бегущая строка: инициализация');
    
    // Пауза при наведении
    tickerTrack.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    tickerTrack.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
    
    // Динамическая скорость как в простой версии
    function adjustTickerSpeed() {
        const screenWidth = window.innerWidth;
        let speed;
        
        if (screenWidth < 480) {
            speed = 12; // Быстро на мобилках
        } else if (screenWidth < 768) {
            speed = 15;
        } else if (screenWidth < 1200) {
            speed = 18;
        } else if (screenWidth < 1600) {
            speed = 20; // Стандартная скорость
        } else {
            speed = 25; // Медленнее на очень широких
        }
        
        tickerTrack.style.animationDuration = `${speed}s`;
        console.log(`Бегущая строка: скорость ${speed}s`);
    }
    
    // Оптимизированный ресайз
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            adjustTickerSpeed();
        }, 100);
    });
    
    // Инициализация
    adjustTickerSpeed();
}

export default initTicker;