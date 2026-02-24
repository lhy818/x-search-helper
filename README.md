# X Search Helper - Chrome 扩展

基于原帖"15条找爆款找深度内容的搜索词"开发的 Chrome 扩展，一键使用高级搜索模板，快速找到 X/Twitter 上的爆款内容。

## 功能特性

### 🚀 核心功能
- **15个精选搜索模板**：覆盖中文圈、日区、全球/美区
- **一键应用**：点击模板自动填充到 X 搜索框
- **自定义关键词**：在模板基础上添加个性化关键词
- **自定义模板**：保存自己的搜索模板
- **智能提示**：在搜索结果页面提示选择"Latest"筛选

### 📊 模板分类
1. **中文圈** (5个模板)
   - 4小时内高质量热议
   - 24小时万赞神贴
   - 中文AI圈爆款
   - 12小时带图热门
   - 高质量长贴原创

2. **日区** (5个模板)
   - 1小时刚起飞高赞贴
   - 4小时最高视觉内容
   - 社会民生槽点
   - 24小时二次元动向
   - 投资理财高质量讨论

3. **全球/美区** (5个模板)
   - 12小时AI顶级神贴
   - 4小时疯传高权重视频
   - 金融投资高赞观点
   - 4小时全球最火原创
   - 12小时英文技术干货

## 安装方法

### 开发模式安装
1. 下载或克隆本项目到本地
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目文件夹

### 生产环境安装
1. 打包扩展：`zip -r x-search-helper.zip .`
2. 在 Chrome 应用商店发布（需要开发者账号）

## 使用说明

### 基本使用
1. 打开 X/Twitter 网站
2. 点击扩展图标打开面板
3. 选择搜索模板分类（中文圈/日区/全球）
4. 点击模板卡片上的"使用"按钮
5. 模板会自动填充到搜索框并触发搜索
6. 在搜索结果页面选择"Latest"进行筛选

### 高级功能
- **自定义关键词**：在顶部的输入框中输入关键词，会替换模板中的"关键词"占位符
- **自定义模板**：在"自定义"标签页创建自己的搜索模板
- **模板管理**：可以保存、使用和删除自定义模板

## 项目结构

```
x-search-helper/
├── manifest.json          # 扩展配置文件
├── popup.html            # 弹出窗口HTML
├── popup.css             # 弹出窗口样式
├── popup.js              # 弹出窗口逻辑
├── content.js            # 内容脚本（注入到X页面）
├── content.css           # 内容样式
├── README.md             # 说明文档
└── icons/                # 扩展图标
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 技术实现

### 核心技术
- **Manifest V3**：最新的 Chrome 扩展规范
- **Content Script**：与 X/Twitter 页面交互
- **Chrome Storage API**：保存用户自定义模板
- **消息传递**：popup 与 content script 通信

### 搜索框识别
扩展支持多种 X/Twitter 搜索框选择器，包括：
- `input[data-testid="SearchBox_Search_Input"]`
- `input[aria-label="Search query"]`
- `input[placeholder*="Search"]`
- 以及其他备用选择器

### 兼容性
- Chrome 88+（支持 Manifest V3）
- X.com 和 Twitter.com 都支持
- 响应式设计，适配不同屏幕尺寸

## 开发指南

### 添加新模板
在 `popup.js` 的 `templates` 对象中添加新模板：

```javascript
{
  id: 'unique-id',
  name: '模板名称',
  query: '搜索语法',
  description: '模板描述'
}
```

### 修改样式
- 弹出窗口样式：`popup.css`
- 页面内样式：`content.css`
- 图标：`icons/` 目录下的 PNG 文件

### 调试
1. 打开 Chrome 开发者工具
2. 查看扩展的弹出窗口：右键点击扩展图标 → "检查弹出内容"
3. 查看内容脚本日志：在 X/Twitter 页面打开开发者工具

## 未来计划

### 功能增强
- [ ] 定时自动搜索
- [ ] 搜索结果聚合展示
- [ ] 模板分享功能
- [ ] 搜索历史记录
- [ ] 多语言界面支持

### 技术优化
- [ ] 改进搜索框识别算法
- [ ] 添加单元测试
- [ ] 性能优化
- [ ] 错误处理增强

## 贡献指南

1. Fork 本项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建 Pull Request

## 许可证

MIT License

## 致谢

感谢原帖作者提供的 15 个精选搜索模板，这些模板是扩展的核心价值所在。

---

**使用提示**：为了获得最佳效果，建议在搜索结果页面选择"Latest"排序，这样可以找到最新发布的内容。