/**
 * Search result DOM rendering.
 */
import { findHighlightRanges } from "./search-engine.js";

export function createResultsFragment(results) {
  const fragment = document.createDocumentFragment();
  results.forEach((result, index) => {
    fragment.appendChild(createResultElement(result, index));
  });
  return fragment;
}

function createResultElement(result, index) {
  const item = document.createElement("li");
  item.id = `search-option-${index}`;
  item.setAttribute("role", "option");
  item.setAttribute("aria-selected", "false");

  const link = document.createElement("a");
  link.href = result.permalink;
  link.dataset.index = String(index);
  link.className =
    "search-result-item block rounded-md px-3 py-2.5 transition-colors hover:bg-accent/60";

  const container = document.createElement("div");
  container.className = "flex flex-col gap-1";

  const title = document.createElement("h3");
  title.className = "text-foreground line-clamp-1 text-sm font-medium";
  title.appendChild(createHighlightedFragment(result.title || "", result.keywords));

  const summary = document.createElement("p");
  summary.className = "text-muted-foreground line-clamp-2 text-xs";
  summary.appendChild(
    createExcerptFragment(result.summary || result.content || "", result.keywords, 140)
  );

  const meta = document.createElement("div");
  meta.className = "text-muted-foreground flex flex-wrap items-center gap-2 text-xs";

  const metaParts = [];
  if (result.date) metaParts.push(result.date);
  if (result.section) metaParts.push(result.section);
  if (Array.isArray(result.categories) && result.categories[0]) {
    metaParts.push(result.categories[0]);
  }

  metaParts.forEach((part) => {
    const span = document.createElement("span");
    span.textContent = part;
    meta.appendChild(span);
  });

  container.appendChild(title);
  container.appendChild(summary);
  if (metaParts.length > 0) container.appendChild(meta);

  link.appendChild(container);
  item.appendChild(link);
  return item;
}

function createExcerptFragment(text, keywords, maxLength) {
  if (!text) return document.createTextNode("");

  const lowerText = text.toLowerCase();
  let firstMatch = -1;

  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1 && (firstMatch === -1 || index < firstMatch)) {
      firstMatch = index;
    }
  }

  const start = Math.max(0, firstMatch === -1 ? 0 : firstMatch - 30);
  const end = Math.min(text.length, start + maxLength);
  const excerpt = text.slice(start, end);
  const fragment = createHighlightedFragment(excerpt, keywords);

  if (start > 0) fragment.prepend(document.createTextNode("..."));
  if (end < text.length) fragment.append(document.createTextNode("..."));

  return fragment;
}

function createHighlightedFragment(text, keywords) {
  const fragment = document.createDocumentFragment();
  const ranges = findHighlightRanges(text, keywords);

  if (ranges.length === 0) {
    fragment.append(document.createTextNode(text));
    return fragment;
  }

  let cursor = 0;
  ranges.forEach(([start, end]) => {
    if (start > cursor) {
      fragment.append(document.createTextNode(text.slice(cursor, start)));
    }

    const mark = document.createElement("mark");
    mark.className = "bg-primary/15 text-foreground rounded-sm px-0.5 font-medium";
    mark.textContent = text.slice(start, end);
    fragment.append(mark);
    cursor = end;
  });

  if (cursor < text.length) {
    fragment.append(document.createTextNode(text.slice(cursor)));
  }

  return fragment;
}
