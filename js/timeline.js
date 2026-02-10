// Обновите ВЕСЬ файл script.js этим кодом:
// Компактный календарь с эффектами

// Глобальные переменные
let hasStartedMoving = false;
let isTransitioning = false; // Флаг для плавного перехода

// Константа для смещения сердца относительно цифры (в пикселях)
const HEART_OFFSET_FROM_DATE = 100; // Сердце будет на 100px ниже цифры 16

function initTimelineCalendar() {
    const calendar = document.getElementById('timelineCalendar');
    const weddingDay = document.querySelector('.wedding-day');
    const timelineHeart = document.getElementById('timelineHeart');
    const weddingNumber = document.querySelector('.wedding-day-number');
    
    if (!calendar || !weddingDay || !timelineHeart) return;

    // Скрываем сердце изначально
    timelineHeart.style.opacity = '0';
    timelineHeart.style.transition = 'opacity 0.8s ease';
    
    // 1. Позиционируем сердце ПОД датой 16 (со смещением)
    function positionHeartUnderDate16() {
        const weddingRect = weddingDay.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Вычисляем абсолютную позицию даты 16
        const date16CenterX = weddingRect.left + weddingRect.width / 2 + scrollLeft;
        const date16CenterY = weddingRect.top + weddingRect.height / 2 + scrollTop;
        
        // Добавляем смещение: сердце будет НИЖЕ цифры
        const heartX = date16CenterX;
        const heartY = date16CenterY + HEART_OFFSET_FROM_DATE;
        
        // Позиционируем сердце ПОД датой 16 (со смещением)
        timelineHeart.style.position = 'fixed';
        timelineHeart.style.left = `${heartX}px`;
        timelineHeart.style.top = `${heartY}px`;
        timelineHeart.style.transform = 'translate(-50%, -50%)';
        timelineHeart.style.zIndex = '11'; // НИЖЕ календаря
        timelineHeart.style.opacity = '1';
        timelineHeart.style.transition = 'all 0.5s ease';
        
        // Число 16 должно быть ВИДИМО над сердцем
        if (weddingNumber) {
            weddingNumber.style.opacity = '1';
            weddingNumber.style.zIndex = '12'; // ВЫШЕ сердца
        }
        
        console.log('Сердце позиционировано под датой 16');
    }
    
    // 2. Плавный переход от позиции под датой к началу линии
    function startHeartTransition() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        console.log('Начинаем плавный переход к линии');
        
        // Получаем контейнер таймлайна
        const timelineContainer = document.querySelector('.timeline-container');
        if (!timelineContainer) {
            isTransitioning = false;
            return;
        }
        
        const containerRect = timelineContainer.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Координаты начала линии (примерно 50% по X, 5% по Y относительно контейнера)
        const lineStartX = containerRect.left + (containerRect.width * 0.5);
        const lineStartY = containerRect.top + scrollTop + (containerRect.height * 0.05);
        
        // Конвертируем в проценты относительно контейнера
        const percentX = ((lineStartX - containerRect.left) / containerRect.width) * 100;
        const percentY = ((lineStartY - containerRect.top - scrollTop) / containerRect.height) * 100;
        
        // Плавный переход к началу линии
        timelineHeart.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        timelineHeart.style.position = 'absolute';
        timelineHeart.style.left = `${percentX}%`;
        timelineHeart.style.top = `${percentY}%`;
        timelineHeart.style.transform = 'translate(-50%, -50%)';
        timelineHeart.style.zIndex = '100';
        
        // После завершения перехода
        setTimeout(() => {
            isTransitioning = false;
            console.log('Переход завершен');
        }, 1000);
    }
    
    // 3. При скролле сердце начинает двигаться
    function handleScrollForCalendar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const calendarRect = calendar.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Когда календарь уходит на 1/4 экрана вверх
        if (!hasStartedMoving && calendarRect.top < windowHeight * 0.75) {
            hasStartedMoving = true;
            
            // Начинаем плавный переход к линии
            startHeartTransition();
            
            console.log('Сердце начинает движение');
        }
        
        // Если вернулись обратно выше календаря
        if (hasStartedMoving && calendarRect.top > windowHeight * 0.8) {
            hasStartedMoving = false;
            isTransitioning = false;
            
            // Возвращаем сердце под дату 16
            positionHeartUnderDate16();
            
            console.log('Сердце возвращено под дату 16');
        }
    }
    
    // 4. Эффекты при наведении (без изменений)
    const allDates = document.querySelectorAll('.calendar-day');
    allDates.forEach(date => {
        // Наведение на обычные даты
        if (!date.classList.contains('wedding-day')) {
            date.addEventListener('mouseenter', function() {
                const number = this.querySelector('.day-number');
                if (number) {
                    number.style.color = '#26660d';
                    number.style.opacity = '1';
                    number.style.transform = 'scale(1.1)';
                }
            });
            
            date.addEventListener('mouseleave', function() {
                const number = this.querySelector('.day-number');
                if (number) {
                    number.style.color = '';
                    number.style.opacity = '0.9';
                    number.style.transform = '';
                }
            });
        }
        
        // Клик по любой дате
        date.addEventListener('click', function() {
            if (this.classList.contains('wedding-day')) {
                // Эффект пульсации для даты 16
                if (weddingNumber) {
                    weddingNumber.style.animation = 'pulse-date 0.6s ease';
                    setTimeout(() => {
                        weddingNumber.style.animation = '';
                    }, 600);
                }
            }
        });
    });
    
    // 5. Инициализация
    positionHeartUnderDate16();
    
    // 6. Слушаем скролл
    window.addEventListener('scroll', handleScrollForCalendar);
    
    // 7. При ресайзе перепозиционируем
    window.addEventListener('resize', function() {
        if (!hasStartedMoving) {
            positionHeartUnderDate16();
        }
    });
}

