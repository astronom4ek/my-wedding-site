// timeline.js - упрощенный для центрирования

function adjustBlockPositions() {
    const events = document.querySelectorAll('.timeline-event');
    const container = document.querySelector('.timeline-container');
    
    if (!container || events.length === 0) return;
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // На мобилке - абсолютное центрирование
        events.forEach(event => {
            event.style.position = 'relative';
            event.style.left = 'auto';
            event.style.right = 'auto';
            event.style.top = 'auto';
            event.style.transform = 'none';
            event.style.margin = '0 auto'; // Это гарантирует центрирование
            event.style.textAlign = 'center';
        });
        
        // Обновляем размер контейнера
        container.style.minHeight = 'auto';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.gap = '25px';
    } else {
        // На десктопе - шахматный порядок
        const positions = [12, 28, 44, 60]; // Большие интервалы
        
        events.forEach((event, index) => {
            if (positions[index] !== undefined) {
                event.style.position = 'absolute';
                event.style.top = `${positions[index]}%`;
                
                if (index % 2 === 0) {
                    event.style.left = '0';
                    event.style.right = 'auto';
                    event.style.textAlign = 'right';
                } else {
                    event.style.left = 'auto';
                    event.style.right = '0';
                    event.style.textAlign = 'left';
                }
            }
        });
        
        // Для плавного смещения на узких экранах
        if (window.innerWidth < 1200) {
            const offset = Math.max(0, (1200 - window.innerWidth) * 0.02); // 2% смещения
            events.forEach((event, index) => {
                if (index % 2 === 0) {
                    event.style.left = `${offset}px`;
                } else {
                    event.style.right = `${offset}px`;
                }
            });
        }
    }
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        adjustBlockPositions();
    }, 100);
    
    // Инициализация календаря если нужна
    initSimpleCalendar();
});

// Ресайз
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustBlockPositions, 150);
});

// Простая инициализация календаря
function initSimpleCalendar() {
    const dates = document.querySelectorAll('.calendar-day');
    if (!dates.length) return;
    
    dates.forEach(date => {
        date.addEventListener('mouseenter', function() {
            if (this.classList.contains('wedding-day')) {
                const number = this.querySelector('.wedding-day-number');
                if (number) number.style.transform = 'scale(1.3)';
            } else {
                const number = this.querySelector('.day-number');
                if (number) number.style.transform = 'scale(1.2)';
            }
        });
        
        date.addEventListener('mouseleave', function() {
            if (this.classList.contains('wedding-day')) {
                const number = this.querySelector('.wedding-day-number');
                if (number) number.style.transform = '';
            } else {
                const number = this.querySelector('.day-number');
                if (number) number.style.transform = '';
            }
        });
    });
}