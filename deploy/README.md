# 🚀 跨海帆-速分镜 公网部署指南

使用FRP将本地的分镜脚本生成工具发布到互联网，让全球用户都能访问。

## 📋 前置要求

- ✅ 一台Linode服务器（或其他VPS）
- ✅ 服务器具有公网IP
- ✅ 本地安装Node.js 18+
- ✅ 基本的Linux命令行知识

## 🎯 快速开始

### 步骤1: 服务器端设置

SSH连接到你的Linode服务器，执行以下命令：

```bash
# 快速安装脚本
curl -sSL https://raw.githubusercontent.com/dlkuajing/storyboard-ai-generator/main/deploy/server-install.sh | bash
```

或者手动安装：

```bash
# 1. 下载frp
cd /opt
wget https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_linux_amd64.tar.gz
tar -xzf frp_0.60.0_linux_amd64.tar.gz
mv frp_0.60.0_linux_amd64 frp

# 2. 配置frps
cat > /opt/frp/frps.toml << EOF
bindPort = 7000
vhostHTTPPort = 80
auth.method = "token"
auth.token = "设置一个安全的密码"
EOF

# 3. 启动服务
cd /opt/frp
./frps -c frps.toml
```

### 步骤2: 本地客户端配置

1. **编辑配置文件** `deploy/frpc.toml`:
```toml
serverAddr = "你的Linode服务器IP"  # 👈 修改这里
serverPort = 7000
auth.token = "与服务器相同的密码"   # 👈 修改这里
```

2. **启动服务**:
```bash
cd deploy
chmod +x quick-start.sh
./quick-start.sh
```

### 步骤3: 访问你的应用

打开浏览器访问:
- 🌐 `http://你的服务器IP:3001`
- 🌐 `http://storyboard.你的服务器IP.nip.io`

## 📁 文件说明

```
deploy/
├── README.md              # 本文档
├── frpc.toml             # FRP客户端配置
├── quick-start.sh        # 快速启动脚本
├── start-tunnel.sh       # 详细启动脚本
├── frp-setup.md          # 完整配置指南
└── production-setup.md   # 生产环境部署指南
```

## 🔧 配置选项

### 基础配置
| 配置项 | 说明 | 示例 |
|--------|------|------|
| serverAddr | Linode服务器IP | 139.144.xxx.xxx |
| auth.token | 认证密码 | MySecureToken123 |
| localPort | 本地端口 | 3000 |
| remotePort | 远程端口 | 3001 |

### 高级配置

#### 使用自定义域名
如果你有域名，可以配置：
```toml
customDomains = ["storyboard.example.com"]
```

#### 启用HTTPS
参考 `production-setup.md` 配置Nginx和SSL证书。

## 🛠 常见问题

### 1. 连接失败
- 检查服务器防火墙是否开放端口7000
- 确认token在服务器和客户端一致
- 查看日志: `tail -f frpc.log`

### 2. 访问404错误
- 确认Next.js应用正在运行
- 检查端口配置是否正确
- 尝试本地访问 http://localhost:3000

### 3. 性能优化
- 使用 `npm run build` 构建生产版本
- 考虑使用PM2管理进程
- 启用gzip压缩

## 📊 监控

### 查看连接状态
```bash
# 服务器端
tail -f /opt/frp/frps.log

# 客户端
tail -f ./frpc.log
```

### Dashboard面板
访问 `http://服务器IP:7500` 查看FRP管理面板

## 🔒 安全建议

1. **使用强密码**: 生成随机token
```bash
openssl rand -base64 32
```

2. **限制访问**: 配置防火墙规则
```bash
ufw allow from 你的IP to any port 7500
```

3. **定期更新**: 保持FRP和系统更新

## 📝 命令速查

```bash
# 服务器端
systemctl start frps     # 启动服务
systemctl stop frps      # 停止服务
systemctl status frps    # 查看状态
journalctl -u frps -f    # 查看日志

# 客户端
./quick-start.sh         # 快速启动
./start-tunnel.sh        # 详细启动
pm2 start npm --name app -- start  # PM2管理
```

## 🤝 支持

遇到问题？
1. 查看 [完整配置指南](./frp-setup.md)
2. 查看 [生产环境指南](./production-setup.md)
3. 提交Issue: https://github.com/dlkuajing/storyboard-ai-generator/issues

## 📄 许可

本项目使用MIT许可证