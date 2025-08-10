# 智能分镜脚本生成器

基于 Google Gemini AI 的智能分镜脚本生成工具，专为短视频创作者设计，融合病毒营销策略。

## 功能特点

- 🎬 **智能分镜生成**：根据文案自动生成专业分镜脚本
- 🚀 **病毒营销策略**：内置短视频病毒传播规律
- 📊 **Notion 集成**：一键导出分镜到 Notion 表格
- 🎨 **多风格支持**：剧情、喜剧、纪录片、广告等多种风格
- 📱 **多平台优化**：针对抖音、小红书、YouTube、B站等平台特性

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填写以下配置：

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Notion API (可选)
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

### 3. 获取 API Keys

#### Google Gemini API Key
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的 API Key
3. 复制并填入 `.env.local`

#### Notion API 配置
1. 访问 [Notion Developers](https://www.notion.so/my-integrations)
2. 创建新的 Integration
3. 复制 Internal Integration Token 作为 NOTION_API_KEY
4. 在 Notion 中创建一个数据库页面
5. 将 Integration 连接到该页面
6. 复制数据库 ID（URL 中的32位字符串）

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 使用指南

1. **输入文案**：在左侧输入框输入你的短视频文案
2. **选择参数**：
   - 风格类型（剧情/喜剧/纪录片等）
   - 投放平台（抖音/小红书/YouTube等）
   - 目标时长（15-300秒）
   - 目标受众
3. **生成分镜**：点击"生成分镜"按钮
4. **查看结果**：右侧显示生成的分镜脚本，包括：
   - 每个镜头的详细信息
   - 病毒营销策略分析
   - 情绪曲线设计
5. **导出 Notion**：点击"导出到Notion"保存到你的 Notion 数据库

## 分镜脚本结构

每个镜头包含：
- 镜头编号和时长
- 景别（特写/近景/中景/全景/远景）
- 画面描述
- 台词/旁白
- 摄像机运动
- 灯光要点
- 营销策略点
- 情绪曲线

## 病毒营销策略

系统会自动分析并优化：
- **开场钩子**：前3秒黄金时间
- **情绪高潮点**：多个情绪峰值设计
- **互动诱导**：评论、分享引导点
- **视觉记忆**：独特的视觉符号

## 技术栈

- **前端**：Next.js 14 + TypeScript + TailwindCSS
- **AI**：Google Gemini 2.0 Flash
- **集成**：Notion API
- **UI**：Lucide Icons + React Hot Toast

## 部署

### Vercel 部署（推荐）

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### 自托管

```bash
npm run build
npm start
```

## 注意事项

- 确保 API Key 安全，不要提交到公开仓库
- Notion 数据库需要正确的权限设置
- 建议使用 HTTPS 部署生产环境

## License

MIT