#!/bin/bash

# 自动部署FRP脚本
SERVER_IP="172.104.59.98"
SSH_PASS="${SSH_PASSWORD:-your_ssh_password_here}"
TOKEN="storyboard_1754841832"

echo "======================================"
echo "🚀 自动部署FRP - 跨海帆速分镜"
echo "======================================"
echo ""

# 检查sshpass
if ! command -v sshpass &> /dev/null; then
    echo "安装sshpass..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass
    else
        apt-get install sshpass -y || yum install sshpass -y
    fi
fi

# 创建远程部署脚本
cat > /tmp/deploy_frp.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
cd /opt/frp-storyboard

# 创建配置
cat > frps.toml << EOF
bindPort = 7001
vhostHTTPPort = 7070
auth.method = "token"
auth.token = "storyboard_1754841832"
log.to = "./frps.log"
EOF

# 停止旧进程
pkill -f "frps.*7001" 2>/dev/null || true

# 启动新进程
nohup ./frps -c frps.toml > /dev/null 2>&1 &
echo "FRP启动成功，PID: $!"

# 配置防火墙
for port in 7001 7070 4001; do
    ufw allow $port/tcp 2>/dev/null || \
    firewall-cmd --permanent --add-port=$port/tcp 2>/dev/null || \
    iptables -A INPUT -p tcp --dport $port -j ACCEPT 2>/dev/null
done

# 验证
sleep 2
if netstat -tlnp | grep -q 7001; then
    echo "✅ FRP服务运行正常"
    echo "端口7001: 已监听"
else
    echo "❌ FRP启动失败"
    exit 1
fi
DEPLOY_SCRIPT

echo "正在连接服务器并部署..."
echo ""

# 使用sshpass自动登录并执行
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no root@$SERVER_IP 'bash -s' < /tmp/deploy_frp.sh

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ 服务器部署成功！"
    echo "======================================"
    echo ""
    echo "现在启动本地客户端..."
    echo ""
    
    # 启动本地客户端
    cd "$(dirname "$0")"
    
    # 检查Next.js
    if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "启动Next.js..."
        cd ..
        npm run dev &
        NEXT_PID=$!
        cd deploy
        sleep 5
    fi
    
    # 启动FRP客户端
    echo "连接到服务器..."
    ./frpc -c frpc-new.toml &
    FRPC_PID=$!
    
    sleep 3
    
    echo ""
    echo "======================================"
    echo "🎉 部署完成！"
    echo "======================================"
    echo ""
    echo "📱 访问地址："
    echo "-----------------------------------"
    echo "公网访问: http://$SERVER_IP:7070"
    echo "TCP直连: http://$SERVER_IP:4001"
    echo "-----------------------------------"
    echo ""
    echo "按 Ctrl+C 停止服务"
    
    # 等待中断
    trap "kill $NEXT_PID $FRPC_PID 2>/dev/null; exit" INT TERM
    wait
else
    echo ""
    echo "❌ 部署失败"
    echo "请检查SSH连接信息"
fi

# 清理
rm -f /tmp/deploy_frp.sh