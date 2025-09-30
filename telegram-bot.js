// 🤖 Упрощенный Telegram бот для воронки раннего доступа
// Запуск: node telegram-bot.js

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// ⚠️ НАСТРОЙТЕ ЭТИ ПАРАМЕТРЫ
const BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Токен вашего бота
const WAITING_GROUP_ID = 'YOUR_GROUP_ID'; // ID группы ожидания
const ADMIN_IDS = ['YOUR_ADMIN_ID']; // ID администраторов

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Хранилище пользователей
let earlyAccessUsers = [];

// Загрузка данных
try {
    const data = fs.readFileSync('users.json', 'utf8');
    earlyAccessUsers = JSON.parse(data);
    console.log(`📊 Загружено ${earlyAccessUsers.length} пользователей`);
} catch (error) {
    console.log('📝 Создаем новый файл пользователей');
}

// Сохранение данных
function saveUsers() {
    fs.writeFileSync('users.json', JSON.stringify(earlyAccessUsers, null, 2));
    console.log(`💾 Сохранено ${earlyAccessUsers.length} пользователей`);
}

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const startParam = msg.text.split(' ')[1];
    
    if (startParam && startParam.startsWith('early_access_')) {
        handleEarlyAccessUser(msg);
    } else {
        bot.sendMessage(chatId, `
🎫 **Добро пожаловать в бот Dominic Joker!**

🎭 Концерт в Сеуле 14 февраля 2026

Для получения раннего доступа:
1. Заполните форму на сайте
2. Получите приглашение в группу
3. Будьте первыми на покупке билетов!

Команды:
/early_access - Получить ранний доступ
/status - Статус заявки
/help - Помощь
        `);
    }
});

// Обработка пользователей с лендинга
function handleEarlyAccessUser(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userData = {
        id: userId,
        username: msg.from.username,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        joinedAt: new Date().toISOString(),
        status: 'pending'
    };
    
    const existingUser = earlyAccessUsers.find(u => u.id === userId);
    
    if (existingUser) {
        const statusText = existingUser.status === 'approved' ? '✅ Одобрен' : 
                          existingUser.status === 'rejected' ? '❌ Отклонен' : '⏳ Ожидает';
        
        bot.sendMessage(chatId, `
✅ Вы уже зарегистрированы!

Статус: ${statusText}

${existingUser.status === 'approved' ? 
    '🎉 У вас есть ранний доступ к билетам!' : 
    'Мы уведомим вас о решении.'}
        `);
    } else {
        earlyAccessUsers.push(userData);
        saveUsers();
        
        bot.sendMessage(chatId, `
🎫 **Заявка принята!**

👤 ${userData.firstName} ${userData.lastName || ''}
⏰ ${new Date().toLocaleString('ru-RU')}

⏳ Заявка на рассмотрении (до 24 часов)

🎁 **Преимущества раннего доступа:**
• Скидка 20% на билеты
• Доступ за 24 часа до продаж
• Лучшие места в зале
• Эксклюзивный мерч

🚀 Следите за обновлениями!
        `);
        
        notifyAdmins(userData);
    }
}

// Уведомление администраторов
function notifyAdmins(newUser) {
    const message = `
🆕 **НОВАЯ ЗАЯВКА НА РАННИЙ ДОСТУП!**

👤 ${newUser.firstName} ${newUser.lastName || ''}
🆔 ID: ${newUser.id}
👤 @${newUser.username || 'не указан'}
⏰ ${new Date().toLocaleString('ru-RU')}

📊 Всего заявок: ${earlyAccessUsers.length}
    `;
    
    ADMIN_IDS.forEach(adminId => {
        bot.sendMessage(adminId, message, {
            reply_markup: {
                inline_keyboard: [[
                    { text: '✅ Одобрить', callback_data: `approve_${newUser.id}` },
                    { text: '❌ Отклонить', callback_data: `reject_${newUser.id}` }
                ]]
            }
        });
    });
}

// Обработка callback кнопок
bot.on('callback_query', (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    
    if (data.startsWith('approve_')) {
        const userId = data.replace('approve_', '');
        approveUser(userId, chatId, callbackQuery.id);
    }
    
    if (data.startsWith('reject_')) {
        const userId = data.replace('reject_', '');
        rejectUser(userId, chatId, callbackQuery.id);
    }
});

