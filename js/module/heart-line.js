// heart.js - Упрощенное движение по кривой Безье

export function initHeartAnimation() {
    const timelineSection = document.getElementById('timeline');
    if (!timelineSection) {
        console.error('Не найдена секция #timeline');
        return;
    }
    
    // === НАСТРОЙКИ ===
    const WINDOW_POSITION = 50;    // Позиция сердца в окне (50% = посередине)
    const SPEED_FACTOR = 1.5;      // Скорость (1.0 = нормальная)
    // =================
    
    // Создаем элементы
    const heartContainer = document.createElement('div');
    const heart = document.createElement('div');
    const heartLine = document.createElement('div');
    
    heartContainer.className = 'heart-container';
    heart.className = 'heart';
    heartLine.className = 'heart-line';
    
    heartContainer.appendChild(heart);
    timelineSection.appendChild(heartContainer);
    timelineSection.appendChild(heartLine);
    
    // Переменные
    let sectionTop = 0;
    let sectionHeight = 0;
    let windowHeight = 0;
    
    // Точки кривой Безье (x: -50..50, y: 0..100)
    const BEZIER_POINTS = [
        [0, 0],     // Начало: сверху по центру
        [-30, 25],  // Контрольная точка 1
        [30, 50],   // Контрольная точка 2
        [0, 100]    // Конец: снизу по центру
    ];
    
    // Кубическая кривая Безье
    function cubicBezier(t, p0, p1, p2, p3) {
        const u = 1 - t;
        const uu = u * u;
        const uuu = uu * u;
        const tt = t * t;
        const ttt = tt * t;
        
        const x = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
        const y = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];
        
        return { x, y };
    }
    
    // Получить точку на траектории
    function getPointOnTrajectory(progress) {
        return cubicBezier(
            progress,
            BEZIER_POINTS[0],
            BEZIER_POINTS[1],
            BEZIER_POINTS[2],
            BEZIER_POINTS[3]
        );
    }
    
    // Обновить размеры
    function updateSizes() {
        const rect = timelineSection.getBoundingClientRect();
        sectionTop = rect.top + window.pageYOffset;
        sectionHeight = rect.height;
        windowHeight = window.innerHeight;
    }
    
    // Рисовать траекторию
    let trailCanvas = null;
    let trailCtx = null;
    
    function initTrailCanvas() {
        trailCanvas = document.createElement('canvas');
        trailCanvas.className = 'heart-trail';
        trailCanvas.style.position = 'absolute';
        trailCanvas.style.top = '0';
        trailCanvas.style.left = '0';
        trailCanvas.style.width = '100%';
        trailCanvas.style.height = '100%';
        trailCanvas.style.zIndex = '99';
        trailCanvas.style.pointerEvents = 'none';
        
        heartLine.innerHTML = '';
        heartLine.appendChild(trailCanvas);
        
        trailCtx = trailCanvas.getContext('2d');
    }
    
    // Рисовать пройденный путь
    let drawnProgress = 0;
    
    function drawTrail(progress) {
        if (!trailCanvas || !trailCtx) initTrailCanvas();
        
        const width = timelineSection.offsetWidth;
        const height = sectionHeight;
        
        // Обновляем размеры canvas если изменились
        if (trailCanvas.width !== width || trailCanvas.height !== height) {
            trailCanvas.width = width;
            trailCanvas.height = height;
        }
        
        const centerX = width / 2;
        
        // Если начали заново - очищаем
        if (progress <= drawnProgress) {
            trailCtx.clearRect(0, 0, width, height);
            drawnProgress = 0;
        }
        
        // Рисуем новую часть кривой
        if (progress > drawnProgress) {
            trailCtx.beginPath();
            trailCtx.lineWidth = 5;
            trailCtx.lineCap = 'round';
            trailCtx.lineJoin = 'round';
            
            // Градиент
            const gradient = trailCtx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(255, 77, 109, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 77, 109, 0.9)');
            trailCtx.strokeStyle = gradient;
            
            // Рисуем кривую от drawnProgress до progress
            const steps = 50;
            const step = (progress - drawnProgress) / steps;
            
            for (let i = 0; i <= steps; i++) {
                const t = drawnProgress + i * step;
                if (t > progress) break;
                
                const point = getPointOnTrajectory(t);
                const x = centerX + (point.x / 100 * width);
                const y = (point.y / 100 * height);
                
                if (i === 0) {
                    trailCtx.moveTo(x, y);
                } else {
                    trailCtx.lineTo(x, y);
                }
            }
            
            trailCtx.stroke();
            
            // Свечение
            trailCtx.shadowColor = '#ff4d6d';
            trailCtx.shadowBlur = 10;
            trailCtx.stroke();
            trailCtx.shadowBlur = 0;
            
            drawnProgress = progress;
        }
    }
    
    // Основное обновление
    function updateHeart() {
        const scrollY = window.pageYOffset;
        
        const heartWindowPosition = (WINDOW_POSITION / 100) * windowHeight;
        const animationStart = sectionTop - heartWindowPosition;
        const animationEnd = sectionTop + sectionHeight - heartWindowPosition;
        
        let progress = 0;
        
        if (scrollY > animationStart) {
            heartContainer.classList.add('heart-visible');
            
            if (scrollY < animationEnd) {
                const totalRange = animationEnd - animationStart;
                const currentInRange = scrollY - animationStart;
                progress = (currentInRange / totalRange) * SPEED_FACTOR;
                progress = Math.max(0, Math.min(1, progress));
            } else {
                progress = 1;
            }
        }
        
        // Получить позицию на кривой
        const point = getPointOnTrajectory(progress);
        
        // Обновить позицию сердца
        const width = timelineSection.offsetWidth;
        const xPos = (point.x / 100) * width;
        const yPos = (point.y / 100) * sectionHeight;
        
        heartContainer.style.top = `${yPos}px`;
        heartContainer.style.left = `calc(50% + ${xPos}px)`;
        
        // Поворачиваем сердце по направлению
        if (progress < 0.99) {
            const nextPoint = getPointOnTrajectory(progress + 0.01);
            const angle = Math.atan2(
                nextPoint.y - point.y,
                nextPoint.x - point.x
            ) * (180 / Math.PI);
            heart.style.transform = `rotate(${45 + angle * 0.5}deg)`;
        }
        
        // Рисовать след
        if (progress > 0) {
            drawTrail(progress);
        } else {
            // Сброс при начале
            drawnProgress = 0;
            if (trailCtx) {
                trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            }
        }
    }
    
    // Обработчик скролла
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
        initTrailCanvas();
        updateHeart();
        
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            updateSizes();
            updateHeart();
        });
    }
    
    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    return {
        updateTrajectory: (points) => {
            if (points.length === 4) {
                BEZIER_POINTS.splice(0, 4, ...points);
                updateHeart();
            }
        }
    };
}