// Анимация таймлайна с сердцем
function initTimelineAnimation() {
    const timelineSection = document.getElementById('timeline');
    const timelineHeart = document.getElementById('timelineHeart');
    const timelinePath = document.getElementById('timelinePath');
    const heartWrapper = document.getElementById('heartWrapper');
    const events = document.querySelectorAll('.timeline-event');
    
    if (!timelineSection || !timelineHeart || !timelinePath || !heartWrapper) {
        console.error('Не найдены элементы таймлайна');
        return;
    }
    
    // Получаем путь SVG
    const path = timelinePath;
    const pathLength = path.getTotalLength();
    
    // Инициализация линии
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    
    // Переменные для размеров
    let svgRect, containerRect, sectionRect;
    const viewBox = { width: 400, height: 1800 };
    
    // Функция для получения текущих размеров
    function updateDimensions() {
        const svg = document.querySelector('.timeline-path-svg');
        const container = document.querySelector('.timeline-container');
        
        if (!svg || !container) return;
        
        svgRect = svg.getBoundingClientRect();
        containerRect = container.getBoundingClientRect();
        sectionRect = timelineSection.getBoundingClientRect();
    }
    
    // Функция для получения точки на пути
    function getPointOnPath(progress) {
        const distance = pathLength * Math.max(0, Math.min(1, progress));
        return path.getPointAtLength(distance);
    }
    
    // Функция для получения угла в точке
    function getAngleAtPoint(progress) {
        const distance = pathLength * Math.max(0, Math.min(1, progress));
        const eps = 2;
        
        let pointBefore, pointAfter;
        
        if (distance > eps) {
            pointBefore = path.getPointAtLength(Math.max(0, distance - eps));
        } else {
            pointBefore = path.getPointAtLength(0);
        }
        
        if (distance < pathLength - eps) {
            pointAfter = path.getPointAtLength(Math.min(pathLength, distance + eps));
        } else {
            pointAfter = path.getPointAtLength(pathLength);
        }
        
        const deltaX = pointAfter.x - pointBefore.x;
        const deltaY = pointAfter.y - pointBefore.y;
        
        return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    }
    
    // Функция для конвертации SVG координат в проценты
    function svgPointToPercent(svgPoint) {
        if (!svgRect || !containerRect) return { x: 50, y: 0 };
        
        const scaleX = svgRect.width / viewBox.width;
        const scaleY = svgRect.height / viewBox.height;
        
        const pixelX = svgPoint.x * scaleX;
        const pixelY = svgPoint.y * scaleY;
        
        const percentX = (pixelX / containerRect.width) * 100;
        const percentY = (pixelY / containerRect.height) * 100;
        
        return { x: percentX, y: percentY };
    }
    
    // ОСНОВНАЯ ФУНКЦИЯ АНИМАЦИИ
    function updateTimeline() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        updateDimensions();
        
        if (!sectionRect || !containerRect) {
            requestAnimationFrame(updateTimeline);
            return;
        }
        
        // Если сердце еще не начало движение или в процессе перехода
        if (!hasStartedMoving || isTransitioning) {
            // Не двигаем сердце по линии
            requestAnimationFrame(updateTimeline);
            return;
        }
        
        // Верхняя граница секции
        const sectionTop = sectionRect.top + scrollTop;
        // Нижняя граница секции
        const sectionBottom = sectionTop + sectionRect.height;
        // Высота окна просмотра
        const windowHeight = window.innerHeight;
        
        let progress = 0;
        
        // Настройки чувствительности
        const startOffset = 0.3; // 30% окна до начала секции
        const endOffset = 0.7;   // 70% окна до конца секции
        
        if (scrollTop < sectionTop - windowHeight * startOffset) {
            // Мы ВЫШЕ секции
            progress = 0;
        } 
        else if (scrollTop > sectionBottom - windowHeight * endOffset) {
            // Мы НИЖЕ секции
            progress = 1;
        } 
        else {
            // Мы ВНУТРИ секции
            const visibleSectionStart = sectionTop - windowHeight * startOffset;
            const visibleSectionEnd = sectionBottom - windowHeight * endOffset;
            const scrollRange = visibleSectionEnd - visibleSectionStart;
            
            if (scrollRange > 0) {
                progress = (scrollTop - visibleSectionStart) / scrollRange;
                progress = Math.max(0, Math.min(1, progress));
            }
        }
        
        // Получаем точку на линии
        const svgPoint = getPointOnPath(progress);
        const angle = getAngleAtPoint(progress);
        const percentPos = svgPointToPercent(svgPoint);
        
        // Позиционируем сердце ВНУТРИ таймлайна
        timelineHeart.style.position = 'absolute';
        timelineHeart.style.left = `${percentPos.x}%`;
        timelineHeart.style.top = `${percentPos.y}%`;
        timelineHeart.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        timelineHeart.style.zIndex = '100';
        timelineHeart.style.transition = 'left 0.1s linear, top 0.1s linear, transform 0.1s linear';
        
        // Обновляем линию
        path.style.strokeDashoffset = pathLength - (pathLength * progress);
        
        // Обновляем подсветку событий
        updateEventsHighlight(percentPos, progress);
        
        requestAnimationFrame(updateTimeline);
    }
    
    // Функция для подсветки событий
    function updateEventsHighlight(heartPercentPos, progress) {
        if (!containerRect) return;
        
        const heartX = containerRect.width * (heartPercentPos.x / 100);
        const heartY = containerRect.height * (heartPercentPos.y / 100);
        
        // Прогресс для каждого блока
        const blockProgresses = [0.15, 0.3, 0.45, 0.6];
        
        events.forEach((event, index) => {
            const eventRect = event.getBoundingClientRect();
            
            const eventCenterX = eventRect.left - containerRect.left + eventRect.width / 2;
            const eventCenterY = eventRect.top - containerRect.top + eventRect.height / 2;
            
            // Расстояние до сердца
            const distance = Math.sqrt(
                Math.pow(eventCenterX - heartX, 2) +
                Math.pow(eventCenterY - heartY, 2)
            );
            
            // Расстояние по прогрессу скролла
            const progressDistance = Math.abs(progress - blockProgresses[index]);
            
            // Активируем если близко
            if ((distance < 100 || progressDistance < 0.08)) {
                if (!event.classList.contains('active')) {
                    event.classList.add('active');
                }
            } else {
                if (event.classList.contains('active')) {
                    event.classList.remove('active');
                }
            }
        });
    }
    
    // Инициализация
    function init() {
        updateDimensions();
        path.style.strokeDashoffset = pathLength;
        requestAnimationFrame(updateTimeline);
    }
    
    // Запускаем инициализацию
    init();
    
    // Обработка ресайза
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(init, 150);
    });
}

