---
title: "Code Highlighting Test"
date: 2024-01-16T10:00:00+08:00
draft: false
description: "Testing code highlighting features"
tags: ["test", "code", "syntax-highlighting"]
categories: ["code-highlighting"]
slug: code-highlighting-test
---

# Code Highlighting Test

This article is used to test the new code highlighting feature, including syntax highlighting, copy button, language display, etc.

## JavaScript

```javascript

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}


const result = fibonacci(10);
console.log(`The 10th Fibonacci number is: ${result}`);

// Async/Await
const asyncFunction = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
```

## Codeblock with Line Numbers

```python {lineNos=true}
# Python with line numbers
import asyncio
from typing import List, Optional

class DataProcessor:
    def __init__(self, data: List[dict]):
        self.data = data

    def process(self) -> Optional[dict]:
        """Process the data and return the result"""
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

## Highlighting Specific Lines

```go {lineNos=true hl_lines=[3,6,8]}
package main

import "fmt"  // This line will be highlighted

func main() {
    message := "Hello, World!"  // This line will also be highlighted

    fmt.Println(message)  // This line will also be highlighted

    for i := 0; i < 3; i++ {
        fmt.Printf("Count: %d\n", i)
    }
}
```


## Codeblock with Filename

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

const client = new ApiClient('https://api.example.com', 'your-api-key');

async function getUsers(): Promise<User[]> {
  try {
    const response = await client.get<User[]>('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
```


## Plain Text Codeblock

```
This is a plain text codeblock.
It should not have syntax highlighting.
You can test the copy functionality here.

function test() {
    console.log("This is a test.");
}
```

## Inline Code

This is an inline code example：`const x = 42;` and `npm install` and `git commit -m "update"`.

---

