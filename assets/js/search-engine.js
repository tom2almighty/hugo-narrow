/**
 * Search indexing and scoring powered by MiniSearch and Intl.Segmenter.
 * DOM-free so it can be tested or reused.
 */
import MiniSearch from "./vendor/minisearch.js";

export const RESULT_LIMIT = 30;

const segmenter =
  typeof Intl !== "undefined" && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: "word" })
    : null;

/**
 * Multi-language aware tokenizer using Intl.Segmenter with Unicode CJK fallback.
 */
export function tokenize(text) {
  if (!text) return [];
  const str = Array.isArray(text) ? text.join(" ") : String(text);
  if (segmenter) {
    const tokens = [];
    for (const { segment, isWordLike } of segmenter.segment(str)) {
      if (isWordLike) {
        const trimmed = segment.trim();
        if (trimmed) tokens.push(trimmed);
      }
    }
    return tokens;
  }

  return str
    .replace(/([\p{Unified_Ideograph}\u3040-\u30ff])/gu, " $1 ")
    .split(/[\s\p{P}]+/u)
    .map((term) => term.trim())
    .filter(Boolean);
}

export function parseKeywords(query) {
  return tokenize(query);
}

export function prepareRecords(data) {
  const records = (Array.isArray(data) ? data : []).map((item, index) => ({
    id: item.permalink || String(index),
    title: item.title || "",
    summary: item.summary || "",
    content: (item.content || "").slice(0, 4000),
    permalink: item.permalink || "",
    section: item.section || "",
    date: item.date || "",
    readingTime: item.readingTime || 0,
    tags: Array.isArray(item.tags) ? item.tags.join(" ") : String(item.tags || ""),
    categories: Array.isArray(item.categories)
      ? item.categories.join(" ")
      : String(item.categories || ""),
    _rawCategories: item.categories || [],
    _rawTags: item.tags || [],
  }));

  const miniSearch = new MiniSearch({
    idField: "id",
    fields: ["title", "tags", "categories", "summary", "content"],
    storeFields: [
      "title",
      "summary",
      "content",
      "permalink",
      "section",
      "date",
      "readingTime",
      "categories",
      "_rawCategories",
      "_rawTags",
    ],
    searchOptions: {
      boost: {
        title: 5,
        tags: 3,
        categories: 2.5,
        summary: 1.5,
        content: 1,
      },
      prefix: true,
      fuzzy: (term) => (term.length > 3 ? 0.2 : false),
    },
    tokenize,
    processTerm: (term) => term.toLowerCase(),
  });

  if (records.length > 0) {
    miniSearch.addAll(records);
  }

  return miniSearch;
}

export function searchRecords(engine, query) {
  if (!engine || !query) return { results: [], total: 0 };

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return { results: [], total: 0 };

  const keywords = tokenize(trimmedQuery);
  if (keywords.length === 0) return { results: [], total: 0 };

  const searchIndex = engine instanceof MiniSearch ? engine : prepareRecords(engine);

  const rawMatches = searchIndex.search(trimmedQuery, {
    combineWith: "AND",
    prefix: true,
    fuzzy: (term) => (term.length > 3 ? 0.2 : false),
  });

  const matches =
    rawMatches.length > 0
      ? rawMatches
      : searchIndex.search(trimmedQuery, {
          combineWith: "OR",
          prefix: true,
        });

  const results = matches.slice(0, RESULT_LIMIT).map((match) => {
    const matchTerms = match.terms || [];
    const allKeywords = Array.from(new Set([...keywords, ...matchTerms])).filter(Boolean);

    return {
      title: match.title,
      summary: match.summary,
      content: match.content,
      permalink: match.permalink,
      section: match.section,
      date: match.date,
      readingTime: match.readingTime,
      categories: match._rawCategories || match.categories,
      tags: match._rawTags || [],
      keywords: allKeywords,
      score: match.score,
    };
  });

  return {
    results,
    total: matches.length,
  };
}

export function findHighlightRanges(text, keywords) {
  if (!text || !Array.isArray(keywords) || keywords.length === 0) {
    return [];
  }

  const lowerText = text.toLowerCase();
  const ranges = [];

  keywords.forEach((keyword) => {
    if (!keyword) return;

    let fromIndex = 0;
    while (fromIndex < lowerText.length) {
      const matchIndex = lowerText.indexOf(keyword.toLowerCase(), fromIndex);
      if (matchIndex === -1) break;

      ranges.push([matchIndex, matchIndex + keyword.length]);
      fromIndex = matchIndex + keyword.length;
    }
  });

  ranges.sort((left, right) => left[0] - right[0]);

  return ranges.reduce((merged, range) => {
    const lastRange = merged[merged.length - 1];
    if (!lastRange || range[0] > lastRange[1]) {
      merged.push([...range]);
      return merged;
    }

    lastRange[1] = Math.max(lastRange[1], range[1]);
    return merged;
  }, []);
}
