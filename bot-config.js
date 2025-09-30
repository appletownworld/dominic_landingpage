// 🤖 Конфигурация Telegram бота для интеграции с лендингом

// ⚠️ НАСТРОЙТЕ ЭТИ ПАРАМЕТРЫ ПОД ВАШЕГО БОТА

const BOT_CONFIG = {
    // Username вашего бота (без @)
    username: 'dominicjokerbot',
    
    // ID группы ожидания (получите через @userinfobot)
    // Например: '-1001234567890'
    waitingGroupId: '-1004843260428',
    
    // ID администраторов (получите через @userinfobot)
    // Например: ['123456789', '987654321']
    adminIds: ['215698548'],
    
    // Настройки воронки
    funnel: {
        // Максимальное количество участников раннего доступа (без ограничений)
        maxEarlyAccessUsers: 999999,
        
        // Время рассмотрения заявки (в часах)
        reviewTimeHours: 24,
        
        // Дата начала ранних продаж
        earlySaleDate: '2025-10-31T00:00:00+09:00', // Корейское время
        
        // Дата начала обычных продаж
        regularSaleDate: '2025-11-01T00:00:00+09:00' // Корейское время
    }
};

// Экспортируем конфигурацию
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BOT_CONFIG;
} else {
    window.BOT_CONFIG = BOT_CONFIG;
}
