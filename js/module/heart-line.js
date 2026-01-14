// heart.js - Тонкая линия, сердце в центре окна

export function initHeartAnimation() {
    const section = document.getElementById('timeline');
    if (!section) return;
    
    // Создаем элементы
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    const container = document.createElement('div');
    container.className = 'heart-container';
    container.appendChild(heart);
    
    const line = document.createElement('div');
    line.className = 'heart-line';
    
    section.appendChild(container);
    section.appendChild(line);
    
    // Настройки
    const LINE_COLOR = '#2d5a4a';
    const LINE_WIDTH = 2; // Тонкая линия
    
    // Точки кривой Безье
    const curve = [
        [0, 0],     // Начало
        [-25, 25],  // Контрольная 1
        [25, 50],   // Контрольная 2
        [0, 100]    // Конец
    ];
    
    // Переменные
    let sectionTop = 0;
    let sectionHeight = 0;
    let windowHeight = 0;
    let points = [];
    
    // Canvas
    let canvas, ctx;
    
    // Инициализация canvas
    function initCanvas() {
        canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 99;
        `;
        line.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resizeCanvas();
    }
    
    // Изменение размера canvas
    function resizeCanvas() {
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = section.offsetWidth * dpr;
        canvas.height = sectionHeight * dpr;
        canvas.style.width = `${section.offsetWidth}px`;
        canvas.style.height = `${sectionHeight}px`;
        if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }
    
    // Расчет позиции на кривой
    function getCurvePoint(t) {
        const u = 1 - t;
        const p0 = curve[0], p1 = curve[1], p2 = curve[2], p3 = curve[3];
        
        const x = u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0];
        const y = u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1];
        
        return { x, y };
    }
    
    // Рисование линии
    function drawLine() {
        if (!ctx || points.length < 2) return;
        
        ctx.lineWidth = LINE_WIDTH;
        ctx.strokeStyle = LINE_COLOR;
        
        const centerX = section.offsetWidth / 2;
        
        // Рисуем линию через все точки
        ctx.beginPath();
        ctx.moveTo(centerX + points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(centerX + points[i].x, points[i].y);
        }
        
        ctx.stroke();
    }
    
    // Основное обновление
    function update() {
        // Размеры
        const rect = section.getBoundingClientRect();
        sectionTop = rect.top + window.scrollY;
        sectionHeight = rect.height;
        windowHeight = window.innerHeight;
        
        // Позиция скролла
        const scrollY = window.scrollY;
        
        // Когда начинается анимация (когда секция появляется в центре окна)
        const centerTrigger = sectionTop - windowHeight * 0.5;
        // Когда заканчивается анимация (когда секция уходит из центра)
        const centerEnd = sectionTop + sectionHeight - windowHeight * 0.5;
        
        let progress = 0;
        let isActive = false;
        
        // Проверяем, находимся ли мы в зоне анимации
        if (scrollY > centerTrigger && scrollY < centerEnd) {
            isActive = true;
            
            // Прогресс от 0 до 1 внутри зоны анимации
            const totalRange = centerEnd - centerTrigger;
            const currentInRange = scrollY - centerTrigger;
            
            // СКОРОСТЬ: сердце проходит всю траекторию пока секция проходит через центр окна
            // Это обеспечивает постоянное нахождение сердца в центре окна
            progress = currentInRange / totalRange;
            progress = Math.min(Math.max(progress, 0), 1);
        }
        
        // Инициализируем canvas при первом движении
        if (isActive && !canvas) {
            initCanvas();
        }
        
        if (isActive) {
            // Получаем позицию на кривой
            const point = getCurvePoint(progress);
            const width = section.offsetWidth;
            const height = sectionHeight;
            
            // Преобразуем в пиксели
            const x = (point.x / 100) * width;
            const y = (point.y / 100) * height;
            
            // Добавляем точку (только если прогресс увеличился)
            const lastPoint = points[points.length - 1];
            if (!lastPoint || progress > lastPoint.progress) {
                points.push({ x, y, progress });
                
                // Ограничиваем массив точек
                if (points.length > 200) {
                    points = points.slice(-150);
                }
                
                // Рисуем линию
                drawLine();
            }
            
            // Обновляем позицию сердца
            container.style.top = `${y}px`;
            container.style.left = `calc(50% + ${x}px)`;
            container.style.opacity = '1';
            
            // Поворачиваем сердце по направлению движения
            if (progress < 0.99) {
                const nextPoint = getCurvePoint(progress + 0.01);
                const angle = Math.atan2(
                    (nextPoint.y - point.y) * height,
                    (nextPoint.x - point.x) * width
                ) * (180 / Math.PI);
                heart.style.transform = `rotate(${45 + angle * 0.2}deg)`;
            } else {
                heart.style.transform = 'rotate(45deg)';
            }
            
        } else {
            // До или после анимации
            container.style.opacity = '0.3'; // Полупрозрачное
            
            // Устанавливаем начальную или конечную позицию
            const targetProgress = scrollY < centerTrigger ? 0 : 1;
            const point = getCurvePoint(targetProgress);
            const width = section.offsetWidth;
            const y = (point.y / 100) * sectionHeight;
            const x = (point.x / 100) * width;
            
            container.style.top = `${y}px`;
            container.style.left = `calc(50% + ${x}px)`;
            heart.style.transform = 'rotate(45deg)';
            
            // Сбрасываем точки если вышли за начало
            if (scrollY <= centerTrigger) {
                points = [];
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        }
    }
    
    // Обработчики событий
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    function onResize() {
        resizeCanvas();
        if (points.length > 0 && ctx) {
            // Пересчитываем точки при изменении размера
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const newPoints = points.map(p => {
                const point = getCurvePoint(p.progress);
                const width = section.offsetWidth;
                const height = sectionHeight;
                const x = (point.x / 100) * width;
                const y = (point.y / 100) * height;
                return { x, y, progress: p.progress };
            });
            
            points = newPoints;
            drawLine();
        }
        update();
    }
    
    // Инициализация
    function init() {
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        
        // Первоначальное обновление
        requestAnimationFrame(update);
    }
    
    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}