// Динамическая подстройка позиций блоков
function adjustBlockPositions() {
    const events = document.querySelectorAll('.timeline-event');
    const container = document.querySelector('.timeline-container');
    
    if (!container || events.length === 0) return;
    
    const positions = [
        { top: '15%', left: '5%', right: 'auto' },
        { top: '30%', left: 'auto', right: '5%' },
        { top: '45%', left: '5%', right: 'auto' },
        { top: '60%', left: 'auto', right: '5%' }
    ];
    
    events.forEach((event, index) => {
        if (positions[index]) {
            event.style.top = positions[index].top;
            event.style.left = positions[index].left;
            event.style.right = positions[index].right;
        }
    });
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // Сначала календарь
        initTimelineCalendar();
        
        // Потом таймлайн
        setTimeout(() => {
            initTimelineAnimation();
            adjustBlockPositions();
        }, 100);
        
        // Эффект появления календаря
        const calendar = document.getElementById('timelineCalendar');
        if (calendar) {
            calendar.style.opacity = '0';
            setTimeout(() => {
                calendar.style.transition = 'opacity 0.6s ease';
                calendar.style.opacity = '1';
            }, 200);
        }
    }, 300);
});

// Также настраиваем при ресайзе
window.addEventListener('resize', adjustBlockPositions);