// Импорт модуля дресс-кода


import { initDressCodeSliders } from './module/dress-code.js';
console.log('Dress-code модуль найден');
import { initTimeline } from './module/timeline_2.js';
console.log('Timeline модуль найден');
import { initLocation } from './module/map.js';
import { initGifts } from './module/gifts-section.js';



document.addEventListener('DOMContentLoaded', () => {
    console.log('Свадебный сайт загружается...');
    
    // Инициализация модулей (добавьте initTimeline)
    initTimeline(); // Добавьте эту строку

    initDressCodeSliders ();
    initLocation();
    
    // // Общие инициализации
    // initSmoothScroll();
    // initAnimations();
});