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
