# 生产环境部署配置

## 一、安全配置

### 1. 更新frpc.toml中的安全配置
```toml
# 请修改以下配置
serverAddr = "你的Linode服务器IP"  # 替换为实际IP
auth.token = "生成一个强密码"  # 使用强密码，例如: openssl rand -base64 32
customDomains = ["storyboard.你的域名.com"]  # 如果有域名
```

### 2. 环境变量安全
创建生产环境变量文件 `.env.production.local`:
```bash
# API密钥（生产环境）
GEMINI_API_KEY=你的生产环境API密钥
NOTION_API_KEY=你的生产环境Notion密钥
NOTION_DATABASE_ID=你的生产环境数据库ID

# 应用配置
NEXT_PUBLIC_APP_NAME=跨海帆-速分镜

# 安全配置
NEXT_PUBLIC_API_URL=https://storyboard.你的域名.com
```

### 3. Next.js生产构建
```bash
# 构建生产版本
npm run build

# 使用PM2运行（推荐）
npm install -g pm2
pm2 start npm --name "storyboard" -- start
pm2 save
pm2 startup
```

## 二、Nginx配置（可选，用于HTTPS）

如果你的Linode服务器安装了Nginx，可以配置反向代理和SSL：

### 1. 安装Nginx和Certbot
```bash
apt update
apt install nginx certbot python3-certbot-nginx
```

### 2. 创建Nginx配置
```nginx
# /etc/nginx/sites-available/storyboard
server {
    listen 80;
    server_name storyboard.你的域名.com;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 3. 配置SSL证书
```bash
# 启用站点
ln -s /etc/nginx/sites-available/storyboard /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 获取SSL证书
certbot --nginx -d storyboard.你的域名.com
```

## 三、监控和日志

### 1. 查看frps日志
```bash
# 服务器端
tail -f /opt/frp/frps.log
journalctl -u frps -f
```

### 2. 查看frpc日志
```bash
# 本地客户端
tail -f ./deploy/frpc.log
```

### 3. 监控服务状态
```bash
# 服务器端
systemctl status frps

# 查看连接状态（Dashboard）
# 访问: http://你的服务器IP:7500
# 用户名: admin
# 密码: 你设置的密码
```

## 四、故障排查

### 常见问题

1. **连接失败**
   - 检查防火墙端口是否开放
   - 确认token是否一致
   - 检查服务器IP是否正确

2. **访问404**
   - 确认Next.js应用是否正常运行
   - 检查frpc配置的localPort是否正确
   - 查看frpc日志是否有错误

3. **性能问题**
   - 考虑使用CDN加速静态资源
   - 启用gzip压缩
   - 优化图片和资源加载

## 五、备份和恢复

### 1. 备份配置
```bash
# 创建备份目录
mkdir -p ~/backups/storyboard

# 备份配置文件
cp /opt/frp/frps.toml ~/backups/storyboard/
cp ./deploy/frpc.toml ~/backups/storyboard/
cp .env.local ~/backups/storyboard/
```

### 2. 数据库备份（Notion）
由于数据存储在Notion，确保：
- 定期导出Notion数据库
- 保留API密钥的安全备份

## 六、性能优化

### 1. 启用压缩
在frps.toml中添加：
```toml
transport.tcpMux = true
transport.tcpMuxKeepaliveInterval = 30
```

### 2. 连接池配置
```toml
transport.poolCount = 5
```

### 3. 带宽限制（如需要）
```toml
# 限制单个代理的带宽
bandwidthLimit = "1MB"
```

## 七、安全最佳实践

1. **定期更新**
   - 定期更新frp到最新版本
   - 保持系统和依赖包更新

2. **访问控制**
   - 使用强密码
   - 限制Dashboard访问IP
   - 考虑使用VPN额外保护

3. **监控告警**
   - 设置异常流量告警
   - 监控服务器资源使用
   - 定期检查访问日志

4. **备份策略**
   - 定期备份配置
   - 保留多个版本的备份
   - 测试恢复流程