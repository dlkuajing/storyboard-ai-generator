#!/bin/bash

echo "======================================"
echo "重启FRP服务"
echo "======================================"

# 加载环境变量
if [ -f ../.env.frp ]; then
    source ../.env.frp
fi

SERVER_IP="${SERVER_IP:-172.104.59.98}"
SSH_PASS="${SSH_PASSWORD:-ce755101ccd9452c}"

# 重启服务器端FRP
echo "重启服务器端FRP..."
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'EOF'
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
echo "FRP服务端已重启，PID: $!"
sleep 2
# 开放防火墙端口
ufw allow 7001/tcp 2>/dev/null
ufw allow 7070/tcp 2>/dev/null
ufw allow 4001/tcp 2>/dev/null
# 检查状态
ss -tlnp | grep 7001 && echo "✅ 端口7001正常"
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 服务器端重启成功"
    
    # 启动本地客户端
    echo ""
    echo "启动本地客户端..."
    cd "$(dirname "$0")"
    
    # 确保Next.js在运行
    if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "启动Next.js..."
        cd ..
        npm run dev &
        NEXT_PID=$!
        cd deploy
        sleep 5
    else
        echo "✅ Next.js已在运行"
    fi
    
    # 启动FRP客户端
    ./frpc -c frpc-new.toml &
    FRPC_PID=$!
    
    sleep 3
    
    # 测试连接
    echo ""
    echo "测试连接..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        echo "✅ 本地服务正常"
    fi
    
    echo ""
    echo "======================================"
    echo "✅ 服务已重启"
    echo "======================================"
    echo ""
    echo "访问地址："
    echo "TCP直连: http://$SERVER_IP:4001"
    echo "HTTP访问: http://$SERVER_IP:7070"
    echo ""
    
    # 保持运行
    wait $FRPC_PID
else
    echo "❌ 服务器端重启失败"
fi