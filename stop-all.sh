#!/bin/bash

# 一键停止所有服务脚本
# 使用方法: ./stop-all.sh

echo "========================================"
echo "🛑 停止跨海帆-速分镜所有服务"
echo "========================================"

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 加载环境变量
if [ -f .env.frp ]; then
    source .env.frp
fi

# 读取保存的进程信息
if [ -f .services.pid ]; then
    source .services.pid
    echo ""
    echo "从配置文件读取进程信息..."
fi

# 1. 停止Next.js服务
echo ""
echo "1. 停止Next.js服务..."
if [ ! -z "$NEXT_PID" ] && kill -0 $NEXT_PID 2>/dev/null; then
    kill $NEXT_PID
    echo "✅ Next.js已停止 (PID: $NEXT_PID)"
else
    # 尝试通过端口查找进程
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        kill $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null || true
        echo "✅ Next.js已停止 (通过端口3000)"
    else
        echo "ℹ️  Next.js服务未运行"
    fi
fi

# 2. 停止FRP客户端
echo ""
echo "2. 停止FRP客户端..."
if [ ! -z "$FRPC_PID" ] && [ "$FRPC_PID" != "0" ] && kill -0 $FRPC_PID 2>/dev/null; then
    kill $FRPC_PID
    echo "✅ FRP客户端已停止 (PID: $FRPC_PID)"
else
    # 尝试通过进程名查找
    pkill -f "frpc.*7001" 2>/dev/null && echo "✅ FRP客户端已停止" || echo "ℹ️  FRP客户端未运行"
fi

# 3. 停止服务器端FRP（如果配置了SSH密码）
if [ ! -z "$SSH_PASSWORD" ]; then
    echo ""
    echo "3. 停止服务器端FRP..."
    sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no root@172.104.59.98 << 'EOF' > /dev/null 2>&1
pkill -f "frps.*7001" 2>/dev/null || true
EOF
    if [ $? -eq 0 ]; then
        echo "✅ 服务器端FRP已停止"
    else
        echo "⚠️  无法连接服务器，请手动检查"
    fi
else
    echo ""
    echo "3. 跳过服务器端FRP（未设置SSH_PASSWORD）"
fi

# 4. 清理其他相关进程
echo ""
echo "4. 清理其他相关进程..."
# 停止所有npm进程
pkill -f "npm run dev" 2>/dev/null || true
# 停止node进程（谨慎使用）
# pkill -f "node.*next" 2>/dev/null || true

# 5. 清理进程信息文件
echo ""
echo "5. 清理临时文件..."
rm -f .services.pid
rm -f next.log
rm -f frpc.log
echo "✅ 临时文件已清理"

# 6. 显示状态
echo ""
echo "========================================"
echo "✅ 所有服务已停止！"
echo "========================================"
echo ""

# 验证服务是否真的停止
echo "验证服务状态："
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  警告: 端口3000仍被占用"
else
    echo "✅ 端口3000已释放"
fi

if pgrep -f "frpc.*7001" > /dev/null; then
    echo "⚠️  警告: FRP客户端可能仍在运行"
else
    echo "✅ FRP客户端已完全停止"
fi

echo ""
echo "💡 提示："
echo "   - 使用 ./start-all.sh 重新启动所有服务"
echo "   - 使用 ps aux | grep -E 'next|frp' 检查残留进程"
echo "========================================"