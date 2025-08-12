#!/bin/bash

# 一键启动所有服务脚本
# 使用方法: ./start-all.sh

echo "========================================"
echo "🚀 启动跨海帆-速分镜所有服务"
echo "========================================"

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 加载环境变量
if [ -f .env.frp ]; then
    source .env.frp
fi

# 检查是否已设置SSH密码
if [ -z "$SSH_PASSWORD" ]; then
    echo "⚠️  警告: SSH_PASSWORD 环境变量未设置"
    echo "FRP隧道可能无法正常启动"
    echo ""
    echo "请设置环境变量后重试："
    echo "export SSH_PASSWORD=你的SSH密码"
    echo ""
    read -p "是否仅启动本地服务？(y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    LOCAL_ONLY=true
else
    LOCAL_ONLY=false
fi

# 1. 检查端口占用
echo ""
echo "1. 检查端口占用..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口3000已被占用，尝试关闭..."
    kill $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null || true
    sleep 2
fi

# 2. 启动Next.js开发服务器
echo ""
echo "2. 启动Next.js开发服务器..."
npm run dev > next.log 2>&1 &
NEXT_PID=$!
echo "✅ Next.js已启动 (PID: $NEXT_PID)"

# 等待Next.js启动
echo "   等待服务启动..."
for i in {1..10}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Next.js服务已就绪"
        break
    fi
    sleep 1
done

# 3. 启动FRP隧道（如果配置了SSH密码）
if [ "$LOCAL_ONLY" = false ]; then
    echo ""
    echo "3. 启动FRP隧道..."
    
    # 先停止可能运行的FRP进程
    pkill -f "frpc.*7001" 2>/dev/null || true
    
    # 启动FRP
    cd deploy
    ./frpc -c frpc-new.toml > ../frpc.log 2>&1 &
    FRPC_PID=$!
    cd ..
    echo "✅ FRP客户端已启动 (PID: $FRPC_PID)"
    
    # 重启服务器端FRP
    echo "   配置服务器端FRP..."
    sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no root@172.104.59.98 << 'EOF' > /dev/null 2>&1
cd /opt/frp-storyboard
pkill -f "frps.*7001" 2>/dev/null || true
cat > frps.toml << EOL
bindPort = 7001
vhostHTTPPort = 7070
auth.method = "token"
auth.token = "storyboard_1754841832"
log.to = "./frps.log"
EOL
nohup ./frps -c frps.toml > /dev/null 2>&1 &
EOF
    
    if [ $? -eq 0 ]; then
        echo "✅ 服务器端FRP已配置"
    else
        echo "⚠️  服务器端FRP配置失败，请检查SSH连接"
    fi
fi

# 4. 保存进程信息
echo ""
echo "4. 保存进程信息..."
cat > .services.pid << EOF
NEXT_PID=$NEXT_PID
FRPC_PID=${FRPC_PID:-0}
EOF
echo "✅ 进程信息已保存"

# 5. 显示访问信息
echo ""
echo "========================================"
echo "✅ 所有服务已启动！"
echo "========================================"
echo ""
echo "📍 访问地址："
echo "   本地访问: http://localhost:3000"
if [ "$LOCAL_ONLY" = false ]; then
    echo "   公网访问: http://172.104.59.98:4001"
    echo "   HTTP访问: http://172.104.59.98:7070"
fi
echo ""
echo "💡 提示："
echo "   - 使用 ./stop-all.sh 停止所有服务"
echo "   - 查看日志: tail -f next.log 或 tail -f frpc.log"
echo "   - 进程信息保存在 .services.pid 文件中"
echo ""
echo "按 Ctrl+C 退出（服务将在后台继续运行）"
echo "========================================"

# 显示实时日志
tail -f next.log