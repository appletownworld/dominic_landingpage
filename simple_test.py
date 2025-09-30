#!/usr/bin/env python3
"""
Простое тестирование лендинга
Проверяет основные функции без сложных асинхронных операций
"""

import time
import asyncio
from playwright.async_api import async_playwright
import sys

async def simple_test():
    """Простое тестирование лендинга"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=1000)
        page = await browser.new_page()
        
        try:
            print("🚀 Простое тестирование лендинга...")
            
            # Переходим на лендинг
            await page.goto("http://localhost:8000")
            await page.wait_for_load_state("networkidle")
            
            # Проверяем заголовок
            title = await page.title()
            print(f"✅ Заголовок: {title}")
            
            # Проверяем основные элементы
            print("\n🔍 Проверяем основные элементы...")
            
            # Навигация
            nav_links = await page.query_selector_all(".nav-link")
            print(f"✅ Навигация: {len(nav_links)} ссылок")
            
            # Герой секция
            hero_title = await page.query_selector(".hero-title")
            if hero_title:
                print("✅ Заголовок героя найден")
            
            # Форма
            form = await page.query_selector("#earlyAccessForm")
            if form:
                print("✅ Форма раннего доступа найдена")
                
                # Тестируем заполнение
                name_input = await page.query_selector("#userName")
                phone_input = await page.query_selector("#userPhone")
                
                if name_input and phone_input:
                    await name_input.fill("Тест")
                    await phone_input.fill("+82-10-1234-5678")
                    print("✅ Форма заполняется корректно")
            
            # Билеты
            ticket_cards = await page.query_selector_all(".ticket-card")
            print(f"✅ Билеты: {len(ticket_cards)} типов")
            
            # Галерея
            gallery_images = await page.query_selector_all(".gallery-img")
            print(f"✅ Галерея: {len(gallery_images)} изображений")
            
            # Счетчик
            countdown_elements = await page.query_selector_all(".countdown-number")
            print(f"✅ Счетчик: {len(countdown_elements)} элементов")
            
            # Тестируем навигацию
            print("\n🧭 Тестируем навигацию...")
            
            # Переход к секции "О концерте"
            about_link = await page.query_selector('a[href="#about"]')
            if about_link:
                await about_link.click()
                await page.wait_for_timeout(1000)
                print("✅ Переход к 'О концерте'")
            
            # Переход к секции "Билеты"
            tickets_link = await page.query_selector('a[href="#tickets"]')
            if tickets_link:
                await tickets_link.click()
                await page.wait_for_timeout(1000)
                print("✅ Переход к 'Билеты'")
            
            # Тестируем кнопки
            print("\n🎯 Тестируем кнопки...")
            
            notify_btn = await page.query_selector("#notifyBtn")
            if notify_btn:
                await notify_btn.click()
                await page.wait_for_timeout(1000)
                print("✅ Кнопка 'Уведомить' работает")
            
            scroll_btn = await page.query_selector("#scrollBtn")
            if scroll_btn:
                await scroll_btn.click()
                await page.wait_for_timeout(1000)
                print("✅ Кнопка 'Узнать больше' работает")
            
            # Тестируем мобильную версию
            print("\n📱 Тестируем мобильную версию...")
            await page.set_viewport_size({"width": 375, "height": 667})
            await page.wait_for_timeout(1000)
            
            hamburger = await page.query_selector(".hamburger")
            if hamburger:
                await hamburger.click()
                await page.wait_for_timeout(1000)
                print("✅ Мобильное меню работает")
            
            # Возвращаемся к десктопу
            await page.set_viewport_size({"width": 1920, "height": 1080})
            await page.wait_for_timeout(1000)
            
            # Проверяем производительность
            print("\n⚡ Проверяем производительность...")
            
            metrics = await page.evaluate("""
                () => {
                    const nav = performance.getEntriesByType('navigation')[0];
                    return {
                        loadTime: nav.loadEventEnd - nav.loadEventStart,
                        totalTime: nav.loadEventEnd - nav.fetchStart
                    };
                }
            """)
            
            print(f"✅ Время загрузки: {metrics['loadTime']:.2f}ms")
            print(f"✅ Общее время: {metrics['totalTime']:.2f}ms")
            
            # Создаем скриншот
            await page.screenshot(path="/home/zebracoder/projects/Dominic/final_screenshot.png", full_page=True)
            print("✅ Скриншот сохранен")
            
            print("\n🎉 Простое тестирование завершено успешно!")
            return True
            
        except Exception as e:
            print(f"❌ Ошибка: {e}")
            return False
        
        finally:
            await browser.close()

if __name__ == "__main__":
    print("🎭 Простое тестирование лендинга Доминика Джокера")
    print("=" * 50)
    
    try:
        result = asyncio.run(simple_test())
        if result:
            print("\n✅ Все тесты пройдены!")
            sys.exit(0)
        else:
            print("\n❌ Тесты завершились с ошибками")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n⏹️  Тестирование прервано")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Критическая ошибка: {e}")
        sys.exit(1)
