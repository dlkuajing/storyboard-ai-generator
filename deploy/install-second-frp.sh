#!/bin/bash

# 在服务器上安装第二个FRP实例
# 请在服务器上运行此脚本

echo "======================================"
echo "安装第二个FRP实例 - 跨海帆速分镜专用"
echo "======================================"

# 创建新目录
mkdir -p /opt/frp-storyboard
cd /opt/frp-storyboard

# 下载FRP
wget -q https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_linux_amd64.tar.gz
tar -xzf frp_0.60.0_linux_amd64.tar.gz
mv frp_0.60.0_linux_amd64/* ./
rm -rf frp_0.60.0_linux_amd64*

# 生成新token
NEW_TOKEN=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)

# 创建配置
cat > frps-storyboard.toml << EOF
# 跨海帆-速分镜专用FRP
bindPort = 7001  # 使用不同端口避免冲突
vhostHTTPPort = 7070  # HTTP端口
vhostHTTPSPort = 8443  # HTTPS端口

# 认证
auth.method = "token"
auth.token = "$NEW_TOKEN"

# Dashboard
webServer.addr = "0.0.0.0"
webServer.port = 7501
webServer.user = "admin"
webServer.password = "storyboard123"

# 日志
log.to = "./frps-storyboard.log"
log.level = "info"

# 允许的端口范围
allowPorts = [
  { start = 4000, end = 4100 }
]
EOF

# 创建systemd服务
cat > /etc/systemd/system/frps-storyboard.service << EOF
[Unit]
Description=FRP Server for Storyboard
After=network.target

[Service]
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=/opt/frp-storyboard/frps -c /opt/frp-storyboard/frps-storyboard.toml

[Install]
WantedBy=multi-user.target
EOF

# 开放防火墙端口
ufw allow 7001/tcp comment 'FRP Storyboard'
ufw allow 7070/tcp comment 'HTTP Storyboard'
ufw allow 7501/tcp comment 'Dashboard Storyboard'
ufw allow 4000:4100/tcp comment 'App Ports'

# 启动服务
systemctl daemon-reload
systemctl enable frps-storyboard
systemctl start frps-storyboard

echo ""
echo "======================================"
echo "✅ 安装完成！"
echo "======================================"
echo ""
echo "FRP端口: 7001"
echo "HTTP端口: 7070"
echo "Dashboard: http://172.104.59.98:7501"
echo "  用户名: admin"
echo "  密码: storyboard123"
echo ""
echo "Token: $NEW_TOKEN"
echo ""
echo "请在本地frpc.toml中使用："
echo "serverPort = 7001"
echo "auth.token = \"$NEW_TOKEN\""
echo "======================================"