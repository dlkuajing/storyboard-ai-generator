#!/bin/bash

# 帮助查找FRP Token的脚本
echo "======================================"
echo "查找FRP Token - 请在服务器上运行"
echo "======================================"
echo ""
echo "请SSH登录到服务器后运行以下命令："
echo ""
echo "ssh root@172.104.59.98"
echo "密码: [请使用您的SSH密码]"
echo ""
echo "然后执行："
echo "======================================"
echo ""

cat << 'SCRIPT'
# 1. 查找FRP配置文件
echo "查找FRP配置文件..."
find /etc /opt /usr/local -name "frps*" -type f 2>/dev/null

# 2. 查看运行中的FRP进程
echo ""
echo "查看FRP进程..."
ps aux | grep frps | grep -v grep

# 3. 尝试查看常见配置位置
echo ""
echo "尝试读取配置..."
for config in /etc/frp/frps.ini /etc/frp/frps.toml /opt/frp/frps.toml /usr/local/frp/frps.toml; do
    if [ -f "$config" ]; then
        echo "找到配置: $config"
        echo "Token信息:"
        grep -E "token|auth" "$config" | grep -v "^#"
        echo "---"
    fi
done

# 4. 检查systemd服务配置
echo ""
echo "检查systemd服务..."
if systemctl status frps >/dev/null 2>&1; then
    echo "FRP服务正在运行"
    # 查看服务配置文件路径
    systemctl cat frps | grep ExecStart
fi

# 5. 查看监听端口
echo ""
echo "FRP监听端口:"
netstat -tlnp | grep frp
SCRIPT

echo ""
echo "======================================"
echo "如果找到了token，更新本地frpc.toml："
echo "auth.token = \"找到的token值\""
echo "======================================"