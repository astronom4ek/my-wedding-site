export class ScrollHandler {
    constructor(section, textBlocks, heartTrail) {
        this.section = section;
        this.textBlocks = textBlocks;
        this.heartTrail = heartTrail;
        
        this.scrollProgress = 0;
        this.lastScrollTop = 0;
        this.isScrollingDown = true;
        this.animationFrameId = null;
        
        this.init();
    }

    init() {
        this.calculateBlockPositions();
        this.setupEventListeners();
        this.animate();
    }

    calculateBlockPositions() {
        const sectionRect = this.section.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Получаем абсолютные позиции блоков
        this.blockPositions = this.textBlocks.map(block => {
            const rect = block.getBoundingClientRect();
            return {
                element: block,
                x: rect.left + rect.width / 2 - sectionRect.left,
                y: rect.top + rect.height / 2 - sectionRect.top,
                width: rect.width,
                height: rect.height,
                absoluteTop: rect.top + scrollTop
            };
        }).sort((a, b) => a.absoluteTop - b.absoluteTop); // Сортируем по вертикали

        // Берем первые 4 блока или все, если меньше
        const targetBlocks = this.blockPositions.slice(0, Math.min(4, this.blockPositions.length));
        
        if (targetBlocks.length === 0) {
            // Если нет блоков, создаем дефолтные точки
            this.startPoint = { x: sectionRect.width / 2, y: -50 };
            this.endPoint = { x: sectionRect.width / 2, y: sectionRect.height + 50 };
            this.blockPositions = [];
            return;
        }

        // Стартовая позиция (над первым блоком)
        this.startPoint = {
            x: targetBlocks[0].x,
            y: -50
        };
        
        // Конечная позиция (под последним блоком)
        const lastBlock = targetBlocks[targetBlocks.length - 1];
        this.endPoint = {
            x: lastBlock.x,
            y: sectionRect.height + 50
        };
        
        // Используем только targetBlocks для траектории
        this.trajectoryBlocks = targetBlocks;
    }

    getWavyTrajectory(progress) {
        if (!this.trajectoryBlocks || this.trajectoryBlocks.length === 0) {
            // Простая вертикальная линия, если нет блоков
            const x = this.startPoint.x;
            const y = this.startPoint.y + (this.endPoint.y - this.startPoint.y) * progress;
            return { x, y };
        }

        const points = [
            this.startPoint,
            ...this.trajectoryBlocks.map(pos => ({ x: pos.x, y: pos.y })),
            this.endPoint
        ];
        
        const totalSegments = points.length - 1;
        const segmentProgress = progress * totalSegments;
        const segmentIndex = Math.floor(segmentProgress);
        const segmentT = segmentProgress - segmentIndex;
        
        if (segmentIndex >= points.length - 1) {
            return points[points.length - 1];
        }
        
        const p0 = points[segmentIndex];
        const p1 = points[segmentIndex + 1];
        
        // Волна только для средних сегментов (не для начала и конца)
        let waveOffset = 0;
        if (segmentIndex > 0 && segmentIndex < points.length - 2) {
            const waveAmplitude = 30;
            const waveFrequency = 3;
            waveOffset = Math.sin(segmentT * Math.PI * waveFrequency) * waveAmplitude;
        }
        
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        
        return {
            x: p0.x + dx * segmentT,
            y: p0.y + dy * segmentT + waveOffset
        };
    }

    handleScroll() {
        const sectionRect = this.section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Прогресс видимости секции
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        
        let progress = 0;
        
        if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
            // Секция видна
            const visiblePart = Math.min(
                windowHeight - Math.max(0, -sectionTop),
                sectionHeight
            );
            progress = visiblePart / windowHeight;
        }
        
        // Определяем направление скролла
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.isScrollingDown = currentScrollTop > this.lastScrollTop;
        this.lastScrollTop = currentScrollTop;
        
        // Прогресс скролла внутри секции
        const scrollProgress = Math.max(0, Math.min(1, 
            (currentScrollTop - sectionRect.top + windowHeight) / 
            (sectionHeight + windowHeight)
        ));
        
        if (this.isScrollingDown) {
            this.scrollProgress = Math.min(1, this.scrollProgress + 0.02);
        } else {
            this.scrollProgress = Math.max(0, this.scrollProgress - 0.02);
            
            // При скролле вверх стираем след
            const heartPos = this.getWavyTrajectory(this.scrollProgress);
            this.heartTrail.clearPoint(heartPos.x, heartPos.y);
        }
    }

    animate() {
        const heartPos = this.getWavyTrajectory(this.scrollProgress);
        
        // Добавляем точку следа
        this.heartTrail.addPoint(heartPos.x, heartPos.y, true);
        
        // Активируем блоки по мере прохождения
        this.textBlocks.forEach((block, index) => {
            const blockProgress = this.scrollProgress * (this.blockPositions.length + 2);
            if (blockProgress > index + 0.5 && blockProgress < index + 1.5) {
                block.classList.add('heart-visited');
            } else {
                block.classList.remove('heart-visited');
            }
        });
        
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        let scrollTimeout;
        const handleScrollThrottled = () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.handleScroll();
                    scrollTimeout = null;
                }, 16); // ~60fps
            }
        };
        
        window.addEventListener('scroll', handleScrollThrottled);
        window.addEventListener('resize', () => this.calculateBlockPositions());
        
        this.scrollListeners = {
            scroll: handleScrollThrottled,
            resize: () => this.calculateBlockPositions()
        };
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this.scrollListeners) {
            window.removeEventListener('scroll', this.scrollListeners.scroll);
            window.removeEventListener('resize', this.scrollListeners.resize);
        }
    }
}