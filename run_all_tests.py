#!/usr/bin/env python3
"""
Автоматический запуск всех тестов лендинга
Запускает сервер, выполняет тесты и создает отчет
"""

import subprocess
import time
import os
import sys
import signal
from pathlib import Path

def start_server():
    """Запускает HTTP сервер"""
    print("🚀 Запускаем HTTP сервер...")
    try:
        # Запускаем сервер в фоне
        process = subprocess.Popen(
            ["python3", "-m", "http.server", "8000"],
            cwd="/home/zebracoder/projects/Dominic",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Ждем запуска сервера
        time.sleep(3)
        
        # Проверяем, что сервер запустился
        if process.poll() is None:
            print("✅ HTTP сервер запущен на порту 8000")
            return process
        else:
            print("❌ Ошибка запуска сервера")
            return None
            
    except Exception as e:
        print(f"❌ Ошибка запуска сервера: {e}")
        return None

def run_tests():
    """Запускает все тесты"""
    print("\n🧪 Запускаем тесты...")
    
    tests = [
        ("test_landing.py", "Основное тестирование"),
        ("simple_test.py", "Простое тестирование")
    ]
    
    results = []
    
    for test_file, description in tests:
        print(f"\n📋 {description}...")
        try:
            result = subprocess.run(
                ["python3", test_file],
                cwd="/home/zebracoder/projects/Dominic",
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                print(f"✅ {description} - УСПЕШНО")
                results.append((description, True, result.stdout))
            else:
                print(f"❌ {description} - ОШИБКА")
                results.append((description, False, result.stderr))
                
        except subprocess.TimeoutExpired:
            print(f"⏰ {description} - ТАЙМАУТ")
            results.append((description, False, "Таймаут выполнения"))
        except Exception as e:
            print(f"💥 {description} - КРИТИЧЕСКАЯ ОШИБКА: {e}")
            results.append((description, False, str(e)))
    
    return results

def create_final_report(results):
    """Создает финальный отчет"""
    print("\n📊 Создаем финальный отчет...")
    
    report_content = f"""# 🎭 ФИНАЛЬНЫЙ ОТЧЕТ ТЕСТИРОВАНИЯ ЛЕНДИНГА

## 📅 Дата: {time.strftime('%Y-%m-%d %H:%M:%S')}
## 🌐 URL: http://localhost:8000
## 🎯 Статус: {'✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ' if all(r[1] for r in results) else '❌ ЕСТЬ ОШИБКИ'}

## 📋 Результаты тестов:

"""
    
    for description, success, output in results:
        status = "✅ УСПЕШНО" if success else "❌ ОШИБКА"
        report_content += f"### {description}\n"
        report_content += f"**Статус**: {status}\n\n"
        
        if success:
            # Показываем только ключевые моменты из успешного вывода
            lines = output.split('\n')
            key_lines = [line for line in lines if '✅' in line or '🎉' in line or '📊' in line]
            if key_lines:
                report_content += "**Ключевые результаты**:\n"
                for line in key_lines[:10]:  # Показываем только первые 10
                    report_content += f"- {line}\n"
        else:
            report_content += f"**Ошибка**:\n```\n{output[:500]}...\n```\n"
        
        report_content += "\n---\n\n"
    
    # Добавляем информацию о файлах
    report_content += """## 📁 Созданные файлы:

- `landing_screenshot.png` - Скриншот лендинга
- `final_screenshot.png` - Финальный скриншот
- `TEST_REPORT.md` - Детальный отчет
- `FINAL_REPORT.md` - Этот финальный отчет

## 🎉 Заключение:

"""
    
    if all(r[1] for r in results):
        report_content += """✅ **ЛЕНДИНГ ПОЛНОСТЬЮ ГОТОВ К ИСПОЛЬЗОВАНИЮ!**

Все тесты пройдены успешно:
- ✅ Основные элементы работают
- ✅ Навигация функционирует
- ✅ Форма готова к использованию
- ✅ Адаптивность работает
- ✅ Производительность отличная

**Рекомендация**: Лендинг можно запускать в продакшен!
"""
    else:
        report_content += """❌ **ОБНАРУЖЕНЫ ПРОБЛЕМЫ**

Некоторые тесты завершились с ошибками. Рекомендуется:
1. Проверить логи ошибок выше
2. Исправить найденные проблемы
3. Повторить тестирование

**Рекомендация**: Исправить ошибки перед запуском в продакшен.
"""
    
    # Сохраняем отчет
    with open("/home/zebracoder/projects/Dominic/FINAL_REPORT.md", "w", encoding="utf-8") as f:
        f.write(report_content)
    
    print("✅ Финальный отчет создан: FINAL_REPORT.md")

def main():
    """Основная функция"""
    print("🎭 АВТОМАТИЧЕСКОЕ ТЕСТИРОВАНИЕ ЛЕНДИНГА ДОМИНИКА ДЖОКЕРА")
    print("=" * 60)
    
    server_process = None
    
    try:
        # Запускаем сервер
        server_process = start_server()
        if not server_process:
            print("❌ Не удалось запустить сервер. Завершаем.")
            return 1
        
        # Запускаем тесты
        results = run_tests()
        
        # Создаем отчет
        create_final_report(results)
        
        # Показываем итоги
        print("\n" + "=" * 60)
        print("🎉 ТЕСТИРОВАНИЕ ЗАВЕРШЕНО!")
        print("=" * 60)
        
        success_count = sum(1 for r in results if r[1])
        total_count = len(results)
        
        print(f"📊 Результат: {success_count}/{total_count} тестов пройдено")
        
        if success_count == total_count:
            print("✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!")
            print("🚀 Лендинг готов к использованию!")
            return 0
        else:
            print("❌ ЕСТЬ ПРОБЛЕМЫ!")
            print("🔧 Проверьте отчеты для деталей")
            return 1
            
    except KeyboardInterrupt:
        print("\n⏹️  Тестирование прервано пользователем")
        return 1
    except Exception as e:
        print(f"\n💥 Критическая ошибка: {e}")
        return 1
    finally:
        # Останавливаем сервер
        if server_process:
            print("\n🛑 Останавливаем сервер...")
            try:
                server_process.terminate()
                server_process.wait(timeout=5)
                print("✅ Сервер остановлен")
            except:
                server_process.kill()
                print("⚠️  Сервер принудительно остановлен")

if __name__ == "__main__":
    sys.exit(main())
