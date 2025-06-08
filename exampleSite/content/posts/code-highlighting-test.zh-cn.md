---
title: "代码高亮测试"
date: 2024-01-16T10:00:00+08:00
draft: false
description: "测试代码高亮功能"
tags: ["测试", "代码", "语法高亮"]
categories: ["代码高亮"]
slug: code-highlighting-test
---

# 代码高亮测试

本文用于测试新的代码高亮功能，包括语法高亮、复制按钮、语言显示等。

## JavaScript

```javascript

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}


const result = fibonacci(10);
console.log(`第10个斐波那契数是：${result}`);

// 异步/等待
const asyncFunction = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据时出错：', error);
  }
};
```

## 带行号的代码块

```python {lineNos=true}
# 带行号的 Python 代码
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

## 高亮特定行

```go {lineNos=true hl_lines=[3,6,8]}
package main

import "fmt"  // 这一行将被高亮

func main() {
    message := "你好，世界！"  // 这一行也将被高亮

    fmt.Println(message)  // 这一行也将被高亮

    for i := 0; i < 3; i++ {
        fmt.Printf("计数：%d\n", i)
    }
}
```


## 带文件名的代码块

```typescript {filename="api.ts"}
// TypeScript API
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
      throw new Error(`HTTP 错误！状态：${response.status}`);
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

const client = new ApiClient('https://api.example.com', 'your-api-key');

async function getUsers(): Promise<User[]> {
  try {
    const response = await client.get<User[]>('/users');
    return response.data;
  } catch (error) {
    console.error('获取用户时出错：', error);
    return [];
  }
}
```


## 纯文本代码块

```
这是一个纯文本代码块。
它不应该有语法高亮。
你可以在这里测试复制功能。

function test() {
    console.log("这是一个测试。");
}
```

## 行内代码

这是一个行内代码示例：`const x = 42;` 和 `npm install` 以及 `git commit -m "更新"`。

---
