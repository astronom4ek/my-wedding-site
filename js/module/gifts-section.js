// gifts.js - Модуль для блока подарков с анимациями

// Инициализация блока подарков
export function initGifts() {
  console.log('Инициализация блока подарков...');
  
  // Инициализируем анимации появления
  initGiftsAnimation();
  
  // Инициализируем hover-эффекты
  initGiftsHoverEffects();
  
  // Инициализируем клики по карточкам (опционально)
  initGiftsClickHandlers();
  
  console.log('Блок подарков инициализирован');
}

// Анимация появления при скролле
function initGiftsAnimation() {
  const giftOptions = document.querySelectorAll('.gift-option');
  
  if (giftOptions.length === 0) {
    console.warn('Элементы .gift-option не найдены');
    return;
  }
  
  // Создаем наблюдатель за пересечением
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Запускаем анимацию
        entry.target.style.animationPlayState = 'running';
        // Прекращаем наблюдение после запуска
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Срабатывает когда 10% элемента видно
    rootMargin: '50px' // Запас в 50px
  });
  
  // Паузируем CSS анимации и начинаем наблюдение
  giftOptions.forEach(option => {
    option.style.animationPlayState = 'paused';
    observer.observe(option);
  });
  
  console.log(`Анимация инициализирована для ${giftOptions.length} элементов`);
}

// Эффекты при наведении
function initGiftsHoverEffects() {
  const giftOptions = document.querySelectorAll('.gift-option');
  
  giftOptions.forEach(option => {
    // Добавляем обработчики для плавных transition
    option.addEventListener('mouseenter', function() {
      // Добавляем класс для плавного перехода
      this.classList.add('hover-active');
    });
    
    option.addEventListener('mouseleave', function() {
      this.classList.remove('hover-active');
    });
  });
}

// Обработчики кликов (опционально - можно убрать если не нужно)
function initGiftsClickHandlers() {
  const giftOptions = document.querySelectorAll('.gift-option');
  
  giftOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      // Предотвращаем стандартное поведение если это ссылка внутри
      if (e.target.tagName === 'A') return;
      
      // Добавляем/убираем класс активной карточки
      this.classList.toggle('active');
      
      // Снимаем активность с других карточек
      if (this.classList.contains('active')) {
        giftOptions.forEach(otherOption => {
          if (otherOption !== this) {
            otherOption.classList.remove('active');
          }
        });
      }
    });
  });
}

// Функция для сброса всех анимаций (если нужно)
function resetGiftsAnimations() {
  const giftOptions = document.querySelectorAll('.gift-option');
  giftOptions.forEach(option => {
    option.style.animation = 'none';
    option.offsetHeight; // trigger reflow
    option.style.animation = '';
    option.style.animationPlayState = 'paused';
  });
}

// Дополнительные CSS для активного состояния (если используете клики)
const activeStyles = `
  .gift-option.active {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 20px 40px rgba(138, 123, 109, 0.25),
                0 0 0 3px rgba(248, 233, 233, 0.4),
                inset 0 0 30px rgba(255, 255, 255, 0.9);
    background-color: rgba(255, 255, 255, 0.98);
    z-index: 10;
  }
  
  .gift-option.active .gift-icon {
    transform: scale(1.3) rotate(10deg);
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
  }
  
  .gift-option.active::before {
    opacity: 1;
    height: 5px;
    background: linear-gradient(90deg, 
      #f8e9e9 0%,
      #e8d3c5 25%,
      #d1b8a0 50%,
      #e8d3c5 75%,
      #f8e9e9 100%);
  }
`;

// Добавляем стили для активного состояния если используем клики
const styleSheet = document.createElement('style');
styleSheet.textContent = activeStyles;
document.head.appendChild(styleSheet);

// Экспорт дополнительных функций для использования извне
export const giftsAPI = {
  init: initGifts,
  resetAnimations: resetGiftsAnimations,
  getGiftOptions: () => document.querySelectorAll('.gift-option'),
  
  // Программное выделение карточки
  selectGiftOption: (index) => {
    const options = document.querySelectorAll('.gift-option');
    if (options[index]) {
      options.forEach(opt => opt.classList.remove('active'));
      options[index].classList.add('active');
    }
  },
  
  // Снятие выделения
  deselectAll: () => {
    document.querySelectorAll('.gift-option').forEach(opt => {
      opt.classList.remove('active');
    });
  }
}