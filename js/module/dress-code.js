// dress-code.js - ПРОСТОЙ РАБОЧИЙ ВАРИАНТ

// Храним состояние каждого слайдера
const sliders = {
  men: {
    element: null,
    slides: [],
    currentIndex: 0,
    visibleCount: 3,
    totalSlides: 0
  },
  women: {
    element: null,
    slides: [],
    currentIndex: 0,
    visibleCount: 3,
    totalSlides: 0
  }
};

// Инициализация
export function initDressCodeSliders() {
  console.log('Инициализация простых слайдеров...');
  
  // Находим элементы
  sliders.men.element = document.querySelector('.men-slider');
  sliders.women.element = document.querySelector('.women-slider');
  
  if (!sliders.men.element || !sliders.women.element) {
    console.warn('Слайдеры не найдены');
    return;
  }
  
  // Получаем все слайды
  sliders.men.slides = Array.from(sliders.men.element.querySelectorAll('.slide'));
  sliders.women.slides = Array.from(sliders.women.element.querySelectorAll('.slide'));
  
  sliders.men.totalSlides = sliders.men.slides.length;
  sliders.women.totalSlides = sliders.women.slides.length;
  
  console.log(`Слайдов: мужские - ${sliders.men.totalSlides}, женские - ${sliders.women.totalSlides}`);
  
  // Устанавливаем видимое количество
  updateVisibleCount();
  
  // Показываем первые слайды
  showSlides('men');
  showSlides('women');
  
  // Вешаем обработчики
  initEvents();
  
  // Автоплей
  startAutoplay();
  
  console.log('Слайдеры инициализированы');
}

// Обновляем количество видимых слайдов
function updateVisibleCount() {
  const width = window.innerWidth;
  
  if (width >= 1024) {
    sliders.men.visibleCount = 3;
    sliders.women.visibleCount = 3;
  } else if (width >= 768) {
    sliders.men.visibleCount = 2;
    sliders.women.visibleCount = 2;
  } else {
    sliders.men.visibleCount = 1;
    sliders.women.visibleCount = 1;
  }
  
  // Обновляем отображение
  showSlides('men');
  showSlides('women');
}

// Показываем слайды
function showSlides(gender) {
  const slider = sliders[gender];
  if (!slider.element) return;
  
  // Скрываем все слайды
  slider.slides.forEach(slide => {
    slide.style.display = 'none';
    slide.style.opacity = '0';
  });
  
  // Показываем нужные слайды
  for (let i = 0; i < slider.visibleCount; i++) {
    let index = (slider.currentIndex + i) % slider.totalSlides;
    
    if (slider.slides[index]) {
      slider.slides[index].style.display = 'flex';
      // Анимация появления
      setTimeout(() => {
        slider.slides[index].style.opacity = '1';
      }, 50 * i);
    }
  }
}

// Следующие слайды
function nextSlides(gender) {
  const slider = sliders[gender];
  
  // Увеличиваем индекс
  slider.currentIndex = (slider.currentIndex + slider.visibleCount) % slider.totalSlides;
  
  // Показываем новые слайды
  showSlides(gender);
  
  // Сбрасываем автоплей
  resetAutoplay();
}

// Предыдущие слайды
function prevSlides(gender) {
  const slider = sliders[gender];
  
  // Уменьшаем индекс
  slider.currentIndex -= slider.visibleCount;
  if (slider.currentIndex < 0) {
    // Если ушли в минус, идем к концу
    slider.currentIndex = slider.totalSlides - slider.visibleCount;
    if (slider.currentIndex < 0) slider.currentIndex = 0;
  }
  
  // Показываем новые слайды
  showSlides(gender);
  
  // Сбрасываем автоплей
  resetAutoplay();
}

// Обработчики событий
function initEvents() {
  // Кнопки вперед/назад
  document.querySelectorAll('.slider-nav').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const gender = this.getAttribute('data-gender');
      const direction = this.classList.contains('next') ? 'next' : 'prev';
      
      if (direction === 'next') {
        nextSlides(gender);
      } else {
        prevSlides(gender);
      }
    });
  });
  
  // Свайпы на мобильных
  let touchStartX = 0;
  document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    
    slider.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      const threshold = 50;
      
      // Определяем gender
      let gender = slider.classList.contains('men-slider') ? 'men' : 'women';
      
      if (diff > threshold) {
        // Свайп влево = вперед
        nextSlides(gender);
      } else if (diff < -threshold) {
        // Свайп вправо = назад
        prevSlides(gender);
      }
    });
  });
  
  // Ресайз окна
  window.addEventListener('resize', debounce(updateVisibleCount, 250));
  
  // Сброс автоплея при взаимодействии
  ['mousemove', 'click', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetAutoplay);
  });
}

// Автоплей
let autoplayTimer = null;

function startAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  
  autoplayTimer = setInterval(() => {
    if (!document.hidden) {
      nextSlides('men');
      // Женский слайдер листаем с задержкой 500ms
      setTimeout(() => nextSlides('women'), 500);
    }
  }, 5000); // 5 секунд
}

function resetAutoplay() {
  startAutoplay();
}

// Дебаунс
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Экспорт отдельных функций для тестирования
export const dressCodeAPI = {
  next: nextSlides,
  prev: prevSlides,
  update: updateVisibleCount
};