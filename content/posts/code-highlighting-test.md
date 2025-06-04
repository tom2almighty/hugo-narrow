---
title: "代码高亮测试"
date: 2024-01-16T10:00:00+08:00
draft: false
description: "测试新的代码块高亮功能，包括语法高亮、复制按钮、语言显示等功能"
tags: ["test", "code", "syntax-highlighting"]
categories: ["技术"]
slug: code-highlighting-test
---

# 代码高亮功能测试

这篇文章用于测试新的代码块高亮功能，包括：

1. **语法高亮** - 支持亮色和暗色模式
2. **代码块 Header** - 显示语言和工具按钮
3. **复制功能** - 一键复制代码
4. **主题适配** - 背景色根据主题变化
5. **响应式设计** - 移动端友好

## JavaScript 代码

```javascript
// JavaScript 示例代码
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 使用示例
const result = fibonacci(10);
console.log(`第10个斐波那契数是: ${result}`);

// ES6+ 特性
const asyncFunction = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};
```

## 带行号的代码块

```python {lineNos=true}
# Python 示例 - 带行号
import asyncio
from typing import List, Optional

class DataProcessor:
    def __init__(self, data: List[dict]):
        self.data = data

    def process(self) -> Optional[dict]:
        """处理数据并返回结果"""
        if not self.data:
            return None

        result = {
            'total': len(self.data),
            'processed': []
        }

        for item in self.data:
            if self.validate_item(item):
                result['processed'].append(item)

        return result
```

## 高亮特定行的代码块

```go {lineNos=true hl_lines=[2,5,8]}
package main

import "fmt"  // 这行会被高亮

func main() {
    message := "Hello, World!"  // 这行会被高亮

    fmt.Println(message)  // 这行也会被高亮

    for i := 0; i < 3; i++ {
        fmt.Printf("Count: %d\n", i)
    }
}
```

## Python 代码

```python
# Python 示例代码
import asyncio
from typing import List, Optional

class DataProcessor:
    def __init__(self, data: List[dict]):
        self.data = data
    
    def process(self) -> Optional[dict]:
        """处理数据并返回结果"""
        if not self.data:
            return None
        
        result = {
            'total': len(self.data),
            'processed': []
        }
        
        for item in self.data:
            if self.validate_item(item):
                result['processed'].append(item)
        
        return result
    
    @staticmethod
    def validate_item(item: dict) -> bool:
        return 'id' in item and 'name' in item

# 使用示例
data = [
    {'id': 1, 'name': 'Alice'},
    {'id': 2, 'name': 'Bob'},
    {'name': 'Charlie'}  # 缺少 id，验证失败
]

processor = DataProcessor(data)
result = processor.process()
print(f"处理结果: {result}")
```

## Go 代码

```go
package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "time"
)

// User 用户结构体
type User struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    CreateAt time.Time `json:"created_at"`
}

// UserService 用户服务接口
type UserService interface {
    GetUser(ctx context.Context, id int) (*User, error)
    CreateUser(ctx context.Context, user *User) error
}

// HTTPUserService HTTP用户服务实现
type HTTPUserService struct {
    client *http.Client
    baseURL string
}

// NewHTTPUserService 创建新的HTTP用户服务
func NewHTTPUserService(baseURL string) *HTTPUserService {
    return &HTTPUserService{
        client: &http.Client{
            Timeout: 30 * time.Second,
        },
        baseURL: baseURL,
    }
}

// GetUser 获取用户信息
func (s *HTTPUserService) GetUser(ctx context.Context, id int) (*User, error) {
    url := fmt.Sprintf("%s/users/%d", s.baseURL, id)
    
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, fmt.Errorf("创建请求失败: %w", err)
    }
    
    resp, err := s.client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("请求失败: %w", err)
    }
    defer resp.Body.Close()
    
    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("请求失败，状态码: %d", resp.StatusCode)
    }
    
    // 解析响应...
    return &User{}, nil
}

func main() {
    service := NewHTTPUserService("https://api.example.com")
    
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    
    user, err := service.GetUser(ctx, 1)
    if err != nil {
        log.Fatalf("获取用户失败: %v", err)
    }
    
    fmt.Printf("用户信息: %+v\n", user)
}
```

