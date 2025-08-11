#!/bin/bash

# 快速启动脚本 - 跨海帆-速分镜
# 请先配置好frpc.toml中的服务器IP和token

echo "=================================="
echo "跨海帆-速分镜 - 快速部署"
echo "=================================="
echo ""

# 检查是否已配置
if grep -q "你的Linode服务器IP" frpc.toml; then
    echo "❌ 错误: 请先编辑 frpc.toml 文件"
    echo "   1. 将 '你的Linode服务器IP' 替换为实际IP地址"
    echo "   2. 将 'your_secure_token_here' 替换为安全的token"
    echo ""
    echo "编辑命令: nano frpc.toml"
    exit 1
fi

# 显示配置信息
echo "📋 当前配置:"
echo "-----------------------------------"
SERVER_IP=$(grep "serverAddr" frpc.toml | cut -d'"' -f2)
echo "服务器IP: $SERVER_IP"
echo "-----------------------------------"
echo ""

# 确认继续
read -p "确认配置正确并继续？(y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 0
fi

# 检查并安装依赖
echo ""
echo "🔍 检查环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js已安装: $(node -v)"

# 检查npm包
cd ..
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
fi

# 构建项目
echo ""
echo "🔨 构建生产版本..."
npm run build

# 下载frpc（如果不存在）
cd deploy
if [ ! -f "./frpc" ]; then
    echo ""
    echo "📥 下载frpc客户端..."
    
    OS=$(uname -s)
    ARCH=$(uname -m)
    
    if [ "$OS" = "Darwin" ]; then
        if [ "$ARCH" = "arm64" ]; then
            FRP_FILE="frp_0.60.0_darwin_arm64"
        else
            FRP_FILE="frp_0.60.0_darwin_amd64"
        fi
    else
        if [ "$ARCH" = "aarch64" ]; then
            FRP_FILE="frp_0.60.0_linux_arm64"
        else
            FRP_FILE="frp_0.60.0_linux_amd64"
        fi
    fi
    
    curl -L -o frp.tar.gz "https://github.com/fatedier/frp/releases/download/v0.60.0/${FRP_FILE}.tar.gz"
    tar -xzf frp.tar.gz
    mv ${FRP_FILE}/frpc ./
    rm -rf ${FRP_FILE} frp.tar.gz
    chmod +x frpc
    echo "✅ frpc下载完成"
fi

# 启动服务
echo ""
echo "🚀 启动服务..."
echo ""

# 启动Next.js生产服务器
cd ..
npm start &
NEXT_PID=$!

# 等待服务启动
sleep 5

# 启动frpc
cd deploy
./frpc -c frpc.toml &
FRPC_PID=$!

# 等待连接建立
sleep 3

# 显示访问信息
echo ""
echo "=================================="
echo "✨ 服务启动成功！"
echo "=================================="
echo ""
echo "🌐 访问地址:"
echo "-----------------------------------"
echo "本地访问: http://localhost:3000"
echo ""
echo "公网访问:"
echo "1. http://${SERVER_IP}:3001"
echo "2. http://storyboard.${SERVER_IP}.nip.io"
echo ""
echo "如果配置了域名:"
echo "3. http://storyboard.你的域名.com"
echo "-----------------------------------"
echo ""
echo "📊 监控面板: http://${SERVER_IP}:7500"
echo "   用户名: admin"
echo "   密码: 查看服务器端配置"
echo ""
echo "=================================="
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 清理函数
cleanup() {
    echo ""
    echo "⏹ 正在停止服务..."
    kill $NEXT_PID 2>/dev/null
    kill $FRPC_PID 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

trap cleanup INT TERM
wait $NEXT_PID $FRPC_PID