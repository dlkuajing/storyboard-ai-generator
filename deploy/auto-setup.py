#!/usr/bin/env python3

import subprocess
import time

print("====================================")
print("自动配置服务器FRP")
print("====================================")

commands = [
    "cd /opt/frp-storyboard",
    'echo "bindPort = 7001" > frps.toml',
    'echo "vhostHTTPPort = 7070" >> frps.toml',
    'echo "auth.method = \\"token\\"" >> frps.toml', 
    'echo "auth.token = \\"storyboard_1754841832\\"" >> frps.toml',
    'echo "log.to = \\"./frps.log\\"" >> frps.toml',
    "cat frps.toml",
    "pkill frps || true",
    "nohup ./frps -c frps.toml > /dev/null 2>&1 &",
    "sleep 2",
    "ps aux | grep frps | grep -v grep",
    "netstat -tlnp | grep 7001",
    "ufw allow 7001/tcp 2>/dev/null || iptables -A INPUT -p tcp --dport 7001 -j ACCEPT",
    "ufw allow 7070/tcp 2>/dev/null || iptables -A INPUT -p tcp --dport 7070 -j ACCEPT", 
    "ufw allow 4001/tcp 2>/dev/null || iptables -A INPUT -p tcp --dport 4001 -j ACCEPT",
    'echo "✅ FRP配置完成！"'
]

# 生成SSH命令
ssh_cmd = f"ssh root@172.104.59.98 '{' && '.join(commands)}'"

print("正在连接服务器...")
print("密码: ce755101ccd9452c")
print("")

# 执行
result = subprocess.run(ssh_cmd, shell=True)

if result.returncode == 0:
    print("\n✅ 服务器配置成功！")
    print("\n现在测试本地连接...")
else:
    print("\n❌ 配置失败，请手动执行")
    print("\nSSH命令:")
    print("ssh root@172.104.59.98")
    print("\n然后执行:")
    for cmd in commands:
        print(cmd)