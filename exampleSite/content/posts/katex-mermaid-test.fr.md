---
title: "Test KaTeX et Mermaid"
date: 2024-01-17T10:00:00+08:00
draft: false
description: "Test des fonctionnalités de rendu des formules mathématiques KaTeX et des graphiques Mermaid"
tags: ["test", "katex", "mermaid", "mathématiques", "graphiques"]
categories: ["mathématiques-graphiques"]
slug: katex-mermaid-test
katex: true
mermaid: true
---

# Test KaTeX et Mermaid

Cet article est utilisé pour tester le rendu des formules mathématiques KaTeX et la fonctionnalité des graphiques Mermaid.

## Test des Graphiques Mermaid

### Diagramme de Flux

```mermaid
graph TD
    A[Début] --> B{Est-ce un utilisateur ?}
    B -->|Oui| C[Afficher l'interface utilisateur]
    B -->|Non| D[Afficher la page de connexion]
    C --> E[Opération utilisateur]
    D --> F[Connexion utilisateur]
    F --> G{Connexion réussie ?}
    G -->|Oui| C
    G -->|Non| H[Afficher le message d'erreur]
    H --> D
    E --> I[Fin]
```

### Diagramme de Séquence

```mermaid
sequenceDiagram
    participant Utilisateur
    participant Navigateur
    participant Serveur
    participant BaseDeDonnées

    Utilisateur->>Navigateur: Saisir l'URL
    Navigateur->>Serveur: Envoyer la requête HTTP
    Serveur->>BaseDeDonnées: Interroger les données
    BaseDeDonnées-->>Serveur: Retourner les données
    Serveur-->>Navigateur: Retourner le HTML
    Navigateur-->>Utilisateur: Afficher la page
```

### Diagramme de Gantt

```mermaid
gantt
    title Chronologie de Développement du Projet
    dateFormat  YYYY-MM-DD
    section Phase de Conception
    Analyse des besoins     :done,    des1, 2024-01-01,2024-01-05
    Conception UI          :done,    des2, 2024-01-06, 2024-01-12
    Création de prototype  :active,  des3, 2024-01-13, 2024-01-18
    section Phase de Développement
    Développement frontend :         dev1, 2024-01-19, 2024-02-15
    Développement backend  :         dev2, 2024-01-19, 2024-02-20
    Conception base données:         dev3, 2024-01-19, 2024-01-25
    section Phase de Test
    Tests unitaires        :         test1, 2024-02-16, 2024-02-25
    Tests d'intégration    :         test2, 2024-02-21, 2024-03-01
    Tests utilisateur      :         test3, 2024-02-26, 2024-03-05
```


## Test KaTeX

### Formules en Ligne

Ceci est une formule en ligne : $E = mc^2$, la formule d'équivalence masse-énergie d'Einstein.

Autre exemple : Quand $a \neq 0$, les solutions de l'équation quadratique $ax^2 + bx + c = 0$ sont $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$.

### Formules en Bloc
#### Formule Quadratique
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

#### Formule d'Euler
$$e^{i\pi} + 1 = 0$$

#### Formule d'Intégrale
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

#### Représentation Matricielle
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}$$

#### Formule de Sommation
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

#### Équation Différentielle
$$\frac{d^2y}{dx^2} + \omega^2 y = 0$$

#### Transformée de Fourier
$$F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt$$

#### Série de Taylor
$$f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n$$

### Expressions Mathématiques Complexes

#### Fonction de Densité de Probabilité
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$$

#### Équations de Maxwell
$$\begin{align}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{align}$$

#### Équation de Schrödinger
$$i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)$$

## Test de Combinaison

### Diagramme de Flux avec Formules

```mermaid
graph LR
    A["Entrée: $f(x) = ax^2 + bx + c$"] --> B["Calculer le discriminant: $\Delta = b^2 - 4ac$"]
    B --> C{"$\Delta > 0$?"}
    C -->|Oui| D["Deux racines réelles: $x = \frac{-b \pm \sqrt{\Delta}}{2a}$"]
    C -->|Non| E{"$\Delta = 0$?"}
    E -->|Oui| F["Une racine réelle: $x = \frac{-b}{2a}$"]
    E -->|Non| G["Pas de racines réelles"]
```

### Explication de Concept Mathématique

En mathématiques, le **nombre d'or** $\phi$ est défini comme :

$$\phi = \frac{1 + \sqrt{5}}{2} \approx 1.618$$

Il satisfait la propriété suivante :

$$\phi^2 = \phi + 1$$

Cette proportion a des applications étendues dans la nature et l'art.

---

Cette page de test montre diverses fonctionnalités de KaTeX et Mermaid, incluant des formules mathématiques complexes et plusieurs types de graphiques.
