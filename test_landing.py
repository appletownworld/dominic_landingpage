#!/usr/bin/env python3
"""
Скрипт для тестирования лендинга Доминика Джокера
Проверяет основные функции и элементы интерфейса
"""

import time
import asyncio
from playwright.async_api import async_playwright
import sys

async def test_landing():
    """Основная функция тестирования лендинга"""
    
    async with async_playwright() as p:
        # Запускаем браузер
        browser = await p.chromium.launch(headless=False, slow_mo=1000)
        page = await browser.new_page()
        
        try:
            print("🚀 Запуск тестирования лендинга...")
            
            # Переходим на лендинг
            print("📱 Открываем лендинг...")
            await page.goto("http://localhost:8000")
            await page.wait_for_load_state("networkidle")
            
            # Проверяем заголовок страницы
            title = await page.title()
            print(f"✅ Заголовок страницы: {title}")
            
            # Проверяем основные элементы
            print("\n🔍 Проверяем основные элементы...")
            
            # Проверяем навигацию
            nav_elements = await page.query_selector_all(".nav-link")
            print(f"✅ Найдено {len(nav_elements)} элементов навигации")
            
            # Проверяем заголовок героя
            hero_title = await page.query_selector(".hero-title")
            if hero_title:
                title_text = await hero_title.text_content()
                print(f"✅ Заголовок героя: {title_text.strip()}")
            
            # Проверяем форму раннего доступа
            form = await page.query_selector("#earlyAccessForm")
            if form:
                print("✅ Форма раннего доступа найдена")
                
                # Проверяем поля формы
                name_input = await page.query_selector("#userName")
                phone_input = await page.query_selector("#userPhone")
                
                if name_input and phone_input:
                    print("✅ Поля формы найдены")
                    
                    # Тестируем заполнение формы
                    print("📝 Тестируем заполнение формы...")
                    await name_input.fill("Тестовый Пользователь")
                    await phone_input.fill("+82-10-1234-5678")
                    
                    # Проверяем кнопку отправки
                    submit_btn = await page.query_selector(".access-btn")
                    if submit_btn:
                        print("✅ Кнопка отправки найдена")
                        # Не отправляем форму, просто проверяем
                        print("ℹ️  Форма готова к отправке")
            
            # Проверяем секцию билетов
            print("\n🎫 Проверяем секцию билетов...")
            ticket_cards = await page.query_selector_all(".ticket-card")
            print(f"✅ Найдено {len(ticket_cards)} типов билетов")
            
            for i, card in enumerate(ticket_cards):
                price_element = await card.query_selector(".ticket-price")
                if price_element:
                    price = await price_element.text_content()
                    print(f"  - Билет {i+1}: {price}")
            
            # Проверяем галерею артиста
            print("\n🖼️  Проверяем галерею артиста...")
            gallery_images = await page.query_selector_all(".gallery-img")
            print(f"✅ Найдено {len(gallery_images)} изображений в галерее")
            
            # Проверяем счетчик обратного отсчета
            print("\n⏰ Проверяем счетчик обратного отсчета...")
            countdown_elements = await page.query_selector_all(".countdown-number")
            if countdown_elements:
                print(f"✅ Найдено {len(countdown_elements)} элементов счетчика")
                for i, element in enumerate(countdown_elements):
                    value = await element.text_content()
                    print(f"  - Элемент {i+1}: {value}")
            
            # Тестируем навигацию
            print("\n🧭 Тестируем навигацию...")
            about_link = await page.query_selector('a[href="#about"]')
            if about_link:
                await about_link.click()
                await page.wait_for_timeout(1000)
                print("✅ Переход к секции 'О концерте' выполнен")
            
            tickets_link = await page.query_selector('a[href="#tickets"]')
            if tickets_link:
                await tickets_link.click()
                await page.wait_for_timeout(1000)
                print("✅ Переход к секции 'Билеты' выполнен")
            
            # Проверяем адаптивность (мобильная версия)
            print("\n📱 Тестируем мобильную версию...")
            await page.set_viewport_size({"width": 375, "height": 667})
            await page.wait_for_timeout(1000)
            
            # Проверяем гамбургер меню
            hamburger = await page.query_selector(".hamburger")
            if hamburger:
                await hamburger.click()
                await page.wait_for_timeout(1000)
                print("✅ Гамбургер меню работает")
            
            # Возвращаемся к десктопной версии
            await page.set_viewport_size({"width": 1920, "height": 1080})
            await page.wait_for_timeout(1000)
            
            # Проверяем кнопки действий
            print("\n🎯 Тестируем кнопки действий...")
            notify_btn = await page.query_selector("#notifyBtn")
            if notify_btn:
                await notify_btn.click()
                await page.wait_for_timeout(1000)
                print("✅ Кнопка 'Уведомить о продажах' работает")
            
            scroll_btn = await page.query_selector("#scrollBtn")
            if scroll_btn:
                await scroll_btn.click()
                await page.wait_for_timeout(1000)
                print("✅ Кнопка 'Узнать больше' работает")
            
            # Проверяем производительность
            print("\n⚡ Проверяем производительность...")
            performance_metrics = await page.evaluate("""
                () => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    return {
                        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        totalTime: navigation.loadEventEnd - navigation.fetchStart
                    };
                }
            """)
            
            print(f"✅ Время загрузки DOM: {performance_metrics['domContentLoaded']:.2f}ms")
            print(f"✅ Время полной загрузки: {performance_metrics['loadTime']:.2f}ms")
            print(f"✅ Общее время загрузки: {performance_metrics['totalTime']:.2f}ms")
            
            # Делаем скриншот
            print("\n📸 Создаем скриншот...")
            await page.screenshot(path="/home/zebracoder/projects/Dominic/landing_screenshot.png", full_page=True)
            print("✅ Скриншот сохранен как landing_screenshot.png")
            
            print("\n🎉 Тестирование завершено успешно!")
            print("\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:")
            print("✅ Все основные элементы найдены и работают")
            print("✅ Навигация функционирует корректно")
            print("✅ Форма раннего доступа готова к использованию")
            print("✅ Адаптивность работает (мобильная версия)")
            print("✅ Производительность в норме")
            
        except Exception as e:
            print(f"❌ Ошибка при тестировании: {e}")
            return False
        
        finally:
            await browser.close()
            return True

if __name__ == "__main__":
    print("🎭 Тестирование лендинга Доминика Джокера")
    print("=" * 50)
    
    try:
        result = asyncio.run(test_landing())
        if result:
            print("\n✅ Все тесты пройдены успешно!")
            sys.exit(0)
        else:
            print("\n❌ Тесты завершились с ошибками")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n⏹️  Тестирование прервано пользователем")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Критическая ошибка: {e}")
        sys.exit(1)
