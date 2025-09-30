#!/usr/bin/env python3
"""
Создает placeholder изображения для лендинга Доминик Джокер
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder_image(width, height, text, filename, bg_color=(255, 0, 110), text_color=(255, 255, 255)):
    """Создает placeholder изображение с текстом"""
    # Создаем изображение
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Пытаемся использовать системный шрифт
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    except:
        try:
            font = ImageFont.truetype("arial.ttf", 48)
        except:
            font = ImageFont.load_default()
    
    # Получаем размеры текста
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Центрируем текст
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Рисуем текст
    draw.text((x, y), text, fill=text_color, font=font)
    
    # Сохраняем изображение
    img.save(filename)
    print(f"Создано изображение: {filename}")

def main():
    # Создаем папку images если её нет
    os.makedirs('images', exist_ok=True)
    
    # Создаем placeholder изображения
    create_placeholder_image(800, 1200, "DOMINIC\nJOKER\nHERO", "images/artist-hero.jpg", (131, 56, 236))
    create_placeholder_image(600, 800, "DOMINIC\nJOKER\nMAIN", "images/artist-main.jpg", (58, 134, 255))
    create_placeholder_image(400, 400, "STYLE", "images/artist-style.jpg", (255, 215, 0))
    create_placeholder_image(400, 400, "PERFORMANCE", "images/artist-performance.jpg", (255, 0, 110))
    
    print("Все placeholder изображения созданы!")

if __name__ == "__main__":
    main()
