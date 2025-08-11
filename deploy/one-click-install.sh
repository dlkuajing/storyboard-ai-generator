#!/bin/bash

# 一键安装脚本 - 在服务器上运行
# 使用: bash <(curl -s https://raw.githubusercontent.com/dlkuajing/storyboard-ai-generator/main/deploy/one-click-install.sh)

set -e

echo "======================================"
echo "跨海帆-速分镜 FRP一键安装"
echo "======================================"

# 生成随机token
TOKEN="sb_$(openssl rand -hex 8)"

# 创建目录
mkdir -p /opt/frp-storyboard
cd /opt/frp-storyboard

# 下载FRP
echo "下载FRP..."
wget -q --show-progress https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_linux_amd64.tar.gz
tar -xzf frp_0.60.0_linux_amd64.tar.gz
mv frp_0.60.0_linux_amd64/* ./
rm -rf frp_0.60.0_linux_amd64*

# 创建配置
cat > frps.toml << EOF
bindPort = 7001
vhostHTTPPort = 7070
auth.method = "token"
auth.token = "$TOKEN"
webServer.addr = "0.0.0.0"
webServer.port = 7501
webServer.user = "admin"
webServer.password = "sb2024"
log.to = "./frps.log"
EOF

# 创建服务
cat > /etc/systemd/system/frps-sb.service << EOF
[Unit]
Description=FRP Storyboard
After=network.target
[Service]
Type=simple
Restart=always
ExecStart=/opt/frp-storyboard/frps -c /opt/frp-storyboard/frps.toml
[Install]
WantedBy=multi-user.target
EOF

# 启动服务
systemctl daemon-reload
systemctl enable frps-sb
systemctl start frps-sb

# 生成客户端配置
cat > /tmp/frpc-client.toml << EOF
serverAddr = "172.104.59.98"
serverPort = 7001
auth.method = "token"
auth.token = "$TOKEN"
[[proxies]]
name = "storyboard"
type = "tcp"
localIP = "127.0.0.1"
localPort = 3000
remotePort = 8081
EOF

echo ""
echo "======================================"
echo "✅ 安装成功！"
echo "======================================"
echo ""
echo "📋 配置信息（请保存）："
echo "-----------------------------------"
echo "Token: $TOKEN"
echo "服务端口: 7001"
echo "Web访问: http://172.104.59.98:8081"
echo "Dashboard: http://172.104.59.98:7501"
echo "  用户: admin"
echo "  密码: sb2024"
echo "-----------------------------------"
echo ""
echo "客户端配置已保存到: /tmp/frpc-client.toml"
echo ""
echo "本地使用Token: $TOKEN"
echo "======================================"