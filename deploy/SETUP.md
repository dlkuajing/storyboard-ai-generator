# 🚨 FRP连接配置说明

## 当前情况
- ✅ 服务器IP: 172.104.59.98
- ✅ FRP端口7000已开放
- ❌ Token认证失败
- ❓ 你提供的密钥 `ce755101ccd9452c` 可能不是FRP的token

## 需要确认的信息

### 1. 获取正确的FRP Token

请SSH登录到你的Linode服务器，查看FRP配置：

```bash
# SSH登录
ssh root@172.104.59.98

# 查看FRP配置文件
cat /etc/frp/frps.ini
# 或者
cat /etc/frp/frps.toml
# 或者
cat /opt/frp/frps.toml
# 或者
find / -name "frps.*" 2>/dev/null
```

找到类似这样的配置：
```toml
auth.token = "实际的token值"
# 或者
[common]
token = 实际的token值
```

### 2. 两种解决方案

#### 方案A: 使用现有FRP服务（推荐）
如果你的服务器已经有FRP在运行，我们直接使用它：

1. 获取正确的token
2. 更新本地 `frpc.toml` 文件：
```toml
serverAddr = "172.104.59.98"
serverPort = 7000
auth.method = "token"
auth.token = "从服务器获取的正确token"
```

3. 运行连接：
```bash
cd deploy
./frpc -c frpc.toml
```

#### 方案B: 配置独立端口
如果现有FRP被其他服务使用，可以运行第二个FRP实例：

1. 在服务器上创建新的FRP配置（使用不同端口）：
```bash
# 创建新配置
cat > /opt/frp/frps-storyboard.toml << EOF
bindPort = 7001  # 使用不同端口
vhostHTTPPort = 7070
auth.token = "ce755101ccd9452c"  # 使用你的token
EOF

# 启动新实例
/opt/frp/frps -c /opt/frp/frps-storyboard.toml &
```

2. 本地使用新端口连接：
```toml
serverAddr = "172.104.59.98"
serverPort = 7001  # 新端口
auth.token = "ce755101ccd9452c"
```

## 快速测试命令

测试连接（调试模式）：
```bash
./frpc -c frpc.toml
```

查看详细日志：
```bash
tail -f frpc.log
```

## 访问地址

成功连接后，你可以通过以下地址访问：

1. **HTTP访问**: http://storyboard.172.104.59.98.nip.io
2. **TCP直连**: http://172.104.59.98:3001
3. **Dashboard**: http://172.104.59.98:7500

## ⚠️ 注意事项

1. 确保服务器防火墙开放了必要的端口
2. 如果有nginx或其他反向代理，可能需要额外配置
3. Token必须完全匹配，包括大小写和空格

## 需要你提供的信息

请执行以下命令并告诉我结果：

```bash
# 1. SSH到服务器
ssh root@172.104.59.98

# 2. 查找FRP配置
find /etc /opt -name "frps*" 2>/dev/null

# 3. 查看FRP进程
ps aux | grep frp

# 4. 查看使用的端口
netstat -tlnp | grep frp
```

有了这些信息，我就能帮你正确配置连接了！