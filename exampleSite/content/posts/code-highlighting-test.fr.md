---
title: "Test de Coloration Syntaxique"
date: 2024-01-16T10:00:00+08:00
draft: false
description: "Test des fonctionnalités de coloration syntaxique"
tags: ["test", "code", "coloration-syntaxique"]
categories: ["coloration-code"]
slug: code-highlighting-test
---

# Test de Coloration Syntaxique

Cet article est utilisé pour tester la nouvelle fonctionnalité de coloration syntaxique, incluant la coloration syntaxique, le bouton de copie, l'affichage du langage, etc.

## JavaScript

```javascript

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}


const result = fibonacci(10);
console.log(`Le 10ème nombre de Fibonacci est : ${result}`);

// Async/Await
const asyncFunction = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
};
```

## Bloc de Code avec Numéros de Ligne

```python {lineNos=true}
# Code Python avec numéros de ligne
import asyncio
from typing import List, Optional

class DataProcessor:
    def __init__(self, data: List[dict]):
        self.data = data

    def process(self) -> Optional[dict]:
        """Traite les données et retourne le résultat"""
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

## Surlignage de Lignes Spécifiques

```go {lineNos=true hl_lines=[3,6,8]}
package main

import "fmt"  // Cette ligne sera surlignée

func main() {
    message := "Bonjour, Monde !"  // Cette ligne sera aussi surlignée

    fmt.Println(message)  // Cette ligne sera aussi surlignée

    for i := 0; i < 3; i++ {
        fmt.Printf("Compteur : %d\n", i)
    }
}
```

## Bloc de Code avec Nom de Fichier

```typescript {filename="api.ts"}
// API TypeScript
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
      throw new Error(`Erreur HTTP ! statut : ${response.status}`);
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
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    return [];
  }
}
```

## Bloc de Code Texte Brut

```
Ceci est un bloc de code en texte brut.
Il ne devrait pas avoir de coloration syntaxique.
Vous pouvez tester la fonctionnalité de copie ici.

function test() {
    console.log("Ceci est un test.");
}
```

## Code en Ligne

Ceci est un exemple de code en ligne : `const x = 42;` et `npm install` et `git commit -m "mise à jour"`.

---
