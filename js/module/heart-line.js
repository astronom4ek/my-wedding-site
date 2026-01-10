// heart.js - Движение сердца по волнистой траектории с правильной линией

export function initHeartAnimation() {
    const timelineSection = document.getElementById('timeline');
    if (!timelineSection) {
        console.error('Не найдена секция #timeline');
        return;
    }
    
    // === НАСТРОЙКИ ===
    const START_POSITION = 0;      // Откуда начинать (0% = верх секции)
    const END_POSITION = 100;      // Где закончить (100% = низ секции)
    const WINDOW_POSITION = 50;    // Позиция сердца в окне (50% = посередине)
    const SPEED_FACTOR = 1.5;      // Скорость (1.0 = нормальная)
    const WAVE_AMPLITUDE = 50;     // Амплитуда волны (пиксели влево/вправо)
    const WAVE_FREQUENCY = 2;      // Частота волны (количество волн)
    // =================
    
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
    
    // Массив точек для линии (относительные координаты)
    let linePoints = [];
    let lastX = 0;
    let lastDirection = 0; // -1 = left, 1 = right
    
    // Обновляем размеры
    function updateSizes() {
        const rect = timelineSection.getBoundingClientRect();
        sectionTop = rect.top + window.pageYOffset;
        sectionHeight = rect.height;
        windowHeight = window.innerHeight;
        linePoints = [];
        lastX = 0;
    }
    
    // Функция для вычисления волны
    function calculateWaveOffset(progress) {
        // Горизонтальное отклонение по синусоиде
        return Math.sin(progress * Math.PI * 2 * WAVE_FREQUENCY) * WAVE_AMPLITUDE;
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
            if (!animationStarted) {
                animationStarted = true;
                linePoints = [];
                lastX = 0;
            }
            
            // Всегда показываем сердце
            heartContainer.classList.add('heart-visible');
            heartLine.style.opacity = '1';
            heartContainer.style.opacity = '1';
            
            let progress = 0;
            
            // Если мы еще в процессе анимации
            if (scrollY < animationEnd) {
                const totalAnimationRange = animationEnd - animationStart;
                const currentScrollInRange = scrollY - animationStart;
                progress = (currentScrollInRange / totalAnimationRange) * SPEED_FACTOR;
                progress = Math.max(0, Math.min(1, progress));
            } else {
                progress = 1;
            }
            
            // Вычисляем вертикальную позицию
            const startPx = (START_POSITION / 100) * sectionHeight;
            const endPx = (END_POSITION / 100) * sectionHeight;
            const verticalPos = startPx + progress * (endPx - startPx);
            
            // Вычисляем горизонтальное отклонение
            const waveOffset = calculateWaveOffset(progress);
            
            // Обновляем позицию сердца
            heartContainer.style.top = `${verticalPos}px`;
            heartContainer.style.left = `calc(50% + ${waveOffset}px)`;
            
            // Определяем направление для анимации сердца
            const currentDirection = Math.sign(waveOffset - lastX);
            if (currentDirection !== 0 && currentDirection !== lastDirection) {
                heartContainer.classList.remove('moving-left', 'moving-right');
                if (currentDirection > 0) {
                    heartContainer.classList.add('moving-right');
                } else if (currentDirection < 0) {
                    heartContainer.classList.add('moving-left');
                }
                lastDirection = currentDirection;
            }
            
            // Добавляем точку для линии (относительные координаты)
            // Координаты относительно центра секции
            linePoints.push({
                x: waveOffset,  // отклонение от центра
                y: verticalPos  // вертикальная позиция
            });
            
            // Ограничиваем количество точек
            if (linePoints.length > 150) {
                linePoints = linePoints.slice(-120);
            }
            
            lastX = waveOffset;
            
            // Рисуем линию-след
            drawTrail();
            
        } else {
            // До начала анимации
            const startPx = (START_POSITION / 100) * sectionHeight;
            heartContainer.style.top = `${startPx}px`;
            heartContainer.style.left = '50%';
            heartContainer.classList.remove('moving-left', 'moving-right');
            
            // Очищаем линию
            heartLine.innerHTML = '';
            linePoints = [];
            lastX = 0;
            
            heartContainer.classList.add('heart-visible');
            heartContainer.style.opacity = '1';
            heartLine.style.opacity = '1';
        }
    }
    
    // Функция для рисования следа
    function drawTrail() {
        if (linePoints.length < 2) return;
        
        // Создаем canvas для линии
        let canvas = heartLine.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            heartLine.innerHTML = '';
            heartLine.appendChild(canvas);
            
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '50%';
            canvas.style.transform = 'translateX(-50%)';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
        }
        
        // Устанавливаем размеры canvas
        const canvasWidth = timelineSection.offsetWidth;
        const canvasHeight = sectionHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Центральная точка (середина секции)
        const centerX = canvasWidth / 2;
        
        // Рисуем линию по точкам
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Градиент для линии (сверху прозрачнее)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradient.addColorStop(0, 'rgba(255, 77, 109, 0.3)');
        gradient.addColorStop(0.2, 'rgba(255, 77, 109, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 77, 109, 0.9)');
        ctx.strokeStyle = gradient;
        
        // Первая точка
        const firstPoint = linePoints[0];
        ctx.moveTo(centerX + firstPoint.x, firstPoint.y);
        
        // Рисуем кривую через остальные точки
        for (let i = 1; i < linePoints.length; i++) {
            const point = linePoints[i];
            
            // Для плавности используем кривую Безье
            if (i < linePoints.length - 1) {
                const nextPoint = linePoints[i + 1];
                const cp1x = centerX + point.x;
                const cp1y = point.y;
                const cp2x = centerX + point.x;
                const cp2y = (point.y + nextPoint.y) / 2;
                const endX = centerX + nextPoint.x;
                const endY = nextPoint.y;
                
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
            } else {
                // Последняя точка - прямая линия
                ctx.lineTo(centerX + point.x, point.y);
            }
        }
        
        ctx.stroke();
        
        // Добавляем точки-следы (опционально)
        for (let i = 0; i < linePoints.length; i += 10) {
            const point = linePoints[i];
            const alpha = i / linePoints.length;
            
            ctx.beginPath();
            ctx.arc(centerX + point.x, point.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 77, 109, ${0.3 + alpha * 0.5})`;
            ctx.fill();
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
        
        console.log('Heart trail animation initialized');
    }
    
    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}