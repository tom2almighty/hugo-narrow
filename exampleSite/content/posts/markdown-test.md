---
title: "Markdown Syntax Test Document"
date: 2024-01-15T10:00:00+08:00
draft: false
summary: "This is a test document containing various Markdown syntax to verify the completeness of prose styles."
categories: ["Test"]
tags: ["markdown", "prose", "style"]
---

# Heading 1

This is a paragraph under a level 1 heading.

## Heading 2

This is a paragraph under a level 2 heading.

### Heading 3

This is a paragraph under a level 3 heading.

#### Heading 4

This is a paragraph under a level 4 heading.

##### Heading 5

This is a paragraph under a level 5 heading.

###### Heading 6

This is a paragraph under a level 6 heading.

## Paragraphs and Text Formatting

This is a normal paragraph. It can contain **bold text**, *italic text*, ***bold italic text***, ~~strikethrough~~, `inline code`, and [link text](https://example.com).

This is another paragraph to test spacing between paragraphs.

## Blockquotes

> This is a simple blockquote.
> 
> Blockquotes can contain multiple paragraphs.

> This is an example of a nested blockquote:
> 
> > This is nested quote content.
> > 
> > Multiple levels of nesting are possible.

## Lists

### Unordered List

- First item
- Second item
  - Nested item 1
  - Nested item 2
    - Even deeper nested item
- Third item

### Ordered List

1. First item
2. Second item
   1. Nested ordered item 1
   2. Nested ordered item 2
      1. Even deeper nested item
3. Third item

### Task List (Checkbox)

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Nested task list
  - [x] Subtask 1 (done)
  - [ ] Subtask 2 (not done)
  - [x] Subtask 3 (done)

### Definition List

Term 1
: This is the definition for term 1.

Term 2
: This is the definition for term 2.
: Terms can have multiple definitions.

## Code

### Inline Code

This is a paragraph with `console.log('Hello World')` inside.

### Code Blocks

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

```css
.prose {
  max-width: none;
  color: var(--tw-prose-body);
}

.prose h1 {
  font-size: 2.25rem;
  font-weight: 700;
}
```

## Tables

| Left Align | Center Align | Right Align |
|:-----------|:------------:|------------:|
| Content 1  | Content 2    | Content 3   |
| Longer content | Medium    | Short       |
| Data A     | Data B       | Data C      |

## Horizontal Rule

---

## Images

![Sample Image](/images/01.avif "Sample Image")

## Links

This is a [regular link](https://example.com).

This is a [link with title](https://example.com "Link Title").

This is a reference-style link: [Reference Link][1]

[1]: https://example.com "Reference Link Title"

## Footnotes

This is a paragraph with a footnote[^1].

Here is another footnote[^note].

[^1]: This is the content of the first footnote.

[^note]: This is the content of a named footnote.

## Highlighted Text

This is a paragraph with ==highlighted text==.

## Superscript and Subscript

H~2~O is the chemical formula for water.

E = mc^2^ is Einstein's mass-energy equation.

## Keyboard Keys

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy text.

## Abbreviations

HTML is the abbreviation for *HyperText Markup Language*.

*[HTML]: HyperText Markup Language

## Math Formula (if KaTeX supported)

Inline formula: $E = mc^2$

Block formula:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Admonitions (if supported)

> [!NOTE]
> This is a note.

> [!TIP]
> This is a tip.

> [!IMPORTANT]
> This is important information.

> [!WARNING]
> This is a warning.

> [!CAUTION]
> This is a caution.

## Details (if supported)

<details>
<summary>Click to expand details</summary>

This is the collapsed detailed content.

You can include any Markdown syntax here:

- List item
- **Bold text**
- `Code`

</details>

## Mixed Content Test

This paragraph contains multiple formats: **bold**, *italic*, `code`, [link](https://example.com), ~~strikethrough~~, ==highlight==.

### Complex List

1. First item with **bold** text
   - Nested item with `code`
   - Another nested item with [link](https://example.com)
2. Second item with *italic* text
   1. Ordered nested item
   2. Another ordered nested item
3. Third item with ~~strikethrough~~ text

### Complex Table

| Feature | Status | Description         |
|---------|:------:|--------------------|
| **Bold** | ✅    | Supports bold text |
| *Italic* | ✅    | Supports italic    |
| `Code`   | ✅    | Supports inline code |
| [Link](https://example.com) | ✅ | Supports links |
| ~~Strikethrough~~ | ❌ | Needs testing   |

This test document covers most common Markdown syntax and can be used to verify the completeness and aesthetics of prose styles.

