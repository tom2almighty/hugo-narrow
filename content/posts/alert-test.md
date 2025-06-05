---
title: "GitHub Style Alert Test"
date: 2025-06-01T10:00:00+08:00
slug: test-alert
draft: false
description: "Testing GitHub-style Alert and folding features"
tags: ["test", "alert", "markdown"]
categories: ["Github"]
---

# GitHub Style Alert Testing

This article is used to test the new GitHub-style Alert feature and folding functionality.

## Alert Syntax

### Note Alert

> [!NOTE]
> This is a note alert box. Used to display useful information that users should be aware of, even when quickly browsing the content.

### Tip Alert

> [!TIP]
> This is a tip alert box. Provides suggestions that help complete tasks better or more easily.

### Important Alert

> [!IMPORTANT]
> This is an important alert box. Displays critical information users need to know to achieve their goals.

### Warning Alert

> [!WARNING]
> This is a warning box. Urgent information that requires immediate user attention to avoid problems.

### Caution Alert

> [!CAUTION]
> This is a caution alert box. Advises users to be aware of the risks or negative consequences of certain behaviors.

## Extended Syntax - Custom Titles

### Note with Custom Title

> [!NOTE] Custom Title
> This is a note alert box with a custom title.

### Warning with Custom Title

> [!WARNING] Radiation Hazard
> Do not approach or handle without protective equipment.

## Folding Feature

### Expanded Foldable Alert by Default

> [!TIP]+ Click to Collapse
> This is an expanded foldable alert box by default. Click the title to collapse the content.
> 
> Supports multi-line content:
> - List item 1
> - List item 2
> - List item 3

### Collapsed Alert by Default

> [!IMPORTANT]- Important Information (Collapsed by Default)
> This is an important information box collapsed by default. Click the title to expand and view the content.
> 
> Can include:
> 1. Ordered list
> 2. **Bold text**
> 3. *Italic text*
> 4. `Code snippet`

### Foldable Alert with Complex Content

> [!CAUTION]+ Complex Content Example
> This foldable box contains complex Markdown content:
> 
> #### Subheading
> 
> This is a paragraph containing a [link](https://example.com) and other formatting.
> 
> ```javascript
> // Code block example
> function hello() {
>   console.log("Hello, World!");
> }
> ```
> 
> | Table | Example |
> |------|------|
> | Row1 | Data1 |
> | Row2 | Data2 |

## Regular Blockquote

This is a regular blockquote, not an Alert:

> This is a standard blockquote. It won't be rendered as an Alert but will use the standard blockquote styling.
> 
> Supports multi-line content and **formatted text**.

## Multilingual Support

Alerts support multiple languages, and titles will automatically display in the current language:

> [!NOTE]
> In a Chinese environment, this title will display as "注意" (Note).

> [!TIP]
> In a Chinese environment, this title will display as "提示" (Tip).

## Nested Content Test

> [!WARNING]+ Nested Content Test
> This Alert contains nested content:
> 
> > This is a nested blockquote
> 
> - List item
>   - Nested list item
>   - Another nested item
> 
> 1. Ordered list
>    1. Nested ordered list
>    2. Another nested item