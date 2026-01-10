// Импорт модуля дресс-кода


import { initDressCodeSliders } from './module/dress-code.js';
console.log('Dress-code модуль найден');
// import { initTimeline } from './module/timeline_2.js';
import { initTimeline } from './timeline.js';
import { initHeartAnimation } from './module/heart-line.js';


console.log('Timeline модуль найден');
import { initLocation } from './module/map.js';
import { initGifts } from './module/gifts-section.js';
// import { initWeddingHero } from './module/wedding-hero.js';
import { initHero } from './module/hero.js';



document.addEventListener('DOMContentLoaded', () => {
    console.log('Свадебный сайт загружается...');
    
    // Инициализация модулей (добавьте initTimeline)
    // initTimeline(); // Добавьте эту строку
    // initHeartLine();

    const cleanupHeartLine = initHeartAnimation();
    const cleanupTimeline = initTimeline();

    initDressCodeSliders ();
    initLocation();
    initGifts();
    // initWeddingHero();
    initHero();
        // Функция для очистки всего
    window.addEventListener('beforeunload', function() {
        cleanupTimeline?.();
        cleanupHeartLine?.();
    });
    // // Общие инициализации
    // initSmoothScroll();
    // initAnimations();
});