## 带文件名的代码块

```typescript {filename="api.ts"}
// TypeScript API 客户端
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string, apiKey?: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    return response.json();
  }
}

// 使用示例
const client = new ApiClient('https://api.example.com', 'your-api-key');

async function getUsers(): Promise<User[]> {
  try {
    const response = await client.get<User[]>('/users');
    return response.data;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return [];
  }
}
```

## CSS 代码

```css
/* CSS 示例 - 现代布局 */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  border-radius: inherit;
  pointer-events: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 1rem;
  }
  
  .card {
    padding: 1.5rem;
  }
}

/* CSS 自定义属性 */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #333;
  --bg-color: #f8f9fa;
}

.theme-dark {
  --text-color: #e9ecef;
  --bg-color: #212529;
}
```

## Shell 脚本

```bash
#!/bin/bash

# Shell 脚本示例 - 自动化部署
set -euo pipefail

# 配置变量
PROJECT_NAME="my-app"
BUILD_DIR="dist"
DEPLOY_SERVER="user@server.com"
DEPLOY_PATH="/var/www/${PROJECT_NAME}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    log_info "依赖检查完成"
}

# 构建项目
build_project() {
    log_info "开始构建项目..."
    
    # 安装依赖
    npm ci
    
    # 运行测试
    npm test
    
    # 构建生产版本
    npm run build
    
    if [ ! -d "$BUILD_DIR" ]; then
        log_error "构建失败，找不到构建目录: $BUILD_DIR"
        exit 1
    fi
    
    log_info "项目构建完成"
}

# 部署到服务器
deploy_to_server() {
    log_info "开始部署到服务器..."
    
    # 创建部署包
    tar -czf "${PROJECT_NAME}.tar.gz" -C "$BUILD_DIR" .
    
    # 上传到服务器
    scp "${PROJECT_NAME}.tar.gz" "${DEPLOY_SERVER}:/tmp/"
    
    # 在服务器上解压和部署
    ssh "$DEPLOY_SERVER" << EOF
        set -e
        
        # 备份当前版本
        if [ -d "$DEPLOY_PATH" ]; then
            sudo mv "$DEPLOY_PATH" "${DEPLOY_PATH}.backup.$(date +%Y%m%d_%H%M%S)"
        fi
        
        # 创建新目录
        sudo mkdir -p "$DEPLOY_PATH"
        
        # 解压新版本
        cd "$DEPLOY_PATH"
        sudo tar -xzf "/tmp/${PROJECT_NAME}.tar.gz"
        
        # 设置权限
        sudo chown -R www-data:www-data "$DEPLOY_PATH"
        
        # 重启服务
        sudo systemctl reload nginx
        
        # 清理临时文件
        rm "/tmp/${PROJECT_NAME}.tar.gz"
        
        echo "部署完成"
EOF
    
    # 清理本地临时文件
    rm "${PROJECT_NAME}.tar.gz"
    
    log_info "部署完成"
}

# 主函数
main() {
    log_info "开始自动化部署流程..."
    
    check_dependencies
    build_project
    deploy_to_server
    
    log_info "🎉 部署流程完成！"
}

# 错误处理
trap 'log_error "脚本执行失败，退出码: $?"' ERR

# 执行主函数
main "$@"
```

## 无语言标识的代码块

```
这是一个没有指定语言的代码块
应该显示为 "PLAINTEXT"
可以测试复制功能是否正常工作

function test() {
    console.log("没有语法高亮");
}
```

## 内联代码测试

这里有一些内联代码：`const x = 42;` 和 `npm install` 以及 `git commit -m "update"`。

---

