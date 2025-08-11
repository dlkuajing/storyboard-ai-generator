# 跨海帆-速分镜 项目说明

## 项目概述
这是一个基于AI的短视频分镜脚本生成工具，可以根据用户提供的旁白文案自动生成专业的分镜脚本。

## 核心功能
- 🎬 **智能分镜生成**: 基于Google Gemini 2.5 Pro模型，自动将旁白文案拆分成多个镜头
- 📝 **Notion导出**: 支持将生成的分镜脚本导出到Notion进行团队协作
- 🎯 **病毒营销策略**: 自动分析并生成开场钩子、情绪高潮点、互动诱导点等营销要素
- 🌐 **公网访问**: 通过FRP隧道实现公网访问，支持全球用户使用

## 技术栈
- **前端**: Next.js 15.4.6, React, TypeScript, TailwindCSS v3
- **AI服务**: Google Gemini 2.5 Pro API
- **数据存储**: Notion API
- **部署**: FRP隧道 + Linode服务器

## 项目结构
```
storyboard-generator/
├── app/                    # Next.js应用目录
│   ├── page.tsx           # 主页面
│   ├── layout.tsx         # 布局文件
│   └── api/               # API路由
│       ├── generate/      # 分镜生成API
│       └── export-notion/ # Notion导出API
├── components/            # React组件
│   ├── ShotCard.tsx      # 镜头卡片组件
│   ├── ViralStrategy.tsx # 营销策略组件
│   └── ...               # 其他UI组件
├── lib/                   # 核心库
│   ├── types.ts          # TypeScript类型定义
│   └── services/         # 服务层
│       ├── gemini.ts     # Gemini AI服务
│       └── notion.ts     # Notion API服务
└── deploy/               # 部署配置
    ├── frpc.toml        # FRP客户端配置
    └── *.sh             # 部署脚本
```

## 环境变量
```env
GEMINI_API_KEY=your_gemini_api_key_here
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
NEXT_PUBLIC_APP_NAME=跨海帆-速分镜
```

注意：实际的API密钥保存在 `.env.local` 文件中，不要提交到版本控制。

## 访问地址
- **公网访问**: http://172.104.59.98:4001
- **本地开发**: http://localhost:3000

## FRP配置
- **服务器IP**: 172.104.59.98
- **FRP端口**: 7001
- **HTTP端口**: 7070
- **TCP端口**: 4001
- **Token**: storyboard_1754841832

## 常用命令

### 开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 部署
```bash
# 启动FRP隧道（需要先启动Next.js）
cd deploy
./restart-all.sh

# 或者分步执行
./frpc -c frpc-new.toml
```

### 维护
```bash
# 查看FRP状态
ps aux | grep frp

# 重启服务
cd deploy
./restart-all.sh

# 查看日志
tail -f frpc.log
```

## 工作流程
1. 用户输入旁白文案（最多500字）
2. 选择风格类型、投放平台、目标时长和受众
3. AI自动按标点符号拆分文案为多个镜头
4. 为每个镜头生成：
   - 画面描述
   - 镜头类型和运动
   - 灯光设置
   - 情绪曲线
   - 营销策略点
5. 可导出到Notion进行团队协作

## 注意事项
- Gemini API有请求限制，建议合理使用
- Notion导出需要确保数据库权限正确配置
- FRP隧道需要保持服务器端和客户端同时运行
- 建议使用PM2等工具管理Node.js进程

## 更新记录
- 2024-08-11: 初始版本发布
- 2024-08-11: 集成Gemini 2.5 Pro模型
- 2024-08-11: 添加FRP公网访问支持
- 2024-08-11: 优化UI界面和用户体验
- 2024-08-11: 修改HTTP端口从8080到7070避免冲突

## 联系方式
- GitHub: https://github.com/dlkuajing/storyboard-ai-generator
- 问题反馈: 请在GitHub提交Issue

## License
MIT