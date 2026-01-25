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
        .replace(/['"]/g, '') // Remove single and double quotes
        .replace(/[,;]/g, '') // Remove commas and semicolons
        .trim() // Remove leading/trailing whitespace
    )
    .filter(keyword => keyword.length > 0) // Remove empty strings
    .map(keyword => 
      // Capitalize first letter, keep rest as is
      keyword.charAt(0).toUpperCase() + keyword.slice(1)
    );
};

/**
 * Format keywords for report display
 * First keyword: capitalize first letter
 * All following keywords: lowercase
 */
export const formatKeywordsForReport = (keywords: string[]): string => {
  if (!keywords || keywords.length === 0) return '';
  
  return keywords
    .map((keyword, index) => {
      const cleaned = keyword.trim();
      if (index === 0) {
        // First keyword: capitalize first letter
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
      } else {
        // Other keywords: lowercase
        return cleaned.toLowerCase();
      }
    })
    .join(', ');
};
