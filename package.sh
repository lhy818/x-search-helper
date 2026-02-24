#!/bin/bash

# X Search Helper 打包脚本

echo "🚀 X Search Helper 打包工具"
echo "=============================="

# 检查必要文件
check_files() {
    echo "📁 检查项目文件..."
    
    required_files=(
        "manifest.json"
        "popup.html"
        "popup.css"
        "popup.js"
        "content.js"
        "content.css"
        "README.md"
    )
    
    missing_files=()
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        echo "❌ 缺少以下文件："
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
        return 1
    fi
    
    echo "✅ 所有必要文件都存在"
    return 0
}

# 创建临时图标（如果不存在）
create_temp_icons() {
    echo "🎨 检查图标文件..."
    
    if [ ! -f "icons/icon16.png" ]; then
        echo "⚠️  创建临时图标..."
        
        # 创建简单的 SVG 图标
        cat > icons/temp_icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#667eea"/>
      <stop offset="100%" stop-color="#764ba2"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="20" fill="url(#gradient)"/>
  <circle cx="64" cy="64" r="40" fill="none" stroke="white" stroke-width="8"/>
  <line x1="90" y1="90" x2="110" y2="110" stroke="white" stroke-width="8" stroke-linecap="round"/>
</svg>
EOF
        
        # 使用 ImageMagick 转换（如果可用）
        if command -v convert &> /dev/null; then
            convert -background none icons/temp_icon.svg -resize 16x16 icons/icon16.png
            convert -background none icons/temp_icon.svg -resize 48x48 icons/icon48.png
            convert -background none icons/temp_icon.svg -resize 128x128 icons/icon128.png
            rm icons/temp_icon.svg
            echo "✅ 临时图标已创建"
        else
            echo "⚠️  ImageMagick 未安装，请手动创建图标文件"
            echo "    icons/icon16.png (16x16)"
            echo "    icons/icon48.png (48x48)"
            echo "    icons/icon128.png (128x128)"
        fi
    else
        echo "✅ 图标文件已存在"
    fi
}

# 打包扩展
package_extension() {
    echo "📦 打包扩展..."
    
    # 创建打包目录
    mkdir -p dist
    
    # 复制所有文件到 dist 目录
    cp -r *.json *.html *.css *.js *.md icons/ dist/ 2>/dev/null || true
    
    # 创建 ZIP 文件
    cd dist
    zip -r ../x-search-helper.zip ./*
    cd ..
    
    echo "✅ 扩展已打包为 x-search-helper.zip"
}

# 验证 manifest.json
validate_manifest() {
    echo "🔍 验证 manifest.json..."
    
    if ! python3 -c "
import json
try:
    with open('manifest.json', 'r') as f:
        data = json.load(f)
    
    required_fields = ['manifest_version', 'name', 'version', 'description']
    for field in required_fields:
        if field not in data:
            print(f'❌ 缺少必要字段: {field}')
            exit(1)
    
    if data.get('manifest_version') != 3:
        print('❌ manifest_version 必须为 3')
        exit(1)
    
    print('✅ manifest.json 验证通过')
except Exception as e:
    print(f'❌ 解析 manifest.json 失败: {e}')
    exit(1)
" 2>/dev/null; then
        echo "❌ manifest.json 验证失败"
        return 1
    fi
    return 0
}

# 显示安装说明
show_instructions() {
    echo ""
    echo "📋 安装说明"
    echo "============"
    echo ""
    echo "1. 打开 Chrome 浏览器"
    echo "2. 进入 chrome://extensions/"
    echo "3. 开启右上角的'开发者模式'"
    echo "4. 点击'加载已解压的扩展程序'"
    echo "5. 选择本项目文件夹"
    echo ""
    echo "📦 或者使用打包文件："
    echo "   x-search-helper.zip"
    echo ""
    echo "🔧 开发模式："
    echo "   直接加载项目文件夹即可"
    echo ""
    echo "🎯 使用提示："
    echo "   - 打开 X/Twitter 网站"
    echo "   - 点击扩展图标选择模板"
    echo "   - 在搜索结果页面选择'Latest'"
}

# 主函数
main() {
    echo ""
    
    # 检查文件
    if ! check_files; then
        exit 1
    fi
    
    # 验证 manifest
    if ! validate_manifest; then
        exit 1
    fi
    
    # 创建临时图标
    create_temp_icons
    
    # 打包扩展
    package_extension
    
    # 显示安装说明
    show_instructions
    
    echo ""
    echo "🎉 完成！"
}

# 运行主函数
main