// Анимация сердечка в секции расписания
document.addEventListener('DOMContentLoaded', function() {
    initHeartAnimation();
});

function initHeartAnimation() {
    // Находим нужные элементы
    const section = document.getElementById('timeline');
    const canvas = document.getElementById('heartCanvas');
    
    if (!section || !canvas) return; // Если элементов нет - выходим
    
    const ctx = canvas.getContext('2d');
    
    // Параметры анимации (их можно менять для настройки эффекта)
    const config = {
        heartSize: 40,           // Размер сердечка (в пикселях)
        waveAmplitude: 0.35,       // Амплитуда волны (насколько сильно извивается)
        waveFrequency: 4.,      // Частота волны (сколько изгибов)
        lineColor: 'rgba(255, 100, 150, 0.8)', // Цвет линии (полупрозрачный розовый)
        heartColor: '#ff4d6d',    // Цвет сердечка
        startOffset: 80,         // Отступ сверху (чтобы сердце начинало путь ниже верха секции)
        endOffset: 120,           // Отступ снизу (чтобы сердце заканчивало путь выше низа секции, где бокал)
        fadeSpeed: 0.1,          // Скорость затухания хвоста (чем меньше, тем длиннее след)
    };

    
    // Функция для обновления размера canvas
    function resizeCanvas() {
        const rect = section.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Важно: после изменения размера перерисовываем
        drawHeart(getCurrentProgress());
    }
    
    // // Получаем прогресс скролла в пределах секции (от 0 до 1)
    // function getCurrentProgress() {
    //     const rect = section.getBoundingClientRect();
    //     const sectionTop = rect.top;
    //     const sectionHeight = rect.height;
    //     const windowHeight = window.innerHeight;
        
    //     // Сколько пикселей секции уже проскроллили
    //     // Секция начинает появляться, когда её верх доходит до низа экрана
    //     // Заканчивается, когда её низ доходит до верха экрана
    //     const scrolled = windowHeight - sectionTop;
        
    //     // Прогресс от 0 до 1
    //     let progress = scrolled / (sectionHeight + windowHeight);
        
    //     // Ограничиваем от 0 до 1
    //     progress = Math.max(0, Math.min(1, progress));
        
    //     return progress;
    // }
    
//     // 2. ОБНОВЛЯЕМ getCurrentProgress
// function getCurrentProgress() {
//     const rect = section.getBoundingClientRect();
//     const sectionTop = rect.top;
//     const windowHeight = window.innerHeight;
    
//     // Прогресс = 0, когда верх секции на середине экрана
//     // Прогресс = 1, когда низ секции на середине экрана
//     const startPoint = sectionTop - windowHeight / 2;
//     const endPoint = sectionTop + rect.height - windowHeight / 2;
    
//     let progress = -startPoint / (endPoint - startPoint);
//     progress = Math.max(0, Math.min(1, progress));
    
//     return progress;
// }

function getCurrentProgress() {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionBottom = rect.bottom;
    const windowHeight = window.innerHeight;
    const middleScreen = windowHeight / 2;
    
    // Случай 1: Секция ещё не дошла до середины (её верх ниже середины экрана)
    // Сердце должно быть вверху (progress = 0)
    if (sectionTop > middleScreen) {
        return 0;
    }
    
    // Случай 2: Секция уже прошла середину (её низ выше середины экрана)
    // Сердце должно быть внизу (progress = 1)
    if (sectionBottom < middleScreen) {
        return 1;
    }
    
    // Случай 3: Секция пересекает середину экрана
    // Вычисляем прогресс от 0 до 1
    
    // Расстояние от верха секции до середины экрана
    const distanceFromTopToMiddle = sectionTop - middleScreen;
    
    // Высота секции
    const sectionHeight = sectionBottom - sectionTop;
    
    // Прогресс: 0 когда верх секции на середине
    // 1 когда низ секции на середине
    let progress = -distanceFromTopToMiddle / sectionHeight;
    
    return Math.max(0, Math.min(1, progress));
}
    // Функция для получения координат точки на волнистой линии по прогрессу
    // function getPointOnWave(progress) {
    //     const rect = section.getBoundingClientRect();
        
    //     // Y координата: линейно от верха до низа с отступами
    //     const startY = config.startOffset;
    //     const endY = canvas.height - config.endOffset;
    //     const y = startY + progress * (endY - startY);
        
    //     // X координата: центр секции + синусоида
    //     const centerX = canvas.width / 2;
    //     // Синусоида: амплитуда затухает к концу, чтобы сердце попало в бокал
    //     const waveAttenuation = 1 - progress * 0.7; // К концу амплитуда уменьшается
    //     const x = centerX + 
    //               Math.sin(progress * Math.PI * 2 * config.waveFrequency * canvas.height) * 
    //               config.waveAmplitude * waveAttenuation;
        
    //     return { x, y };
    // }
    // 1. ОБНОВЛЯЕМ getPointOnWave
// function getPointOnWave(progress) {
//     const rect = section.getBoundingClientRect();
    
//     const startY = config.startOffset;
//     const endY = canvas.height - config.endOffset;
//     const y = startY + progress * (endY - startY);
    
//     const centerX = canvas.width / 2;
//     const amplitude = canvas.width * 0.35; // 35% ширины экрана = 70% размах
//     const x = centerX + Math.sin(progress * Math.PI * 8) * amplitude; // 4 колебания
    
//     return { x, y };
// }

function getPointOnWave(progress) {
    const startY = config.startOffset;
    const endY = canvas.height - config.endOffset;
    const y = startY + progress * (endY - startY);
    
    const centerX = canvas.width / 2;
    
    // Амплитуда: 25% от ширины экрана (размах 50%)
    const amplitude = canvas.width * 0.15;
    
    // Коэффициент затухания волны (чтобы в конце была прямая)
    // Последние 20% пути волна затухает до нуля
    let waveFactor = 1;
    if (progress > 0.6) {
        // От 0.8 до 1.0 плавно уменьшаем волну до 0
        waveFactor = Math.max(0, 1 - (progress - 0.6) * 4);
    }
    
    // Волна: 3.5 колебания, чтобы закончить в центре
    // Используем sin от 0 до 7π (3.5 колебания)
    const x = centerX + Math.sin(progress * Math.PI * 7) * amplitude * waveFactor;
    
    return { x, y };
}
    
    // // Рисование сердечка (простой, но симпатичный вариант)
    // function drawHeartAt(ctx, x, y, size, color) {
    //     ctx.save();
    //     ctx.translate(x, y);
    //     ctx.scale(size / 20, size / 20); // Масштабируем относительно базового размера
        
    //     ctx.beginPath();
    //     ctx.fillStyle = color;
        
    //     // Рисуем сердечко кривыми Безье
    //     ctx.moveTo(0, 5);
    //     ctx.bezierCurveTo(-5, -2, -10, -5, 0, -10);
    //     ctx.bezierCurveTo(10, -5, 5, -2, 0, 5);
        
    //     ctx.fill();
    //     ctx.restore();
    // }

    // 3. ОБНОВЛЯЕМ drawHeartAt (выберите один вариант)
// Вариант с эмодзи (проще и красивее):
// function drawHeartAt(ctx, x, y, size, progress) {
//     const pulse = 1 + Math.sin(Date.now() / 200) * 0.1;
//     const rotation = Math.sin(progress * Math.PI * 8) * 0.2;
    
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.rotate(rotation);
//     ctx.scale(pulse, pulse);
//     ctx.font = `${size}px "Segoe UI", "Arial", sans-serif`;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillStyle = '#ff4d6d';
//     ctx.fillText('❤️', 0, 0);
//     ctx.restore();
// }
function drawHeartAt(ctx, x, y, size, progress) {
    // Пульсация (очень лёгкая, 5%)
    const pulse = 1 + Math.sin(Date.now() / 200) * 0.05;
    
    // Наклон - максимально 10 градусов (0.17 рад)
    const rotation = Math.sin(progress * Math.PI * 7) * 0.17;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(pulse, pulse);
    
    // Рисуем классическое сердечко
    ctx.beginPath();
    ctx.fillStyle = config.heartColor;
    
    // Размеры относительно size
    const w = size * 0.9;
    const h = size;
    
    // Левая половина сердца
    ctx.moveTo(0, h/3);
    ctx.bezierCurveTo(-w/2, -h/4, -w/1.2, -h/2, 0, -h/2);
    
    // Правая половина сердца
    ctx.bezierCurveTo(w/1.2, -h/2, w/2, -h/4, 0, h/3);
    
    ctx.fill();
    
    // Добавляем блик для объёма (маленький белый полупрозрачный кружок)
    ctx.beginPath();
    ctx.arc(-w/5, -h/5, size/10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
    
    ctx.restore();
}
    
    // Рисование бокала (упрощенный вариант)
    function drawGlass(ctx) {
        const rect = section.getBoundingClientRect();
        const glassX = canvas.width / 2; // Центрируем
        const glassY = canvas.height - config.endOffset + 30; // Немного выше нижнего края
        
        ctx.save();
        ctx.translate(glassX, glassY);
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // Золотистый
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        
        // Ножка бокала
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-5, -30);
        ctx.lineTo(5, -30);
        ctx.lineTo(10, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Чаша бокала (овал)
        ctx.beginPath();
        ctx.ellipse(0, -45, 18, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Пузырьки (брызги) - их мы будем рисовать только в конце
        ctx.restore();
        
        // Сохраняем позицию бокала для финала
        return { x: glassX, y: glassY };
    }
    
    // Рисование брызг
    function drawSplashes(ctx, glassPos, progress) {
        if (progress < 0.95) return; // Рисуем только когда почти дошли
        
        ctx.save();
        const intensity = (progress - 0.95) * 20; // Чем ближе к концу, тем больше брызг
        
        for (let i = 0; i < 10 * intensity; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 40;
            const x = glassPos.x + Math.cos(angle) * distance;
            const y = glassPos.y - 45 + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 4 + 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8})`;
            ctx.fill();
        }
        ctx.restore();
    }
    
    // Основная функция отрисовки
    function drawHeart(progress) {
        // Очищаем canvas (полностью)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем бокал и получаем его позицию
        const glassPos = drawGlass(ctx);
        
        // Рисуем волнистую линию-след
        if (progress >= 0) {
            ctx.beginPath();
            ctx.strokeStyle = config.lineColor;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Рисуем линию маленькими сегментами для плавности
            const steps = 50; // Количество сегментов линии
            const firstPoint = getPointOnWave(0);
            ctx.moveTo(firstPoint.x, firstPoint.y);
            
            for (let i = 1; i <= steps; i++) {
                const stepProgress = (i / steps) * progress;
                const point = getPointOnWave(stepProgress);
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        }
        
        // Рисуем сердечко в текущей позиции
        if (progress >= 0) {
            const heartPos = getPointOnWave(progress);
            // drawHeartAt(ctx, heartPos.x, heartPos.y, config.heartSize, config.heartColor);
            drawHeartAt(ctx, heartPos.x, heartPos.y, config.heartSize, progress);
        }
        
        // Рисуем брызги, если почти дошли
        if (progress > 0.9) {
            drawSplashes(ctx, glassPos, progress);
        }
    }
    
    // Переменная для плавности анимации
    let rafId = null;
    let lastProgress = -1;
    
    // // Функция, которая вызывается при скролле
    // function onScroll() {
    //     if (rafId) cancelAnimationFrame(rafId);
        
    //     rafId = requestAnimationFrame(() => {
    //         const progress = getCurrentProgress();
            
    //         // Перерисовываем только если прогресс изменился
    //         if (Math.abs(progress - lastProgress) > 0.001) {
    //             drawHeart(progress);
    //             lastProgress = progress;
    //         }
            
    //         rafId = null;
    //     });
    // }

    function onScroll() {
    if (rafId) cancelAnimationFrame(rafId);
    
    rafId = requestAnimationFrame(() => {
        const progress = getCurrentProgress();
        drawHeart(progress); // Всегда рисуем, пульсация работает постоянно
        rafId = null;
        
        // Продолжаем анимацию для пульсации
        requestAnimationFrame(onScroll);
    });
}
    
    // Подписываемся на события
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        resizeCanvas();
        onScroll();
    });
    
    // Инициализация: устанавливаем размер и рисуем начальное состояние
    resizeCanvas();
    drawHeart(getCurrentProgress());
}


let lastProgress = -1;
let lastTime = 0;

function onScroll() {
    if (rafId) cancelAnimationFrame(rafId);
    
    rafId = requestAnimationFrame(() => {
        const progress = getCurrentProgress();
        const now = Date.now();
        
        // Перерисовываем либо при изменении прогресса, либо каждые 50 мс для пульсации
        if (Math.abs(progress - lastProgress) > 0.001 || now - lastTime > 50) {
            drawHeart(progress);
            lastProgress = progress;
            lastTime = now;
        }
        
        rafId = null;
        
        // Запускаем снова для пульсации
        requestAnimationFrame(onScroll);
    });
}

export { initHeartAnimation };