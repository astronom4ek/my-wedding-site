// location.js - Яндекс карта с правильными координатами

// ПРАВИЛЬНЫЕ координаты усадьбы Шелепаново
const LOCATION_COORDINATES = [56.120396, 37.162526]; // [широта, долгота]

// Инициализация блока локации
export function initLocation() {
  console.log('Инициализация блока локации...');
  
  // Инициализируем Яндекс карту
  initYandexMap();
  
  // Инициализируем кнопку копирования адреса
  initCopyAddressButton();
  
  console.log('Блок локации инициализирован');
}

// Инициализация Яндекс карты через iframe (рекомендованный способ)
function initYandexMap() {
  const mapContainer = document.getElementById('yandex-map');
  
  if (!mapContainer) {
    console.warn('Контейнер для Яндекс карты не найден');
    return;
  }
  
  // Очищаем контейнер
  mapContainer.innerHTML = '';
  
  // Создаем iframe с правильными координатами
  const iframe = document.createElement('iframe');
  
  // Формируем правильный URL для iframe
  // pm2rdl - красная метка, pm2 - размер, rdl - цвет красный
  iframe.src = `https://yandex.ru/map-widget/v1/?ll=${LOCATION_COORDINATES[1]},${LOCATION_COORDINATES[0]}&z=13&l=map&pt=${LOCATION_COORDINATES[1]},${LOCATION_COORDINATES[0]},pm2rdl~${LOCATION_COORDINATES[1]},${LOCATION_COORDINATES[0]},flag`;
  
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.frameBorder = '0';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '12px';
  iframe.allowFullscreen = true;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  
  // Заголовок для доступности
  iframe.title = 'Карта с расположением Усадьбы Шелепаново';
  
  // Добавляем обработчик ошибок
  iframe.onerror = () => {
    console.warn('Не удалось загрузить карту iframe');
    showMapFallback(mapContainer);
  };
  
  mapContainer.appendChild(iframe);
  
  console.log('Карта iframe создана с координатами:', LOCATION_COORDINATES);
}

// Fallback если iframe не загрузился
function showMapFallback(container) {
  container.innerHTML = `
    <div class="map-fallback">
      <div class="fallback-content">
        <p>Усадьба Шелепаново</p>
        <p class="address">Усадьба Шелепаново, Московская область, городской округ Солнечногорск,<br>территориальное управление Пешковское</p>
        <p class="coordinates">Координаты: ${LOCATION_COORDINATES[0]}, ${LOCATION_COORDINATES[1]}</p>
        <a href="https://yandex.ru/maps/org/usadba_shelepanovo/12791297215/?ll=${LOCATION_COORDINATES[1]}%2C${LOCATION_COORDINATES[0]}&z=14" 
           target="_blank" class="fallback-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 3H21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Открыть в Яндекс.Картах
        </a>
      </div>
    </div>
  `;
}

// Копирование адреса
function initCopyAddressButton() {
  const copyButton = document.querySelector('.copy-address-btn');
  
  if (!copyButton) return;
  
  // Обновляем адрес для копирования
  const correctAddress = "Усадьба Шелепаново, Московская область, городской округ Солнечногорск, территориальное управление Пешковское";
  copyButton.setAttribute('data-address', correctAddress);
  
  copyButton.addEventListener('click', async function() {
    const address = this.getAttribute('data-address');
    
    try {
      await navigator.clipboard.writeText(address);
      showCopyNotification('Адрес скопирован!');
      
      const span = this.querySelector('span');
      const originalText = span.textContent;
      span.textContent = 'Скопировано!';
      this.style.backgroundColor = '#4CAF50';
      
      setTimeout(() => {
        span.textContent = originalText;
        this.style.backgroundColor = '';
      }, 2000);
      
    } catch (err) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showCopyNotification('Адрес скопирован!');
    }
  });
}

// Уведомление
function showCopyNotification(message) {
  const notification = document.getElementById('copyNotification');
  if (!notification) return;
  
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Экспорт
export const locationAPI = {
  init: initLocation,
  getCoordinates: () => LOCATION_COORDINATES
};

