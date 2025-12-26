---
title: "Exemples de Shortcodes"
date: 2025-12-26
draft: false
description: "Guide complet de tous les shortcodes disponibles dans le thème Hugo Narrow"
tags: ["shortcode", "documentation", "guide"]
categories: ["documentation"]
---

Cette page présente tous les shortcodes disponibles dans le thème Hugo Narrow.

## Shortcodes intégrés à Hugo

Hugo fournit plusieurs [shortcodes intégrés](https://gohugo.io/shortcodes/). Le contenu et le comportement de ces shortcodes peuvent évoluer, consultez la documentation officielle pour les instructions détaillées.

Les shortcodes intégrés incluent :

- Details
- Figure
- Gist
- Highlight
- Instagram
- Param
- QR
- Ref
- Relref
- Vimeo
- X
- YouTube

---

## Shortcodes personnalisés du thème

### Icon

Affiche des icônes SVG provenant de la bibliothèque d'icônes du thème :

```markdown
{{</* icon name="heart" */>}}
{{</* icon name="github" size="lg" */>}}
{{</* icon name="sun" class="text-primary" */>}}
```

**Exemple :**
{{< icon name="heart" >}} {{< icon name="github" size="lg" >}} {{< icon name="sun" size="xl" class="text-primary" >}}

**Paramètres :**

- `name` : nom de l'icône (obligatoire) — consultez `assets/icons/` pour les icônes disponibles ou placez une icône personnalisée dans ce répertoire
- `size` : `xs`, `sm`, `md`, `lg`, `xl`, `2xl` (par défaut : `md`)
- `class` : classe CSS personnalisée pour ajuster l'apparence

### Button

Crée des boutons stylés avec les couleurs du thème :

```markdown
{{</* button text="Learn More" url="/about" */>}}
{{</* button text="GitHub" url="https://github.com" icon="github" target="_self" */>}}
{{</* button text="Download" url="/download" variant="outline" size="lg" */>}}
```

**Exemple :**

{{< button text="Primary Button" url="#" />}}{{< button text="Secondary Button" url="#" variant="secondary" />}}{{< button text="Outline Button" url="#" variant="outline" />}}
{{< button text="Small Size" url="#" size="sm" />}}{{< button text="Medium Size" url="#" size="md" />}}{{< button text="Large Size" url="#" size="lg" />}}
{{< button text="With Icon" url="#" icon="github" />}}{{< button text="External Link" url="<https://github.com>" icon="external-link" target="_self" />}}

**Paramètres :**

- `text` : texte du bouton (obligatoire, ou utilisez le contenu interne)
- `url` : adresse du lien (obligatoire)
- `variant` : `primary`, `secondary`, `outline` (par défaut : `primary`)
- `size` : `sm`, `md`, `lg` (par défaut : `md`)
- `icon` : nom d'icône du thème
- `target` : `_blank`, `_self` (par défaut : `_blank`)
- `rel` : relation du lien (lorsque `_blank` est utilisé, `noopener noreferrer` est ajouté automatiquement)

### Link Card

```markdown
{{</* link title="Google" description="The world largest search engine." url="https://google.com" icon="https://google.com/favicon.ico" */>}}
```

**Exemple:**
{{< link title="Google" description="The world largest search engine." url="https://google.com" icon="https://google.com/favicon.ico" >}}

### Bilibili

Intègre des vidéos Bilibili :

```markdown
{{</* bilibili BV号 */>}}
{{</* bilibili AV号 分P号 */>}}
```

### Tencent Video

```markdown
{{</* tencent 视频ID */>}}
```

### Masonry Gallery

Crée une galerie en style maçonnerie (waterfall) :

```markdown
{{</* masonry */>}}
![Image 1](/images/1.jpg)
![Image 2](/images/2.jpg)
![Image 3](/images/3.jpg)
{{</* /masonry */>}}
```
