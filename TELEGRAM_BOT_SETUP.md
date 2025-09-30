# 🤖 Настройка Telegram бота для воронки раннего доступа

## 📋 Обзор воронки

1. **Пользователь заполняет форму** на лендинге
2. **Перенаправление в Telegram бота** с данными пользователя
3. **Бот добавляет в группу ожидания** для раннего доступа к билетам

## 🚀 Создание Telegram бота

### Шаг 1: Создание бота
1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Введите имя бота: `Dominic Joker Early Access Bot`
4. Введите username: `DominicJokerBot` (или любой доступный)
5. Сохраните полученный **TOKEN**

### Шаг 2: Настройка команд бота
Отправьте BotFather следующие команды:

```
/setcommands
@DominicJokerBot
start - Начать работу с ботом
early_access - Получить ранний доступ к билетам
help - Помощь
status - Статус заявки
```

### Шаг 3: Создание группы ожидания
1. Создайте группу в Telegram: `Dominic Joker - Early Access`
2. Добавьте бота в группу как администратора
3. Настройте права бота:
   - ✅ Может приглашать пользователей
   - ✅ Может удалять сообщения
   - ❌ Может изменять информацию группы

## 💻 Код бота (Node.js)

Создайте файл `bot.js`:

```javascript
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Замените на ваш токен
const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// ID группы ожидания (получите через @userinfobot)
const WAITING_GROUP_ID = 'YOUR_GROUP_ID';

// Хранилище пользователей
let earlyAccessUsers = [];

// Загрузка данных при запуске
try {
    const data = fs.readFileSync('users.json', 'utf8');
    earlyAccessUsers = JSON.parse(data);
} catch (error) {
    console.log('Создаем новый файл пользователей');
}

// Сохранение данных
function saveUsers() {
    fs.writeFileSync('users.json', JSON.stringify(earlyAccessUsers, null, 2));
}

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username || msg.from.first_name;
    
    // Проверяем, есть ли параметр early_access
    const startParam = msg.text.split(' ')[1];
    
    if (startParam && startParam.startsWith('early_access_')) {
        // Пользователь пришел с лендинга
        handleEarlyAccessUser(msg);
    } else {
        // Обычный старт
        bot.sendMessage(chatId, `
🎫 Добро пожаловать в бот раннего доступа к билетам Dominic Joker!

🎭 **Концерт в Сеуле 14 февраля 2026**

Для получения раннего доступа к билетам:
1. Заполните форму на сайте
2. Получите приглашение в группу ожидания
3. Будьте первыми на покупке билетов!

Команды:
/early_access - Получить ранний доступ
/help - Помощь
        `, {
            reply_markup: {
                inline_keyboard: [[
                    { text: '🎫 Получить ранний доступ', callback_data: 'get_early_access' }
                ]]
            }
        });
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
    
    // Проверяем, не зарегистрирован ли уже
    const existingUser = earlyAccessUsers.find(u => u.id === userId);
    
    if (existingUser) {
        bot.sendMessage(chatId, `
✅ Вы уже зарегистрированы на ранний доступ!

Ваш статус: ${existingUser.status === 'approved' ? '✅ Одобрен' : '⏳ Ожидает одобрения'}

${existingUser.status === 'approved' ? 
    '🎉 Поздравляем! Вы получили ранний доступ к билетам!' : 
    'Мы уведомим вас, как только одобрим заявку.'}
        `);
    } else {
        // Добавляем нового пользователя
        earlyAccessUsers.push(userData);
        saveUsers();
        
        bot.sendMessage(chatId, `
🎫 Заявка на ранний доступ принята!

👤 Ваши данные:
• Имя: ${userData.firstName} ${userData.lastName || ''}
• Username: @${userData.username || 'не указан'}
• Время подачи: ${new Date().toLocaleString('ru-RU')}

⏳ Ваша заявка находится на рассмотрении.
Мы уведомим вас о решении в течение 24 часов.

🎁 **Преимущества раннего доступа:**
• Скидка 20% на все билеты
• Доступ за 24 часа до официальных продаж
• Лучшие места в зале
• Эксклюзивный мерч

Следите за обновлениями! 🚀
        `);
        
        // Уведомляем администраторов
        notifyAdmins(userData);
    }
}

// Уведомление администраторов
function notifyAdmins(newUser) {
    const adminIds = ['YOUR_ADMIN_ID']; // Замените на ID администраторов
    
    const message = `
🆕 НОВАЯ ЗАЯВКА НА РАННИЙ ДОСТУП!

👤 Пользователь: ${newUser.firstName} ${newUser.lastName || ''}
🆔 ID: ${newUser.id}
👤 Username: @${newUser.username || 'не указан'}
⏰ Время: ${new Date().toLocaleString('ru-RU')}

Всего заявок: ${earlyAccessUsers.length}
    `;
    
    adminIds.forEach(adminId => {
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
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = message.chat.id;
    
    if (data === 'get_early_access') {
        bot.answerCallbackQuery(callbackQuery.id, {
            text: 'Перейдите на сайт и заполните форму!',
            show_alert: true
        });
        
        bot.sendMessage(chatId, `
🎫 Для получения раннего доступа:

1. Перейдите на сайт: https://your-domain.com
2. Заполните форму "Ранний доступ к билетам"
3. Вы будете автоматически перенаправлены в этого бота
4. Получите приглашение в группу ожидания

