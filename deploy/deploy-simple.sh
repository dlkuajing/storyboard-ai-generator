#!/bin/bash

# 简化的自动部署脚本
SERVER_IP="172.104.59.98"
SSH_PASS="${SSH_PASSWORD:-your_ssh_password_here}"
TOKEN="storyboard_1754841832"

echo "======================================"
echo "🚀 自动部署FRP"
echo "======================================"

# 检查sshpass
if ! command -v sshpass &> /dev/null; then
    echo "需要安装sshpass..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "请运行: brew install hudochenkov/sshpass/sshpass"
        exit 1
    fi
fi

# 远程执行命令
echo "配置服务器..."
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no root@$SERVER_IP << 'COMMANDS'
cd /opt/frp-storyboard
# 创建配置
cat > frps.toml << EOF
bindPort = 7001
vhostHTTPPort = 7070
auth.method = "token"
auth.token = "storyboard_1754841832"
EOF
# 重启FRP
pkill -f frps 2>/dev/null || true
nohup ./frps -c frps.toml > frps.log 2>&1 &
echo "FRP已启动"
# 检查端口
sleep 2
ss -tlnp | grep 7001 || lsof -i:7001
echo "配置完成"
COMMANDS

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 服务器配置成功！"
    echo ""
    echo "现在测试本地连接..."
    
    # 测试连接
    cd "$(dirname "$0")"
    ./frpc -c frpc-new.toml &
    FRPC_PID=$!
    
    sleep 3
    
    # 检查是否连接成功
    if ps -p $FRPC_PID > /dev/null; then
        echo ""
        echo "======================================"
        echo "🎉 部署成功！"
        echo "======================================"
        echo "访问地址: http://$SERVER_IP:7070"
        echo "TCP端口: http://$SERVER_IP:4001"
        echo "======================================"
        
        # 保持运行
        wait $FRPC_PID
    else
        echo "❌ 客户端连接失败"
    fi
else
    echo "❌ 服务器配置失败"
fi