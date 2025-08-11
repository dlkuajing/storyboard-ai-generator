#!/bin/bash

# 连接到新FRP实例的脚本
echo "======================================"
echo "连接到独立FRP实例"
echo "======================================"
echo ""

# 检查是否已配置token
if grep -q "请替换为服务器生成的token" frpc-new.toml; then
    echo "❌ 请先更新frpc-new.toml中的token"
    echo ""
    echo "编辑命令："
    echo "  nano frpc-new.toml"
    echo ""
    echo "将 '请替换为服务器生成的token' 改为服务器生成的实际token"
    exit 1
fi

# 检查Next.js是否运行
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "启动Next.js应用..."
    cd ..
    npm run dev &
    NEXT_PID=$!
    cd deploy
    sleep 5
else
    echo "✅ Next.js已在运行"
fi

# 启动FRP客户端
echo "启动FRP隧道..."
./frpc -c frpc-new.toml &
FRPC_PID=$!

sleep 3

echo ""
echo "======================================"
echo "✨ 服务已启动！"
echo "======================================"
echo ""
echo "🌐 访问地址："
echo "-----------------------------------"
echo "1. HTTP访问: http://storyboard.172.104.59.98.nip.io:7070"
echo "2. TCP直连: http://172.104.59.98:4001"
echo "3. Dashboard: http://172.104.59.98:7501"
echo "   用户名: admin"
echo "   密码: storyboard123"
echo "-----------------------------------"
echo ""
echo "按 Ctrl+C 停止服务"

# 清理函数
cleanup() {
    echo "停止服务..."
    kill $NEXT_PID 2>/dev/null
    kill $FRPC_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM
wait