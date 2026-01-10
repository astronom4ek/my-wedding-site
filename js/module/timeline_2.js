// js/modules/timeline.js

// Глобальные переменные для этого модуля
let hasStartedMoving = false;
let isTransitioning = false;
const HEART_OFFSET_FROM_DATE = 0;

// Функции календаря
function initTimelineCalendar() {
    const calendar = document.getElementById('timelineCalendar');
    const weddingDay = document.querySelector('.wedding-day');
    const timelineHeart = document.getElementById('timelineHeart');
    const weddingNumber = document.querySelector('.wedding-day-number');
    
    if (!calendar || !weddingDay || !timelineHeart) return;

    // Скрываем сердце изначально
    timelineHeart.style.opacity = '0';
    timelineHeart.style.transition = 'opacity 0.8s ease';
    
    // Позиционируем сердце ПОД датой 16
    function positionHeartUnderDate16() {
        const weddingRect = weddingDay.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        const date16CenterX = weddingRect.left + weddingRect.width / 2 + scrollLeft;
        const date16CenterY = weddingRect.top + weddingRect.height / 2 + scrollTop;
        
        const heartX = date16CenterX;
        const heartY = date16CenterY + HEART_OFFSET_FROM_DATE;
        
        timelineHeart.style.position = 'fixed';
        timelineHeart.style.left = `${heartX}px`;
        timelineHeart.style.top = `${heartY}px`;
        timelineHeart.style.transform = 'translate(-50%, -50%)';
        timelineHeart.style.zIndex = '11';
        timelineHeart.style.opacity = '1';
        timelineHeart.style.transition = 'all 0.5s ease';
        
        if (weddingNumber) {
            weddingNumber.style.opacity = '1';
            weddingNumber.style.zIndex = '12';
        }
        
        console.log('Сердце позиционировано под датой 16');
    }
    
    // Плавный переход от позиции под датой к началу линии
    function startHeartTransition() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        console.log('Начинаем плавный переход к линии');
        
        const timelineContainer = document.querySelector('.timeline-container');
        if (!timelineContainer) {
            isTransitioning = false;
            return;
        }
        
        const containerRect = timelineContainer.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const lineStartX = containerRect.left + (containerRect.width * 0.5);
        const lineStartY = containerRect.top + scrollTop + (containerRect.height * 0.05);
        
        const percentX = ((lineStartX - containerRect.left) / containerRect.width) * 100;
        const percentY = ((lineStartY - containerRect.top - scrollTop) / containerRect.height) * 100;
        
        timelineHeart.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        timelineHeart.style.position = 'absolute';
        timelineHeart.style.left = `${percentX}%`;
        timelineHeart.style.top = `${percentY}%`;
        timelineHeart.style.transform = 'translate(-50%, -50%)';
        timelineHeart.style.zIndex = '100';
        
        setTimeout(() => {
            isTransitioning = false;
            console.log('Переход завершен');
        }, 1000);
    }
    
    // При скролле сердце начинает двигаться
    function handleScrollForCalendar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const calendarRect = calendar.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (!hasStartedMoving && calendarRect.top < windowHeight * 0.75) {
            hasStartedMoving = true;
            startHeartTransition();
            console.log('Сердце начинает движение');
        }
        
        if (hasStartedMoving && calendarRect.top > windowHeight * 0.8) {
            hasStartedMoving = false;
            isTransitioning = false;
            positionHeartUnderDate16();
            console.log('Сердце возвращено под дату 16');
        }
    }
    
    // Эффекты при наведении
    const allDates = document.querySelectorAll('.calendar-day');
    allDates.forEach(date => {
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
        
        date.addEventListener('click', function() {
            if (this.classList.contains('wedding-day')) {
                if (weddingNumber) {
                    weddingNumber.style.animation = 'pulse-date 0.6s ease';
                    setTimeout(() => {
                        weddingNumber.style.animation = '';
                    }, 600);
                }
            }
        });
    });
    
    // Инициализация
    positionHeartUnderDate16();
    
    // Слушаем скролл
    window.addEventListener('scroll', handleScrollForCalendar);
    
    // При ресайзе перепозиционируем
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
    const events = document.querySelectorAll('.timeline-event');
    
    if (!timelineSection || !timelineHeart || !timelinePath) {
        console.error('Не найдены элементы таймлайна');
        return;
    }
    
    const path = timelinePath;
    const pathLength = path.getTotalLength();
    
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    
    let svgRect, containerRect, sectionRect;
    const viewBox = { width: 400, height: 1600 };
    
    function updateDimensions() {
        const svg = document.querySelector('.timeline-path-svg');
        const container = document.querySelector('.timeline-container');
        
        if (!svg || !container) return;
        
        svgRect = svg.getBoundingClientRect();
        containerRect = container.getBoundingClientRect();
        sectionRect = timelineSection.getBoundingClientRect();
    }
    
    function getPointOnPath(progress) {
        const distance = pathLength * Math.max(0, Math.min(1, progress));
        return path.getPointAtLength(distance);
    }
    
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
    
    function updateTimeline() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        updateDimensions();
        
        if (!sectionRect || !containerRect) {
            requestAnimationFrame(updateTimeline);
            return;
        }
        
        if (!hasStartedMoving || isTransitioning) {
            requestAnimationFrame(updateTimeline);
            return;
        }
        
        const sectionTop = sectionRect.top + scrollTop;
        const sectionBottom = sectionTop + sectionRect.height;
        const windowHeight = window.innerHeight;
        
        let progress = 0;
        
        const startOffset = 0.3;
        const endOffset = 0.7;
        
        if (scrollTop < sectionTop - windowHeight * startOffset) {
            progress = 0;
        } 
        else if (scrollTop > sectionBottom - windowHeight * endOffset) {
            progress = 1;
        } 
        else {
            const visibleSectionStart = sectionTop - windowHeight * startOffset;
            const visibleSectionEnd = sectionBottom - windowHeight * endOffset;
            const scrollRange = visibleSectionEnd - visibleSectionStart;
            
            if (scrollRange > 0) {
                progress = (scrollTop - visibleSectionStart) / scrollRange;
                progress = Math.max(0, Math.min(1, progress));
            }
        }
        
        const svgPoint = getPointOnPath(progress);
        const angle = getAngleAtPoint(progress);
        const percentPos = svgPointToPercent(svgPoint);
        
        timelineHeart.style.position = 'absolute';
        timelineHeart.style.left = `${percentPos.x}%`;
        timelineHeart.style.top = `${percentPos.y}%`;
        timelineHeart.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        timelineHeart.style.zIndex = '100';
        timelineHeart.style.transition = 'left 0.1s linear, top 0.1s linear, transform 0.1s linear';
        
        path.style.strokeDashoffset = pathLength - (pathLength * progress);
        
        updateEventsHighlight(percentPos, progress);
        
        requestAnimationFrame(updateTimeline);
    }
    
    function updateEventsHighlight(heartPercentPos, progress) {
        if (!containerRect) return;
        
        const heartX = containerRect.width * (heartPercentPos.x / 100);
        const heartY = containerRect.height * (heartPercentPos.y / 100);
        
        const blockProgresses = [0.15, 0.3, 0.45, 0.6];
        
        events.forEach((event, index) => {
            const eventRect = event.getBoundingClientRect();
            
            const eventCenterX = eventRect.left - containerRect.left + eventRect.width / 2;
            const eventCenterY = eventRect.top - containerRect.top + eventRect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(eventCenterX - heartX, 2) +
                Math.pow(eventCenterY - heartY, 2)
            );
            
            const progressDistance = Math.abs(progress - blockProgresses[index]);
            
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
    
    function init() {
        updateDimensions();
        path.style.strokeDashoffset = pathLength;
        requestAnimationFrame(updateTimeline);
    }
    
    init();
    
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

// Экспорт основной функции инициализации таймлайна
export function initTimeline() {
    console.log('Инициализация таймлайна...');
    
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
    
    // Настройка при ресайзе
    window.addEventListener('resize', adjustBlockPositions);
}