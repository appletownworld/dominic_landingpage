// Настройка корейского часового пояса (UTC+9)
const KOREA_TIMEZONE_OFFSET = 9 * 60; // 9 часов в минутах

// Дата начала продаж: 1 ноября 2025, 00:00 по корейскому времени
const SALE_START_DATE = new Date('2025-11-01T00:00:00+09:00');

// Элементы DOM (будут инициализированы после загрузки DOM)
let daysElement, hoursElement, minutesElement, secondsElement, notifyBtn;
let newsletterForm, scrollBtn, hamburger, navMenu;

// Функция для получения текущего времени в корейском часовом поясе
function getKoreaTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const koreaTime = new Date(utc + (KOREA_TIMEZONE_OFFSET * 60000));
    return koreaTime;
}

// Функция обновления обратного отсчета
function updateCountdown() {
    const now = getKoreaTime();
    const timeLeft = SALE_START_DATE - now;

    if (timeLeft <= 0) {
        // Время истекло - продажи начались
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        
        // Обновляем текст кнопки
        notifyBtn.innerHTML = '<span class="btn-text">Купить билеты</span><i class="fas fa-ticket-alt"></i>';
        notifyBtn.onclick = () => {
            showNotification('Продажи билетов начались! Переходите к покупке.', 'success');
        };
        
        return;
    }

    // Вычисляем оставшееся время
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Обновляем элементы DOM с анимацией
    animateNumber(daysElement, days);
    animateNumber(hoursElement, hours);
    animateNumber(minutesElement, minutes);
    animateNumber(secondsElement, seconds);
}

// Анимация чисел в обратном отсчете
function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== newValue) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#ff006e';
        setTimeout(() => {
            element.textContent = newValue.toString().padStart(2, '0');
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 150);
    }
}

// Функция для показа уведомления
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #2196F3, #1976D2)'};
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 400px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Стили для содержимого уведомления
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие через 4 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Создание частиц для фона
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: ${['#ff006e', '#8338ec', '#3a86ff', '#ffd700'][Math.floor(Math.random() * 4)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 20 + 10}s linear infinite;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        particlesContainer.appendChild(particle);
    }
}


// Анимация плавания частиц
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Плавная прокрутка
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Обработчик кнопки уведомления (будет добавлен после инициализации)
function initNotifyButton() {
    if (notifyBtn) {
        notifyBtn.addEventListener('click', () => {
            const now = getKoreaTime();
            const timeLeft = SALE_START_DATE - now;
            
            if (timeLeft <= 0) {
                showNotification('Продажи билетов уже начались!', 'success');
            } else {
                showNotification('Мы уведомим вас о начале продаж!', 'success');
            }
        });
    }
}

// Обработчик кнопки прокрутки (будет добавлен после инициализации)
function initScrollButton() {
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            smoothScrollTo('#about');
        });
    }
}

// Обработчик формы подписки (будет добавлен после инициализации)
function initNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('Спасибо за подписку! Мы уведомим вас о начале продаж.', 'success');
                newsletterForm.reset();
            }
        });
    }
}

// Мобильное меню (будет добавлено после инициализации)
function initMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Закрытие мобильного меню при клике на ссылку (будет добавлено после инициализации)
function initNavLinks() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        smoothScrollTo(target);
    });
});

// Эффект печатания для заголовка
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Анимация появления элементов при прокрутке
function animateOnScroll() {
    const elements = document.querySelectorAll('.countdown-card, .detail-card, .ticket-card, .feature-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Параллакс эффект для частиц
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        const speed = 0.5 + (index % 3) * 0.2;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Интерактивные эффекты для карточек
function addCardEffects() {
    const cards = document.querySelectorAll('.countdown-card, .detail-card, .ticket-card');
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Эффект свечения для кнопок
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 0 30px rgba(255, 0, 110, 0.6)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '';
        });
    });
}

