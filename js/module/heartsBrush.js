// heartsBrush.js
import { HeartTrail } from './heartTrail.js';
import { ScrollHandler } from './scrollHandler.js';

export class HeartsBrushController {
    constructor() {
        this.heartTrail = null;
        this.scrollHandler = null;
        this.section = null;
        this.textBlocks = [];
        this.isInitialized = false;
    }

    // Добавляем параметр selector
    init(selector = '.timeline-section') {
        if (this.isInitialized) return;
        
        this.section = document.querySelector(selector);
        if (!this.section) {
            console.warn(`Секция ${selector} не найдена`);
            return;
        }

        // Ищем блоки внутри секции
        this.textBlocks = Array.from(this.section.querySelectorAll('.timeline-block, .schedule-block, .event-block, .card'));
        
        // Если нет блоков с ожидаемыми классами, ищем любые блоки с текстом
        if (this.textBlocks.length < 4) {
            this.textBlocks = Array.from(this.section.querySelectorAll('div[class*="block"], .card, .item'));
        }
        
        if (this.textBlocks.length < 2) {
            console.warn('Нужно минимум 2 блока для траектории');
            // Все равно продолжаем, но с предупреждением
        }

        this.createCanvasContainer();
        this.heartTrail = new HeartTrail(this.section);
        this.scrollHandler = new ScrollHandler(
            this.section,
            this.textBlocks,
            this.heartTrail
        );

        this.isInitialized = true;
        console.log('Hearts Brush инициализирован для', selector);
    }

    createCanvasContainer() {
        // Убедимся, что контейнер еще не создан
        if (this.section.querySelector('.heart-trail-container')) {
            return;
        }
        
        const container = document.createElement('div');
        container.className = 'heart-trail-container';
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;
        
        // Устанавливаем позицию для секции
        if (getComputedStyle(this.section).position === 'static') {
            this.section.style.position = 'relative';
        }
        
        this.section.prepend(container);
    }

    destroy() {
        if (this.scrollHandler) this.scrollHandler.destroy();
        if (this.heartTrail) this.heartTrail.destroy();
        this.isInitialized = false;
    }
}