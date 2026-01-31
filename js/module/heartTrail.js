export class HeartTrail {
    constructor(section) {
        this.section = section;
        this.canvas = null;
        this.ctx = null;
        this.trailPoints = [];
        this.maxTrailLength = 100;
        this.animationId = null;
        this.isDrawing = false;
        
        this.initCanvas();
        this.setupResizeObserver();
    }

    initCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'heart-trail-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        `;
        
        const container = this.section.querySelector('.heart-trail-container');
        if (container) {
            container.appendChild(this.canvas);
        } else {
            this.section.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        const rect = this.section.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        
        this.ctx.scale(dpr, dpr);
    }

    setupResizeObserver() {
        this.resizeObserver = new ResizeObserver(() => {
            this.resizeCanvas();
            this.redrawTrail();
        });
        this.resizeObserver.observe(this.section);
    }

    addPoint(x, y, isHeartVisible = true) {
        this.trailPoints.push({
            x,
            y,
            time: Date.now(),
            opacity: 1,
            isHeartVisible
        });

        // Ограничиваем длину следа
        if (this.trailPoints.length > this.maxTrailLength) {
            this.trailPoints.shift();
        }

        if (!this.isDrawing) {
            this.isDrawing = true;
            this.animate();
        }
    }

    drawHeart(x, y, size, opacity) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        
        // Рисуем сердечко
        this.ctx.beginPath();
        const topCurveHeight = size * 0.3;
        
        this.ctx.moveTo(x, y + size / 4);
        
        // Верхняя левая кривая
        this.ctx.bezierCurveTo(
            x - size / 2, y - size / 2,
            x - size, y + topCurveHeight,
            x, y + size
        );
        
        // Верхняя правая кривая
        this.ctx.bezierCurveTo(
            x + size, y + topCurveHeight,
            x + size / 2, y - size / 2,
            x, y + size / 4
        );
        
        this.ctx.closePath();
        
        // Градиентная заливка
        const gradient = this.ctx.createRadialGradient(
            x, y, 0,
            x, y, size
        );
        gradient.addColorStop(0, `rgba(255, 100, 100, ${opacity})`);
        gradient.addColorStop(1, `rgba(255, 50, 50, ${opacity * 0.5})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Контур
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = `rgba(200, 50, 50, ${opacity})`;
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    drawTrailLine(fromPoint, toPoint) {
        this.ctx.beginPath();
        this.ctx.moveTo(fromPoint.x, fromPoint.y);
        
        // Создаем волнистую линию между точками
        const dx = toPoint.x - fromPoint.x;
        const dy = toPoint.y - fromPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const waves = 3;
        
        if (distance > 10) {
            for (let i = 0; i <= distance; i += 1) {
                const t = i / distance;
                const waveOffset = Math.sin(t * Math.PI * waves) * 5;
                const x = fromPoint.x + dx * t;
                const y = fromPoint.y + dy * t + waveOffset;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
        } else {
            this.ctx.lineTo(toPoint.x, toPoint.y);
        }
        
        // Градиент для линии
        const gradient = this.ctx.createLinearGradient(
            fromPoint.x, fromPoint.y,
            toPoint.x, toPoint.y
        );
        gradient.addColorStop(0, `rgba(255, 100, 100, ${fromPoint.opacity * 0.7})`);
        gradient.addColorStop(1, `rgba(255, 50, 50, ${toPoint.opacity * 0.7})`);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
    }

    animate() {
        this.clearCanvas();
        
        // Уменьшаем прозрачность старых точек
        this.trailPoints.forEach(point => {
            const age = Date.now() - point.time;
            point.opacity = Math.max(0, 1 - (age / 3000));
        });
        
        // Фильтруем невидимые точки
        this.trailPoints = this.trailPoints.filter(p => p.opacity > 0);
        
        // Рисуем след
        for (let i = 1; i < this.trailPoints.length; i++) {
            const fromPoint = this.trailPoints[i - 1];
            const toPoint = this.trailPoints[i];
            
            if (fromPoint.opacity > 0.1 && toPoint.opacity > 0.1) {
                this.drawTrailLine(fromPoint, toPoint);
            }
        }
        
        // Рисуем сердечко на последней точке
        const lastPoint = this.trailPoints[this.trailPoints.length - 1];
        if (lastPoint && lastPoint.isHeartVisible && lastPoint.opacity > 0) {
            this.drawHeart(lastPoint.x, lastPoint.y, 24, lastPoint.opacity);
        }
        
        if (this.trailPoints.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.isDrawing = false;
        }
    }

    clearPoint(x, y) {
        // Удаляем точки в радиусе 20px от текущей позиции сердца
        const clearRadius = 20;
        this.trailPoints = this.trailPoints.filter(point => {
            const dx = point.x - x;
            const dy = point.y - y;
            return Math.sqrt(dx * dx + dy * dy) > clearRadius;
        });
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    redrawTrail() {
        this.clearCanvas();
        if (this.trailPoints.length > 0) {
            this.animate();
        }
    }

    clearAll() {
        this.trailPoints = [];
        this.clearCanvas();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}