// Одобрение пользователя
function approveUser(userId, adminChatId, callbackQueryId) {
    const user = earlyAccessUsers.find(u => u.id == userId);
    
    if (user) {
        user.status = 'approved';
        user.approvedAt = new Date().toISOString();
        saveUsers();
        
        // Приглашаем в группу
        bot.inviteToGroup(WAITING_GROUP_ID, userId).then(() => {
            bot.answerCallbackQuery(callbackQueryId, {
                text: '✅ Пользователь одобрен и добавлен в группу!',
                show_alert: true
            });
            
            // Уведомляем пользователя
            bot.sendMessage(userId, `
🎉 **Поздравляем! Заявка одобрена!**

✅ Вы получили ранний доступ к билетам!

🎁 **Ваши преимущества:**
• Скидка 20% на все билеты
• Доступ за 24 часа до продаж
• Лучшие места в зале
• Эксклюзивный мерч

🚀 **Ранние продажи:** 31 октября 2025, 00:00 (корейское время)

Добро пожаловать в группу ожидания! 🎫
            `);
            
        }).catch(error => {
            console.error('❌ Ошибка при добавлении в группу:', error);
            bot.answerCallbackQuery(callbackQueryId, {
                text: '❌ Ошибка при добавлении в группу',
                show_alert: true
            });
        });
    }
}

// Отклонение пользователя
function rejectUser(userId, adminChatId, callbackQueryId) {
    const user = earlyAccessUsers.find(u => u.id == userId);
    
    if (user) {
        user.status = 'rejected';
        user.rejectedAt = new Date().toISOString();
        saveUsers();
        
        bot.answerCallbackQuery(callbackQueryId, {
            text: '❌ Пользователь отклонен',
            show_alert: true
        });
        
        bot.sendMessage(userId, `
❌ **Заявка отклонена**

Возможные причины:
• Неполные данные
• Технические ограничения

Вы можете купить билеты в обычном порядке с 1 ноября 2025.

Спасибо за интерес к концерту! 🎭
        `);
    }
}

// Команда /status
bot.onText(/\/status/, (msg) => {
    const userId = msg.from.id;
    const user = earlyAccessUsers.find(u => u.id === userId);
    
    if (user) {
        const statusText = user.status === 'approved' ? '✅ Одобрен' : 
                          user.status === 'rejected' ? '❌ Отклонен' : '⏳ Ожидает';
        
        bot.sendMessage(msg.chat.id, `
📊 **Статус заявки**

👤 ${user.firstName} ${user.lastName || ''}
📅 Подана: ${new Date(user.joinedAt).toLocaleString('ru-RU')}
📈 Статус: ${statusText}

${user.status === 'approved' ? 
    '🎉 У вас есть ранний доступ!' : 
    user.status === 'pending' ? 
    '⏳ Заявка рассматривается' :
    '❌ Заявка отклонена'}
        `);
    } else {
        bot.sendMessage(msg.chat.id, `
❌ Вы еще не подавали заявку.

Для подачи заявки:
1. Перейдите на сайт
2. Заполните форму "Ранний доступ"
3. Следуйте инструкциям
        `);
    }
});

// Команда /help
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, `
🤖 **Помощь по боту Dominic Joker**

**Команды:**
/start - Начать работу
/early_access - Получить ранний доступ
/status - Статус заявки
/help - Эта справка

**Как получить ранний доступ:**
1. Заполните форму на сайте
2. Получите приглашение в группу
3. Будьте первыми на покупке!

**Преимущества:**
• Скидка 20% на билеты
• Доступ за 24 часа до продаж
• Лучшие места в зале
• Эксклюзивный мерч

🎭 Увидимся 14 февраля 2026 в Сеуле!
    `);
});

// Обработка ошибок
bot.on('error', (error) => {
    console.error('❌ Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
    console.error('❌ Ошибка polling:', error);
});

console.log('🤖 Бот Dominic Joker запущен!');
console.log('📊 Пользователей в базе:', earlyAccessUsers.length);
console.log('👥 Администраторов:', ADMIN_IDS.length);
console.log('🏠 Группа ожидания:', WAITING_GROUP_ID);
