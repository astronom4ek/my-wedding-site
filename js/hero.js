// hero.js - Модуль для блока приветствия (упрощенный)

// Инициализация блока приветствия
export function initHero() {
  console.log('Инициализация блока приветствия...');
  
  // Инициализируем анимации при загрузке
  initHeroAnimations();
  
  // Инициализируем hover эффекты
  initHeroHoverEffects();
  
  console.log('Блок приветствия инициализирован');
}

// Анимации при загрузке
function initHeroAnimations() {
  const heroSection = document.querySelector('.hero-section');
  
  if (!heroSection) {
    console.warn('Блок .hero-section не найден');
    return;
  }
  
  // Добавляем класс для запуска CSS анимаций
  setTimeout(() => {
    heroSection.classList.add('animations-loaded');
  }, 100);
  
  console.log('Анимации блока приветствия активированы');
}

// Hover эффекты
function initHeroHoverEffects() {
  const photoFrame = document.querySelector('.photo-frame');
  
  if (photoFrame) {
    // Добавляем плавные transition для hover
    photoFrame.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    
    photoFrame.addEventListener('mouseenter', () => {
      photoFrame.style.transform = 'translateY(-10px)';
      photoFrame.style.boxShadow = 
        '0 35px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)';
    });
    
    photoFrame.addEventListener('mouseleave', () => {
      photoFrame.style.transform = 'translateY(0)';
      photoFrame.style.boxShadow = 
        '0 25px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1)';
    });
  }
}

// CSS для анимаций (дополнительные стили)
const heroAnimationsCSS = `
  /* Управление анимациями через класс */
  .hero-section.animations-loaded .greeting-line,
  .hero-section.animations-loaded .bride-name,
  .hero-section.animations-loaded .groom-name,
  .hero-section.animations-loaded .heart-icon,
  .hero-section.animations-loaded .wedding-date,
  .hero-section.animations-loaded .location-hint,
  .hero-section.animations-loaded .photo-frame,
  .hero-section.animations-loaded .photo-caption,
  .hero-section.animations-loaded .divider-line {
    animation-play-state: running !important;
  }
  
  /* Пауза всех анимаций по умолчанию */
  .greeting-line,
  .bride-name,
  .groom-name,
  .heart-icon,
  .wedding-date,
  .location-hint,
  .photo-frame,
  .photo-caption,
  .divider-line {
    animation-play-state: paused;
  }
`;

// Добавляем стили для управления анимациями
const styleSheet = document.createElement('style');
styleSheet.textContent = heroAnimationsCSS;
document.head.appendChild(styleSheet);

// Экспорт функций
export const heroAPI = {
  init: initHero,
  replayAnimations: () => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.classList.remove('animations-loaded');
      setTimeout(() => {
        heroSection.classList.add('animations-loaded');
      }, 50);
    }
  }
};