#!/bin/bash

# 重置FRP Token - 谨慎使用！
echo "⚠️  警告：这会影响所有现有的FRP客户端连接！"
echo ""
read -p "确定要重置token吗？(y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # 生成新token
    NEW_TOKEN=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
    
    echo "新Token: $NEW_TOKEN"
    echo ""
    
    # 查找配置文件
    for config in /etc/frp/frps.toml /opt/frp/frps.toml /usr/local/frp/frps.toml; do
        if [ -f "$config" ]; then
            echo "更新配置: $config"
            # 备份原配置
            cp "$config" "$config.bak.$(date +%Y%m%d%H%M%S)"
            
            # 更新token
            sed -i "s/auth.token = .*/auth.token = \"$NEW_TOKEN\"/" "$config"
            sed -i "s/token = .*/token = \"$NEW_TOKEN\"/" "$config"
            
            echo "重启FRP服务..."
            systemctl restart frps
            
            echo "✅ Token已更新！"
            echo ""
            echo "新Token: $NEW_TOKEN"
            echo "请更新所有客户端配置"
            break
        fi
    done
fi