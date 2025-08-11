#!/bin/bash

# Linode服务器端FRP快速安装脚本
# 使用方法: curl -sSL [脚本URL] | bash

set -e

echo "=================================="
echo "FRP服务端安装脚本 - 跨海帆-速分镜"
echo "=================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}请使用root用户运行此脚本${NC}"
   echo "使用: sudo $0"
   exit 1
fi

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me)
echo -e "${GREEN}检测到服务器IP: $SERVER_IP${NC}"
echo ""

# 生成随机token
TOKEN=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
echo -e "${GREEN}生成安全Token: $TOKEN${NC}"
echo -e "${YELLOW}请保存此Token，客户端连接时需要使用！${NC}"
echo ""

# 创建目录
echo "创建安装目录..."
mkdir -p /opt/frp
cd /opt/frp

# 下载FRP
echo "下载FRP..."
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    FRP_FILE="frp_0.60.0_linux_amd64"
elif [ "$ARCH" = "aarch64" ]; then
    FRP_FILE="frp_0.60.0_linux_arm64"
else
    echo -e "${RED}不支持的架构: $ARCH${NC}"
    exit 1
fi

wget -q --show-progress https://github.com/fatedier/frp/releases/download/v0.60.0/${FRP_FILE}.tar.gz
tar -xzf ${FRP_FILE}.tar.gz
mv ${FRP_FILE}/* ./
rm -rf ${FRP_FILE}*

# 创建配置文件
echo "创建配置文件..."
cat > /opt/frp/frps.toml << EOF
# FRP服务端配置
bindPort = 7000
vhostHTTPPort = 80
vhostHTTPSPort = 443

# TCP端口映射
tcpMux = true
# 允许端口范围
allowPorts = [
  { start = 3000, end = 3100 }
]

# Dashboard配置
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "${TOKEN:0:12}"

# 认证配置
auth.method = "token"
auth.token = "$TOKEN"

# 日志配置
log.to = "/opt/frp/frps.log"
log.level = "info"
log.maxDays = 7
EOF

# 创建systemd服务
echo "创建系统服务..."
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

# 配置防火墙
echo "配置防火墙..."
if command -v ufw &> /dev/null; then
    ufw allow 7000/tcp comment 'FRP Server'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    ufw allow 7500/tcp comment 'FRP Dashboard'
    ufw allow 3000:3100/tcp comment 'App Ports'
    echo -e "${GREEN}UFW防火墙规则已添加${NC}"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=7000/tcp
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=443/tcp
    firewall-cmd --permanent --add-port=7500/tcp
    firewall-cmd --permanent --add-port=3000-3100/tcp
    firewall-cmd --reload
    echo -e "${GREEN}Firewalld防火墙规则已添加${NC}"
else
    echo -e "${YELLOW}未检测到防火墙，请手动开放端口${NC}"
fi

# 启动服务
echo "启动FRP服务..."
systemctl daemon-reload
systemctl enable frps
systemctl start frps

# 检查服务状态
sleep 2
if systemctl is-active --quiet frps; then
    echo -e "${GREEN}✅ FRP服务启动成功！${NC}"
else
    echo -e "${RED}❌ FRP服务启动失败${NC}"
    echo "查看日志: journalctl -u frps -n 50"
    exit 1
fi

# 生成客户端配置
echo ""
echo "生成客户端配置..."
cat > /tmp/frpc.toml << EOF
# FRP客户端配置 - 请复制到本地使用
serverAddr = "$SERVER_IP"
serverPort = 7000

# 认证配置
auth.method = "token"
auth.token = "$TOKEN"

# 日志配置
log.to = "./frpc.log"
log.level = "info"

# 跨海帆-速分镜 Web服务
[[proxies]]
name = "storyboard-web"
type = "http"
localIP = "127.0.0.1"
localPort = 3000
subdomain = "storyboard"

# TCP直连访问
[[proxies]]
name = "storyboard-tcp"
type = "tcp"
localIP = "127.0.0.1"
localPort = 3000
remotePort = 3001
EOF

# 显示配置信息
echo ""
echo "=================================="
echo -e "${GREEN}🎉 安装完成！${NC}"
echo "=================================="
echo ""
echo "📋 服务器信息:"
echo "-----------------------------------"
echo "服务器IP: $SERVER_IP"
echo "FRP端口: 7000"
echo "HTTP端口: 80"
echo "应用端口: 3001"
echo ""
echo "🔐 认证信息:"
echo "-----------------------------------"
echo "Token: $TOKEN"
echo "Dashboard: http://$SERVER_IP:7500"
echo "用户名: admin"
echo "密码: ${TOKEN:0:12}"
echo ""
echo "🌐 访问地址:"
echo "-----------------------------------"
echo "HTTP访问: http://storyboard.$SERVER_IP.nip.io"
echo "TCP直连: http://$SERVER_IP:3001"
echo ""
echo "📄 客户端配置已保存到: /tmp/frpc.toml"
echo "请下载并在本地使用"
echo ""
echo "📝 常用命令:"
echo "-----------------------------------"
echo "查看状态: systemctl status frps"
echo "查看日志: journalctl -u frps -f"
echo "重启服务: systemctl restart frps"
echo "=================================="
echo ""
echo -e "${YELLOW}⚠️  请保存以上信息，特别是Token！${NC}"