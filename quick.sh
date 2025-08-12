#!/bin/bash

# 超级简化的快速启动脚本
# 使用方法: ./quick.sh [start|stop|restart|status]

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$PROJECT_DIR"

# 加载环境变量
if [ -f .env.frp ]; then
    source .env.frp
fi

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

case "$1" in
    start)
        echo -e "${GREEN}🚀 启动所有服务...${NC}"
        ./start-all.sh
        ;;
    
    stop)
        echo -e "${RED}🛑 停止所有服务...${NC}"
        ./stop-all.sh
        ;;
    
    restart)
        echo -e "${YELLOW}🔄 重启所有服务...${NC}"
        ./stop-all.sh
        sleep 2
        ./start-all.sh
        ;;
    
    status)
        echo -e "${GREEN}📊 服务状态：${NC}"
        echo ""
        
        # 检查Next.js
        if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
            echo -e "✅ Next.js: ${GREEN}运行中${NC} (http://localhost:3000)"
        else
            echo -e "❌ Next.js: ${RED}未运行${NC}"
        fi
        
        # 检查FRP
        if pgrep -f "frpc.*7001" > /dev/null; then
            echo -e "✅ FRP隧道: ${GREEN}运行中${NC} (http://172.104.59.98:4001)"
        else
            echo -e "❌ FRP隧道: ${RED}未运行${NC}"
        fi
        
        echo ""
        echo "使用 ps aux | grep -E 'next|frp' 查看详细进程"
        ;;
    
    *)
        echo "========================================"
        echo "🎯 跨海帆-速分镜 快速管理脚本"
        echo "========================================"
        echo ""
        echo "使用方法:"
        echo "  ./quick.sh start    - 启动所有服务"
        echo "  ./quick.sh stop     - 停止所有服务"
        echo "  ./quick.sh restart  - 重启所有服务"
        echo "  ./quick.sh status   - 查看服务状态"
        echo ""
        echo "环境变量:"
        echo "  export SSH_PASSWORD=你的密码  - 设置SSH密码以启用公网访问"
        echo ""
        echo "快速启动:"
        echo "  本地开发: npm run dev"
        echo "  完整服务: ./quick.sh start"
        echo "========================================"
        exit 1
        ;;
esac