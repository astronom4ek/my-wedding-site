// hero.js
export function initHero() {
  console.log('Блок приветствия загружен');
  
  // Инициализируем hover эффекты
  const photoFrames = document.querySelectorAll('.photo-frame');
  
  photoFrames.forEach(frame => {
    frame.addEventListener('mouseenter', () => {
      frame.style.transform = 'translateY(-5px)';
      frame.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
    });
    
    frame.addEventListener('mouseleave', () => {
      frame.style.transform = 'translateY(0)';
      frame.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.12)';
    });
  });
}

export const heroAPI = {
  init: initHero
};