#!/bin/bash

# 启动隧道脚本
# 用于同时启动Next.js应用和frp客户端

echo "========================================="
echo "跨海帆-速分镜 - 隧道启动脚本"
echo "========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js未安装${NC}"
    exit 1
fi

# 检查frpc是否存在
if [ ! -f "./frpc" ]; then
    echo -e "${YELLOW}警告: frpc未找到，正在下载...${NC}"
    
    # 检测操作系统
    OS=$(uname -s)
    ARCH=$(uname -m)
    
    if [ "$OS" = "Darwin" ]; then
        # macOS
        if [ "$ARCH" = "arm64" ]; then
            FRP_URL="https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_darwin_arm64.tar.gz"
        else
            FRP_URL="https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_darwin_amd64.tar.gz"
        fi
    elif [ "$OS" = "Linux" ]; then
        # Linux
        if [ "$ARCH" = "aarch64" ]; then
            FRP_URL="https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_linux_arm64.tar.gz"
        else
            FRP_URL="https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_linux_amd64.tar.gz"
        fi
    else
        echo -e "${RED}不支持的操作系统: $OS${NC}"
        exit 1
    fi
    
    echo "下载地址: $FRP_URL"
    curl -L -o frp.tar.gz "$FRP_URL"
    tar -xzf frp.tar.gz
    mv frp_*/frpc ./
    rm -rf frp_* frp.tar.gz
    chmod +x frpc
    echo -e "${GREEN}frpc下载完成${NC}"
fi

# 检查配置文件
if [ ! -f "./frpc.toml" ]; then
    echo -e "${RED}错误: frpc.toml配置文件不存在${NC}"
    echo "请先配置frpc.toml文件"
    exit 1
fi

# 检查必要的环境变量
if [ ! -f "../.env.local" ]; then
    echo -e "${YELLOW}警告: .env.local文件不存在${NC}"
fi

# 启动Next.js应用
echo -e "${GREEN}启动Next.js应用...${NC}"
cd ..
npm run dev &
NEXTJS_PID=$!
cd deploy

# 等待Next.js启动
echo "等待Next.js启动..."
sleep 5

# 检查Next.js是否启动成功
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}Next.js启动失败${NC}"
    kill $NEXTJS_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}Next.js已启动 (PID: $NEXTJS_PID)${NC}"

# 启动frpc
echo -e "${GREEN}启动frpc隧道...${NC}"
./frpc -c ./frpc.toml &
FRPC_PID=$!

# 等待frpc连接
sleep 3

# 显示访问信息
echo ""
echo "========================================="
echo -e "${GREEN}服务已启动！${NC}"
echo "========================================="
echo "本地访问: http://localhost:3000"
echo ""
echo "远程访问方式:"
echo "1. HTTP访问: http://storyboard.你的域名.com"
echo "2. 子域名访问: http://storyboard.你的服务器IP.nip.io"
echo "3. TCP直连: http://你的服务器IP:3001"
echo ""
echo "Dashboard: http://你的服务器IP:7500"
echo "========================================="
echo ""
echo "按 Ctrl+C 停止所有服务"

# 清理函数
cleanup() {
    echo ""
    echo "正在停止服务..."
    kill $NEXTJS_PID 2>/dev/null
    kill $FRPC_PID 2>/dev/null
    echo "服务已停止"
    exit 0
}

# 注册清理函数
trap cleanup INT TERM

# 等待进程
wait $NEXTJS_PID $FRPC_PID