// Функция для отображения информации о времени
function displayTimeInfo() {
    const now = getKoreaTime();
    const saleStart = SALE_START_DATE;
    
    console.log('🎵 Доминик Джокер - Лендинг загружен');
    console.log('🕐 Текущее время в Корее:', formatKoreaDate(now));
    console.log('🎫 Начало продаж:', formatKoreaDate(saleStart));
    
    const timeLeft = saleStart - now;
    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        console.log(`⏰ До начала продаж осталось: ${days} дней`);
    } else {
        console.log('🎉 Продажи уже начались!');
    }
}

// Форматирование даты в корейском формате
function formatKoreaDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Seoul'
    };
    return date.toLocaleDateString('ru-RU', options);
}

// Предзагрузка изображений
function preloadImages() {
    const imageUrls = [
        'images/1.jpg',
        'images/2.jpg', 
        'images/3.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
    
    console.log('🖼️ Изображения предзагружены');
}

// Инициализация элементов DOM
function initDOMElements() {
    daysElement = document.getElementById('days');
    hoursElement = document.getElementById('hours');
    minutesElement = document.getElementById('minutes');
    secondsElement = document.getElementById('seconds');
    notifyBtn = document.getElementById('notifyBtn');
    newsletterForm = document.getElementById('newsletterForm');
    scrollBtn = document.getElementById('scrollBtn');
    hamburger = document.querySelector('.hamburger');
    navMenu = document.querySelector('.nav-menu');
    
    // Проверяем, что основные элементы обратного отсчета найдены
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement || !notifyBtn) {
        console.error('Не удалось найти элементы обратного отсчета');
        return false;
    }
    
    console.log('✅ Элементы DOM инициализированы');
    return true;
}

// Инициализация всех функций
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем элементы DOM
    if (!initDOMElements()) {
        return;
    }
    
    // Предзагрузка изображений
    preloadImages();
    
    // Инициализируем обработчики событий
    initNotifyButton();
    initScrollButton();
    initNewsletterForm();
    initMobileMenu();
    initNavLinks();
    
    // Основные функции
    updateCountdown();
    displayTimeInfo();
    createParticles();
    addCardEffects();
    addButtonEffects();
    addGalleryEffects();
    addHeroImageEffect();
    initEarlyAccessForm();
    
    // Применяем эффект печатания к заголовку
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
    
    // Обновление каждую секунду
    setInterval(updateCountdown, 1000);
    
    // Анимации при прокрутке
    window.addEventListener('scroll', () => {
        animateOnScroll();
        parallaxEffect();
    });
    
    // Первоначальная анимация
    setTimeout(animateOnScroll, 500);
    
    // Анимация статистики при появлении в viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.artist-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    console.log('🚀 Все системы запущены!');
    console.log('📱 Адаптивный дизайн активен');
    console.log('🎨 Анимации и эффекты загружены');
    console.log('🖼️ Галерея артиста активна');
    console.log('📊 Анимация статистики готова');
});

// Дополнительные интерактивные эффекты

// Эффект наклона для карточек при движении мыши
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.countdown-card, .ticket-card, .gallery-item, .stat-item');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
    });
});

// Эффект для изображений в галерее
function addGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('.gallery-img');
        
        item.addEventListener('mouseenter', () => {
            img.style.filter = 'grayscale(0%) contrast(1.15) brightness(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            img.style.filter = 'grayscale(10%) contrast(1.05) brightness(0.95)';
        });
    });
}

// Анимация статистики
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumber = !isNaN(parseInt(finalValue));
        
        if (isNumber) {
            const targetValue = parseInt(finalValue);
            let currentValue = 0;
            const increment = targetValue / 50;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue) + (finalValue.includes('+') ? '+' : '');
                }
            }, 30);
        }
    });
}

// Эффект для портрета в hero секции
function addHeroImageEffect() {
    const heroImage = document.querySelector('.artist-portrait');
    const heroSection = document.querySelector('.hero');
    
    if (heroImage && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            heroImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }
}

