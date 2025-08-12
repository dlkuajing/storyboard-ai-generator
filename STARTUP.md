# 🚀 项目启动指南

## 快速启动

### 方法1：使用quick.sh脚本（推荐）
```bash
# 进入项目目录
cd /Users/c.joelin/Desktop/跨海帆-速分镜/storyboard-ai/storyboard-generator

# 启动所有服务
./quick.sh start

# 停止所有服务
./quick.sh stop

# 重启所有服务
./quick.sh restart

# 查看服务状态
./quick.sh status
```

### 方法2：使用npm命令
```bash
# 仅启动本地开发
npm run dev

# 启动所有服务（包括FRP）
npm run start-all

# 停止所有服务
npm run stop-all

# 查看状态
npm run status
```

### 方法3：分步启动
```bash
# 1. 启动Next.js
npm run dev

# 2. 启动FRP（新终端）
cd deploy
./restart-all.sh
```

## 环境配置

### 本地开发（无需配置）
直接运行 `npm run dev` 即可，访问 http://localhost:3000

### 公网访问（需要FRP）
1. 设置SSH密码环境变量：
```bash
export SSH_PASSWORD=你的实际SSH密码
```

2. 启动所有服务：
```bash
./quick.sh start
```

3. 访问地址：
- 本地: http://localhost:3000
- 公网: http://172.104.59.98:4001

## 服务管理命令对照表

| 功能 | quick.sh | npm命令 | 直接脚本 |
|------|----------|---------|----------|
| 启动所有 | `./quick.sh start` | `npm run start-all` | `./start-all.sh` |
| 停止所有 | `./quick.sh stop` | `npm run stop-all` | `./stop-all.sh` |
| 重启服务 | `./quick.sh restart` | `npm run restart` | 先stop后start |
| 查看状态 | `./quick.sh status` | `npm run status` | `ps aux | grep -E 'next|frp'` |
| 仅本地开发 | - | `npm run dev` | - |

## 常见问题

### Q: 如何只启动本地开发环境？
A: 运行 `npm run dev`，不需要FRP和SSH密码

### Q: 提示SSH_PASSWORD未设置？
A: 如果只需要本地开发，选择y继续；如果需要公网访问，先设置：
```bash
export SSH_PASSWORD=你的密码
```

### Q: 端口3000被占用？
A: 脚本会自动尝试关闭占用的进程，或手动执行：
```bash
lsof -i :3000
kill <PID>
```

### Q: 如何查看日志？
A: 
- Next.js日志：`tail -f next.log`
- FRP日志：`tail -f frpc.log`
- 实时日志：启动时会自动显示

### Q: 服务在后台运行如何管理？
A: 使用 `./quick.sh status` 查看状态，`./quick.sh stop` 停止服务

## 推荐工作流

### 日常开发
```bash
# 早上开始工作
./quick.sh start

# 查看状态
./quick.sh status

# 晚上下班
./quick.sh stop
```

### 仅本地测试
```bash
npm run dev
# Ctrl+C 退出
```

### 演示给客户
```bash
# 设置SSH密码
export SSH_PASSWORD=你的密码

# 启动完整服务
./quick.sh start

# 分享链接：http://172.104.59.98:4001
```

## 文件说明

- `quick.sh` - 统一管理脚本（推荐使用）
- `start-all.sh` - 启动所有服务
- `stop-all.sh` - 停止所有服务
- `.services.pid` - 自动生成的进程信息文件
- `next.log` - Next.js运行日志
- `frpc.log` - FRP客户端日志