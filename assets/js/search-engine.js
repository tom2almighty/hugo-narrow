/**
 * Search indexing and scoring. DOM-free so it can be tested or reused.
 */
export const RESULT_LIMIT = 30;

export function normalizeText(value) {
  if (Array.isArray(value)) {
    return value.join(" ").toLowerCase();
  }

  return String(value || "").toLowerCase();
}

export function prepareRecords(data) {
  return (Array.isArray(data) ? data : []).map((record) => ({
    ...record,
    _title: normalizeText(record.title),
    _summary: normalizeText(record.summary),
    _content: normalizeText(record.content).slice(0, 4000),
    _tags: normalizeText(record.tags),
    _categories: normalizeText(record.categories),
  }));
}

export function parseKeywords(query) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function scoreRecord(record, keywords) {
  const title = record._title || "";
  const summary = record._summary || "";
  const content = record._content || "";
  const tags = record._tags || "";
  const categories = record._categories || "";

  let score = 0;

  for (const keyword of keywords) {
    let matched = false;

    if (title.includes(keyword)) {
      score += 40;
      matched = true;
    }

    if (tags.includes(keyword)) {
      score += 18;
      matched = true;
    }

    if (categories.includes(keyword)) {
      score += 16;
      matched = true;
    }

    if (summary.includes(keyword)) {
      score += 10;
      matched = true;
    }

    if (content.includes(keyword)) {
      score += 4;
      matched = true;
    }

    if (!matched) return -1;
  }

  return score;
}

export function searchRecords(records, query) {
  const keywords = parseKeywords(query);
  if (keywords.length === 0) return { results: [], total: 0 };

  const matches = records
    .map((record) => {
      const score = scoreRecord(record, keywords);
      return score >= 0 ? { ...record, keywords, score } : null;
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);

  return {
    results: matches.slice(0, RESULT_LIMIT),
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
