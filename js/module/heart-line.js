// heart.js - Движение сердца без исчезновения

export function initHeartAnimation() {
    const timelineSection = document.getElementById('timeline');
    if (!timelineSection) {
        console.error('Не найдена секция #timeline');
        return;
    }
    
    // === НАСТРОЙКИ (меняйте здесь!) ===
    const START_POSITION = 20;      // Откуда начинать (0% = верх секции)
    const END_POSITION = 90;      // Где закончить (100% = низ секции)
    const WINDOW_POSITION = 40;    // Позиция сердца в окне (50% = посередине)
    const SPEED_FACTOR = 1.1;      // Скорость (1.0 = нормальная)
    // ==================================
    
    // Создаем элементы
    const heartContainer = document.createElement('div');
    const heart = document.createElement('div');
    const heartLine = document.createElement('div');
    
    // Настраиваем классы
    heartContainer.className = 'heart-container';
    heart.className = 'heart';
    heartLine.className = 'heart-line';
    
    // Добавляем в секцию
    heartContainer.appendChild(heart);
    timelineSection.appendChild(heartContainer);
    timelineSection.appendChild(heartLine);
    
    // Переменные для расчетов
    let sectionTop = 0;
    let sectionHeight = 0;
    let windowHeight = 0;
    let animationStarted = false;
    let animationCompleted = false;
    
    // Обновляем размеры
    function updateSizes() {
        const rect = timelineSection.getBoundingClientRect();
        sectionTop = rect.top + window.pageYOffset;
        sectionHeight = rect.height;
        windowHeight = window.innerHeight;
    }
    
    // Основная функция обновления
    function updateHeart() {
        const scrollY = window.pageYOffset;
        
        // Вычисляем позицию сердца относительно окна
        const heartWindowPosition = (WINDOW_POSITION / 100) * windowHeight;
        
        // Когда начинать анимацию
        const animationStart = sectionTop - heartWindowPosition;
        // Когда заканчивать анимацию
        const animationEnd = sectionTop + sectionHeight - heartWindowPosition;
        
        // Если мы в зоне анимации или уже прошли ее
        if (scrollY > animationStart) {
            // Отмечаем что анимация началась
            if (!animationStarted) {
                animationStarted = true;
            }
            
            // Всегда показываем сердце после начала
            heartContainer.classList.add('heart-visible');
            heartLine.style.opacity = '1';
            heartContainer.style.opacity = '1';
            
            let progress = 0;
            
            // Если мы еще в процессе анимации
            if (scrollY < animationEnd) {
                // Прогресс скролла
                const totalAnimationRange = animationEnd - animationStart;
                const currentScrollInRange = scrollY - animationStart;
                
                // Прогресс с учетом скорости
                progress = (currentScrollInRange / totalAnimationRange) * SPEED_FACTOR;
                progress = Math.max(0, Math.min(1, progress));
            } else {
                // Анимация завершена
                progress = 1;
                if (!animationCompleted) {
                    animationCompleted = true;
                }
            }
            
            // Вычисляем позиции в пикселях
            const startPx = (START_POSITION / 100) * sectionHeight;
            const endPx = (END_POSITION / 100) * sectionHeight;
            
            // Текущая позиция сердца
            const heartPosition = startPx + progress * (endPx - startPx);
            
            // Обновляем позицию сердца
            heartContainer.style.top = `${heartPosition}px`;
            
            // Обновляем линию
            heartLine.style.top = `${startPx}px`;
            heartLine.style.height = `${heartPosition - startPx}px`;
            
        } else {
            // Если мы еще не дошли до начала анимации
            // Устанавливаем сердце в начальную позицию
            heartContainer.style.top = `${(START_POSITION / 100) * sectionHeight}px`;
            heartLine.style.top = `${(START_POSITION / 100) * sectionHeight}px`;
            heartLine.style.height = '0';
            
            // Сердце видно всегда (не исчезает)
            heartContainer.classList.add('heart-visible');
            heartContainer.style.opacity = '1';
            heartLine.style.opacity = '1';
        }
    }
    
    // Оптимизация скролла
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateHeart();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Инициализация
    function init() {
        updateSizes();
        updateHeart();
        
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            updateSizes();
            updateHeart();
        });
        
        console.log('Heart animation initialized (no fade)');
        console.log('Config:', { START_POSITION, END_POSITION, WINDOW_POSITION, SPEED_FACTOR });
    }
    
    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}