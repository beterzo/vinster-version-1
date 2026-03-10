import React from 'react';

/**
 * Utility function to clean keywords by removing quotes and unwanted characters
 */
export const cleanKeywords = (keywords: string[]): string[] => {
  if (!keywords || !Array.isArray(keywords)) {
    return [];
  }
  
  return keywords
    .map(keyword => 
      keyword
        .replace(/['"]/g, '')
        .replace(/[,;]/g, '')
        .trim()
    )
    .filter(keyword => keyword.length > 0)
    .map(keyword => 
      keyword.charAt(0).toUpperCase() + keyword.slice(1)
    );
};

/**
 * Format keywords for report display
 */
export const formatKeywordsForReport = (keywords: string[]): string => {
  if (!keywords || keywords.length === 0) return '';
  
  return keywords
    .map((keyword, index) => {
      const cleaned = keyword.trim();
      if (index === 0) {
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
      } else {
        return cleaned.toLowerCase();
      }
    })
    .join(', ');
};

/**
 * Pronoun prefixes per language for the je-vorm in reports.
 */
const pronounMap: Record<string, string> = {
  nl: 'Je ',
  en: 'You ',
  de: 'Du ',
  no: 'Du ',
};

/**
 * Format keywords for report display with je-vorm:
 * - First keyword gets the pronoun prefix (e.g. "Je bedenkt graag...")
 * - Remaining keywords stay neutral (e.g. "werkt het liefst...")
 * - All joined with comma + space as a flowing sentence
 */
export const formatKeywordsForReportWithJeVorm = (
  keywords: string[],
  language: string = 'nl'
): string => {
  if (!keywords || keywords.length === 0) return '';

  const pronoun = pronounMap[language] || pronounMap.nl;

  return keywords
    .map((keyword, index) => {
      const cleaned = keyword.trim();
      if (index === 0) {
        // First item: add pronoun + lowercase first char
        const withoutPronoun = cleaned.replace(/^(Je |You |Du )/i, '');
        return pronoun + withoutPronoun.charAt(0).toLowerCase() + withoutPronoun.slice(1);
      } else {
        // Subsequent items: ensure no pronoun, lowercase
        const withoutPronoun = cleaned.replace(/^(Je |You |Du )/i, '');
        return withoutPronoun.charAt(0).toLowerCase() + withoutPronoun.slice(1);
      }
    })
    .join(', ');
};

/**
 * Bold quoted keywords in description text.
 * Finds "keyword" patterns and returns React elements with bold spans (no quotes).
 */
export const boldQuotedKeywords = (text: string): React.ReactNode[] => {
  if (!text) return [text];
  
  const regex = /"([^"]*)"/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    result.push(
      React.createElement('strong', { key: keyIndex++, className: 'font-bold text-[#1a2e5a]' }, match[1])
    );
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  
  return result.length > 0 ? result : [text];
};
