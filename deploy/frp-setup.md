# FRP部署配置指南 - 跨海帆-速分镜

## 架构说明
```
[用户浏览器] -> [Linode服务器(frps)] -> [本地电脑(frpc)] -> [Next.js应用]
```

## 一、Linode服务器配置（frps服务端）

### 1. 连接到Linode服务器
```bash
ssh root@你的Linode服务器IP
```

### 2. 下载并安装frps
```bash
# 创建frp目录
mkdir -p /opt/frp
cd /opt/frp

# 下载最新版frp (根据服务器架构选择)
# AMD64架构
wget https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_linux_amd64.tar.gz

# 解压
tar -xzf frp_0.60.0_linux_amd64.tar.gz
mv frp_0.60.0_linux_amd64/* ./
rm -rf frp_0.60.0_linux_amd64*
```

### 3. 创建frps配置文件
```bash
cat > /opt/frp/frps.toml << 'EOF'
# frps.toml
bindPort = 7000
vhostHTTPPort = 80
vhostHTTPSPort = 443

# Dashboard配置（可选）
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "your_dashboard_password"

# 认证配置
auth.method = "token"
auth.token = "your_secure_token_here"

# 日志配置
log.to = "/opt/frp/frps.log"
log.level = "info"
log.maxDays = 7
EOF
```

### 4. 创建systemd服务
```bash
cat > /etc/systemd/system/frps.service << 'EOF'
[Unit]
Description=FRP Server Service
After=network.target

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5s
ExecStart=/opt/frp/frps -c /opt/frp/frps.toml
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
EOF
```

### 5. 启动frps服务
```bash
# 重载systemd
systemctl daemon-reload

# 启动服务
systemctl start frps

# 设置开机自启
systemctl enable frps

# 查看状态
systemctl status frps
```

### 6. 配置防火墙
```bash
# 开放必要端口
ufw allow 7000/tcp  # frp服务端口
ufw allow 80/tcp    # HTTP端口
ufw allow 443/tcp   # HTTPS端口
ufw allow 7500/tcp  # Dashboard端口（可选）
ufw allow 3000/tcp  # 直接访问端口（可选）
```

## 二、本地客户端配置（frpc）

### 1. 下载frpc客户端
根据你的操作系统下载对应版本：
- macOS: https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_darwin_amd64.tar.gz
- Windows: https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_windows_amd64.zip

### 2. 创建本地配置文件