---
title: "コードハイライトテスト"
date: 2024-01-16T10:00:00+08:00
draft: false
description: "コードハイライト機能のテスト"
tags: ["テスト", "コード", "シンタックスハイライト"]
categories: ["コードハイライト"]
slug: code-highlighting-test
---

# コードハイライトテスト

この記事は新しいコードハイライト機能をテストするために使用されます。シンタックスハイライト、コピーボタン、言語表示などが含まれます。

## JavaScript

```javascript

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}


const result = fibonacci(10);
console.log(`10番目のフィボナッチ数は：${result}`);

// 非同期/待機
const asyncFunction = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('データ取得エラー：', error);
  }
};
```

## 行番号付きコードブロック

```python {lineNos=true}
# 行番号付きPythonコード
import asyncio
from typing import List, Optional

class DataProcessor:
    def __init__(self, data: List[dict]):
        self.data = data

    def process(self) -> Optional[dict]:
        """データを処理して結果を返す"""
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

## 特定行のハイライト

```go {lineNos=true hl_lines=[3,6,8]}
package main

import "fmt"  // この行がハイライトされます

func main() {
    message := "こんにちは、世界！"  // この行もハイライトされます

    fmt.Println(message)  // この行もハイライトされます

    for i := 0; i < 3; i++ {
        fmt.Printf("カウント：%d\n", i)
    }
}
```

## ファイル名付きコードブロック

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
      throw new Error(`HTTPエラー！ステータス：${response.status}`);
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
    console.error('ユーザー取得エラー：', error);
    return [];
  }
}
```

## プレーンテキストコードブロック

```
これはプレーンテキストコードブロックです。
シンタックスハイライトはありません。
ここでコピー機能をテストできます。

function test() {
    console.log("これはテストです。");
}
```

## インラインコード

これはインラインコードの例です：`const x = 42;` と `npm install` と `git commit -m "更新"`。

---
