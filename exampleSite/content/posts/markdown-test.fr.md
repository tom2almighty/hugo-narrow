---
title: "Document de Test de Syntaxe Markdown"
date: 2024-01-15T10:00:00+08:00
draft: false
summary: "Ceci est un document de test contenant diverses syntaxes Markdown pour vérifier l'exhaustivité des styles de prose."
categories: ["Test"]
tags: ["markdown", "prose", "style"]
---

# Titre 1

Ceci est un paragraphe sous un titre de niveau 1.

## Titre 2

Ceci est un paragraphe sous un titre de niveau 2.

### Titre 3

Ceci est un paragraphe sous un titre de niveau 3.

#### Titre 4

Ceci est un paragraphe sous un titre de niveau 4.

##### Titre 5

Ceci est un paragraphe sous un titre de niveau 5.

###### Titre 6

Ceci est un paragraphe sous un titre de niveau 6.

## Paragraphes et Formatage de Texte

Ceci est un paragraphe normal. Il peut contenir du **texte en gras**, du *texte en italique*, du ***texte en gras italique***, du ~~texte barré~~, du `code en ligne`, et du [texte de lien](https://example.com).

Ceci est un autre paragraphe pour tester l'espacement entre les paragraphes.

## Citations

> Ceci est une citation simple.
> 
> Les citations peuvent contenir plusieurs paragraphes.

> Ceci est un exemple de citation imbriquée :
> 
> > Ceci est le contenu de la citation imbriquée.
> > 
> > Plusieurs niveaux d'imbrication sont possibles.

## Listes

### Liste Non Ordonnée

- Premier élément
- Deuxième élément
  - Élément imbriqué 1
  - Élément imbriqué 2
    - Élément encore plus profondément imbriqué
- Troisième élément

### Liste Ordonnée

1. Premier élément
2. Deuxième élément
   1. Élément ordonné imbriqué 1
   2. Élément ordonné imbriqué 2
      1. Élément encore plus profondément imbriqué
3. Troisième élément

### Liste de Tâches (Cases à Cocher)

- [x] Tâche terminée
- [ ] Tâche incomplète
- [x] Autre tâche terminée
- [ ] Liste de tâches imbriquée
  - [x] Sous-tâche 1 (terminée)
  - [ ] Sous-tâche 2 (non terminée)
  - [x] Sous-tâche 3 (terminée)

### Liste de Définitions

Terme 1
: Ceci est la définition du terme 1.

Terme 2
: Ceci est la définition du terme 2.
: Les termes peuvent avoir plusieurs définitions.

## Code

### Code en Ligne

Ceci est un paragraphe avec `console.log('Hello World')` à l'intérieur.

### Blocs de Code

```javascript
function greet(name) {
  console.log(`Bonjour, ${name} !`);
}

greet('Monde');
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

## Tableaux

| Aligné à Gauche | Centré | Aligné à Droite |
|:----------------|:------:|----------------:|
| Contenu 1       | Contenu 2 | Contenu 3    |
| Contenu plus long | Moyen | Court         |
| Données A       | Données B | Données C    |

## Ligne Horizontale

---

## Images

![Image d'Exemple](/images/01.avif "Image d'Exemple")

## Liens

Ceci est un [lien normal](https://example.com).

Ceci est un [lien avec titre](https://example.com "Titre du Lien").

Ceci est un lien de style référence : [Lien de Référence][1]

[1]: https://example.com "Titre du Lien de Référence"

## Notes de Bas de Page

Ceci est un paragraphe avec une note de bas de page[^1].

Voici une autre note de bas de page[^note].

[^1]: Ceci est le contenu de la première note de bas de page.

[^note]: Ceci est le contenu d'une note de bas de page nommée.

## Texte Surligné

Ceci est un paragraphe avec du ==texte surligné==.

## Exposant et Indice

H~2~O est la formule chimique de l'eau.

E = mc^2^ est l'équation masse-énergie d'Einstein.

## Touches de Clavier

Appuyez sur <kbd>Ctrl</kbd> + <kbd>C</kbd> pour copier le texte.

## Abréviations

HTML est l'abréviation de *HyperText Markup Language*.

*[HTML]: HyperText Markup Language

## Formule Mathématique (si KaTeX est supporté)

Formule en ligne : $E = mc^2$

Formule en bloc :

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Avertissements (si supportés)

> [!NOTE]
> Ceci est une note.

> [!TIP]
> Ceci est un conseil.

> [!IMPORTANT]
> Ceci est une information importante.

> [!WARNING]
> Ceci est un avertissement.

> [!CAUTION]
> Ceci est une mise en garde.

## Détails (si supportés)

<details>
<summary>Cliquez pour développer les détails</summary>

Ceci est le contenu détaillé replié.

Vous pouvez inclure n'importe quelle syntaxe Markdown ici :

- Élément de liste
- **Texte en gras**
- `Code`

</details>

## Test de Contenu Mixte

Ce paragraphe contient plusieurs formats : **gras**, *italique*, `code`, [lien](https://example.com), ~~barré~~, ==surligné==.

### Liste Complexe

1. Premier élément avec du texte **en gras**
   - Élément imbriqué avec du `code`
   - Autre élément imbriqué avec un [lien](https://example.com)
2. Deuxième élément avec du texte *en italique*
   1. Élément ordonné imbriqué
   2. Autre élément ordonné imbriqué
3. Troisième élément avec du texte ~~barré~~

### Tableau Complexe

| Fonctionnalité | Statut | Description |
|----------------|:------:|-------------|
| **Gras** | ✅ | Supporte le texte en gras |
| *Italique* | ✅ | Supporte l'italique |
| `Code` | ✅ | Supporte le code en ligne |
| [Lien](https://example.com) | ✅ | Supporte les liens |
| ~~Barré~~ | ❌ | Nécessite des tests |

Ce document de test couvre la plupart des syntaxes Markdown courantes et peut être utilisé pour vérifier l'exhaustivité et l'esthétique des styles de prose.
