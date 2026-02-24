#!/usr/bin/env python3
"""
X Search Helper 图标生成脚本
生成简单的渐变搜索图标
"""

from PIL import Image, ImageDraw
import os

def create_icon(size, output_path):
    """创建指定尺寸的图标"""
    # 创建新图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 计算渐变颜色
    def get_gradient_color(x, y):
        # 从紫色 (#667eea) 到深紫色 (#764ba2) 的渐变
        r1, g1, b1 = 102, 126, 234  # #667eea
        r2, g2, b2 = 118, 75, 162   # #764ba2
        
        # 对角线渐变
        progress = (x + y) / (size * 2)
        r = int(r1 + (r2 - r1) * progress)
        g = int(g1 + (g2 - g1) * progress)
        b = int(b1 + (b2 - b1) * progress)
        
        return (r, g, b, 255)
    
    # 绘制圆角矩形背景
    radius = size // 6
    draw.rounded_rectangle([(0, 0), (size-1, size-1)], radius, fill=(102, 126, 234, 255))
    
    # 绘制搜索图标
    center = size // 2
    search_radius = size // 3
    
    # 绘制搜索圈
    draw.ellipse(
        [(center - search_radius, center - search_radius),
         (center + search_radius, center + search_radius)],
        outline=(255, 255, 255, 255),
        width=max(2, size // 32)
    )
    
    # 绘制搜索柄
    handle_length = size // 4
    handle_start = center + int(search_radius * 0.7)
    handle_end = handle_start + handle_length
    
    draw.line(
        [(handle_start, handle_start), (handle_end, handle_end)],
        fill=(255, 255, 255, 255),
        width=max(2, size // 32)
    )
    
    # 保存图像
    img.save(output_path, 'PNG')
    print(f"✅ 创建图标: {output_path} ({size}x{size})")

def main():
    """主函数"""
    print("🎨 X Search Helper 图标生成器")
    print("==============================")
    
    # 确保 icons 目录存在
    os.makedirs('icons', exist_ok=True)
    
    # 创建不同尺寸的图标
    sizes = [
        (16, 'icons/icon16.png'),
        (48, 'icons/icon48.png'),
        (128, 'icons/icon128.png')
    ]
    
    for size, path in sizes:
        create_icon(size, path)
    
    print("\n🎉 所有图标已生成完成！")
    print("\n📁 图标文件位置:")
    print("  - icons/icon16.png  (16x16)")
    print("  - icons/icon48.png  (48x48)")
    print("  - icons/icon128.png (128x128)")

if __name__ == '__main__':
    main()