// Эффект пульсации для важных элементов
function addPulseEffect() {
    const pulseElements = document.querySelectorAll('.countdown-number, .date-number');
    
    pulseElements.forEach(element => {
        setInterval(() => {
            element.style.textShadow = '0 0 30px rgba(255, 0, 110, 0.8)';
            setTimeout(() => {
                element.style.textShadow = '0 0 20px rgba(255, 0, 110, 0.5)';
            }, 200);
        }, 2000);
    });
}

// Запуск эффекта пульсации
setTimeout(addPulseEffect, 2000);

// Функция инициализации формы раннего доступа
function initEarlyAccessForm() {
    const form = document.getElementById('earlyAccessForm');
    if (!form) return;

    form.addEventListener('submit', handleEarlyAccessSubmit);
    
    // Добавляем анимации к полям формы
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// Обработка отправки формы раннего доступа
function handleEarlyAccessSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const userData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        timestamp: new Date().toISOString(),
        source: 'early_access_form'
    };
    
    // Показываем анимацию загрузки
    const submitBtn = form.querySelector('.access-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="btn-text">Отправляем...</span><span class="btn-icon">⏳</span>';
    submitBtn.disabled = true;
    
    // Симулируем отправку данных (в реальном проекте здесь будет API запрос)
    setTimeout(() => {
        // Сохраняем данные в localStorage для демонстрации
        const existingUsers = JSON.parse(localStorage.getItem('earlyAccessUsers') || '[]');
        existingUsers.push(userData);
        localStorage.setItem('earlyAccessUsers', JSON.stringify(existingUsers));
        
        // Перенаправляем в Telegram бота
        redirectToTelegramBot(userData);
        
        // Показываем успешное сообщение
        showSuccessMessage();
        
        // Сбрасываем форму
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// Перенаправление в Telegram бота
function redirectToTelegramBot(userData) {
    // Получаем конфигурацию бота
    const botUsername = window.BOT_CONFIG?.username || 'dominicjokerbot';
    
    // Создаем сообщение для бота
    const message = `🎫 НОВАЯ ЗАЯВКА НА РАННИЙ ДОСТУП!\n\n` +
                   `👤 Имя: ${userData.name}\n` +
                   `📱 Телефон: ${userData.phone}\n` +
                   `⏰ Время: ${new Date(userData.timestamp).toLocaleString('ru-RU')}\n\n` +
                   `🚀 Пользователь готов к раннему доступу!`;
    
    // URL для отправки сообщения боту (в реальном проекте используйте Telegram Bot API)
    const telegramUrl = `https://t.me/${botUsername}?start=early_access_${Date.now()}`;
    
    // Открываем Telegram
    window.open(telegramUrl, '_blank');
    
    // Также можно отправить данные на сервер
    sendToServer(userData);
}

// Отправка данных на сервер
function sendToServer(userData) {
    // В реальном проекте здесь будет отправка на ваш сервер
    fetch('/api/early-access', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    }).catch(error => {
        console.log('Сервер недоступен, данные сохранены локально');
    });
}

// Показ сообщения об успехе
function showSuccessMessage() {
    const form = document.getElementById('earlyAccessForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✅</div>
            <h3>Отлично! Заявка принята!</h3>
            <p>Мы отправили вас в Telegram бота для получения раннего доступа к билетам.</p>
            <p>Следуйте инструкциям в боте, чтобы попасть в группу ожидания.</p>
        </div>
    `;
    
    // Добавляем стили для сообщения об успехе
    const style = document.createElement('style');
    style.textContent = `
        .success-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 20px;
            padding: 2rem;
            z-index: 10000;
            text-align: center;
            max-width: 400px;
            animation: slideInScale 0.5s ease-out;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .success-content h3 {
            color: #667eea;
            margin: 1rem 0;
            font-family: 'Orbitron', monospace;
        }
        
        .success-content p {
            color: #4a5568;
            margin: 0.5rem 0;
            line-height: 1.5;
        }
        
        .success-icon {
            font-size: 3rem;
            animation: bounce 1s infinite;
        }
        
        @keyframes slideInScale {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(successMessage);
    
    // Убираем сообщение через 5 секунд
    setTimeout(() => {
        successMessage.remove();
        style.remove();
    }, 5000);
}