🚀 Удачи в получении лучших билетов!
        `);
    }
    
    // Обработка одобрения/отклонения
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
                text: 'Пользователь одобрен и добавлен в группу!',
                show_alert: true
            });
            
            // Уведомляем пользователя
            bot.sendMessage(userId, `
🎉 Поздравляем! Ваша заявка одобрена!

✅ Вы получили ранний доступ к билетам Dominic Joker!

🎁 Ваши преимущества:
• Скидка 20% на все билеты
• Доступ за 24 часа до официальных продаж
• Лучшие места в зале
• Эксклюзивный мерч

🚀 Продажи начнутся 31 октября 2025 в 00:00 (корейское время)

Добро пожаловать в группу ожидания! 🎫
            `);
            
        }).catch(error => {
            console.error('Ошибка при добавлении в группу:', error);
            bot.answerCallbackQuery(callbackQueryId, {
                text: 'Ошибка при добавлении в группу',
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
            text: 'Пользователь отклонен',
            show_alert: true
        });
        
        // Уведомляем пользователя
        bot.sendMessage(userId, `
❌ К сожалению, ваша заявка на ранний доступ была отклонена.

Возможные причины:
• Превышен лимит участников (100 человек)
• Неполные данные
• Технические ограничения

Вы все еще можете купить билеты в обычном порядке с 1 ноября 2025.

Спасибо за интерес к концерту Dominic Joker! 🎭
        `);
    }
}

// Команда /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId, `
🤖 **Помощь по боту Dominic Joker**

**Основные команды:**
/start - Начать работу с ботом
/early_access - Получить ранний доступ к билетам
/status - Проверить статус заявки
/help - Показать эту справку

**Как получить ранний доступ:**
1. Заполните форму на сайте
2. Получите приглашение в группу ожидания
3. Будьте первыми на покупке билетов!

**Преимущества раннего доступа:**
• Скидка 20% на все билеты
• Доступ за 24 часа до официальных продаж
• Лучшие места в зале
• Эксклюзивный мерч

**Контакты:**
📧 Email: info@dominickjoker.kr
📱 Телефон: +82-2-1234-5678

🎭 Увидимся на концерте 14 февраля 2026 в Сеуле!
    `);
});

// Команда /status
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    const user = earlyAccessUsers.find(u => u.id == userId);
    
    if (user) {
        let statusText = '';
        switch (user.status) {
            case 'pending':
                statusText = '⏳ Ожидает одобрения';
                break;
            case 'approved':
                statusText = '✅ Одобрен';
                break;
            case 'rejected':
                statusText = '❌ Отклонен';
                break;
        }
        
        bot.sendMessage(chatId, `
📊 **Статус вашей заявки**

👤 Пользователь: ${user.firstName} ${user.lastName || ''}
📅 Подана: ${new Date(user.joinedAt).toLocaleString('ru-RU')}
📈 Статус: ${statusText}

${user.status === 'approved' ? 
    '🎉 Поздравляем! Вы получили ранний доступ!' : 
    user.status === 'pending' ? 
    '⏳ Ваша заявка рассматривается. Мы уведомим вас о решении.' :
    '❌ К сожалению, ваша заявка была отклонена.'}
        `);
    } else {
        bot.sendMessage(chatId, `
❌ Вы еще не подавали заявку на ранний доступ.

Для подачи заявки:
1. Перейдите на сайт
2. Заполните форму "Ранний доступ к билетам"
3. Следуйте инструкциям
        `);
    }
});

console.log('🤖 Бот Dominic Joker запущен!');
```

## 📦 Установка и запуск

1. **Установите зависимости:**
```bash
npm init -y
npm install node-telegram-bot-api
```

2. **Настройте переменные:**
- Замените `YOUR_BOT_TOKEN` на токен вашего бота
- Замените `YOUR_GROUP_ID` на ID группы ожидания
- Замените `YOUR_ADMIN_ID` на ID администраторов

3. **Запустите бота:**
```bash
node bot.js
```

## 🔧 Интеграция с лендингом

В файле `script.js` замените:

```javascript
const botUsername = 'DominicJokerBot'; // Ваш username бота
```

## 📊 Мониторинг

Бот автоматически сохраняет данные пользователей в файл `users.json`:

```json
[
  {
    "id": 123456789,
    "username": "username",
    "firstName": "Имя",
    "lastName": "Фамилия",
    "joinedAt": "2025-09-30T11:00:00.000Z",
    "status": "approved",
    "approvedAt": "2025-09-30T11:05:00.000Z"
  }
]
```

## 🎯 Результат

После настройки у вас будет:

1. ✅ **Форма на лендинге** для сбора заявок
2. ✅ **Telegram бот** для обработки пользователей  
3. ✅ **Группа ожидания** для раннего доступа
4. ✅ **Автоматическое одобрение** и добавление в группу
5. ✅ **Уведомления** о статусе заявки

## 🚀 Дополнительные возможности

- **Webhook интеграция** для мгновенных уведомлений
- **База данных** для хранения пользователей
- **Аналитика** по конверсии воронки
- **A/B тестирование** разных вариантов формы
- **Email уведомления** в дополнение к Telegram

---

**Готово! Ваша воронка раннего доступа к билетам настроена! 🎫✨**
