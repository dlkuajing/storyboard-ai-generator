#!/bin/bash

# 检查Linode服务器FRP状态的脚本
SERVER_IP="172.104.59.98"
TOKEN="${SSH_PASSWORD:-your_ssh_password_here}"

echo "======================================"
echo "检查Linode服务器FRP状态"
echo "======================================"
echo ""
echo "服务器IP: $SERVER_IP"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "正在检查服务器连接..."

# 检查基本连接
if ping -c 1 $SERVER_IP > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 服务器可达${NC}"
else
    echo -e "${RED}❌ 无法连接到服务器${NC}"
    exit 1
fi

# 检查FRP端口
echo ""
echo "检查FRP服务端口..."

# 检查7000端口（FRP服务端口）
if nc -zv $SERVER_IP 7000 2>&1 | grep -q succeeded; then
    echo -e "${GREEN}✅ FRP服务端口(7000)已开放${NC}"
else
    echo -e "${RED}❌ FRP服务端口(7000)未开放${NC}"
    echo "   可能原因："
    echo "   1. FRP服务未启动"
    echo "   2. 防火墙阻止了端口"
fi

# 检查HTTP端口
if nc -zv $SERVER_IP 80 2>&1 | grep -q succeeded; then
    echo -e "${GREEN}✅ HTTP端口(80)已开放${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP端口(80)未开放${NC}"
fi

# 检查Dashboard端口
if nc -zv $SERVER_IP 7500 2>&1 | grep -q succeeded; then
    echo -e "${GREEN}✅ Dashboard端口(7500)已开放${NC}"
    echo "   访问: http://$SERVER_IP:7500"
else
    echo -e "${YELLOW}⚠️  Dashboard端口(7500)未开放${NC}"
fi

# 检查应用端口（3001-3010范围）
echo ""
echo "检查可用的应用端口..."
AVAILABLE_PORT=""
for port in {3001..3010}; do
    if ! nc -zv $SERVER_IP $port 2>&1 | grep -q succeeded; then
        AVAILABLE_PORT=$port
        echo -e "${GREEN}✅ 端口 $port 可用${NC}"
        break
    else
        echo -e "${YELLOW}   端口 $port 已被占用${NC}"
    fi
done

if [ -z "$AVAILABLE_PORT" ]; then
    echo -e "${RED}❌ 没有可用的端口(3001-3010)${NC}"
else
    echo ""
    echo "======================================"
    echo "📋 推荐配置："
    echo "======================================"
    echo ""
    echo "建议使用端口: $AVAILABLE_PORT"
    echo ""
    echo "需要更新 frpc.toml 中的 remotePort:"
    echo "  remotePort = $AVAILABLE_PORT"
    echo ""
    
    # 更新配置文件
    read -p "是否自动更新配置文件？(y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sed -i.bak "s/remotePort = 3001/remotePort = $AVAILABLE_PORT/" frpc.toml
        echo -e "${GREEN}✅ 配置已更新${NC}"
        echo "   TCP访问地址: http://$SERVER_IP:$AVAILABLE_PORT"
    fi
fi

echo ""
echo "======================================"
echo "📌 访问地址汇总："
echo "======================================"
echo ""
echo "1. HTTP子域名: http://storyboard.$SERVER_IP.nip.io"
echo "2. TCP直连: http://$SERVER_IP:${AVAILABLE_PORT:-3001}"
echo "3. Dashboard: http://$SERVER_IP:7500"
echo ""
echo "======================================"