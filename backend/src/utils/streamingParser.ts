/**
 * Streaming parser utilities for AI-generated content
 */

export interface FieldExtractionResult {
  hasNewContent: boolean;
  content: string;
  isInField: boolean;
  fieldEnded: boolean;
}

/**
 * Extract field content during streaming
 */
export function extractFieldContent(
  accumulatedContent: string,
  fieldName: string,
  isInField: boolean,
  currentBuffer: string,
  hasFieldEnded: boolean
): FieldExtractionResult {
  if (hasFieldEnded) {
    return {
      hasNewContent: false,
      content: currentBuffer,
      isInField: false,
      fieldEnded: true,
    };
  }

  const fieldStartPattern = new RegExp(`"${fieldName}"\\s*:\\s*"`);
  const fieldStartMatch = accumulatedContent.match(fieldStartPattern);
  
  if (!fieldStartMatch || fieldStartMatch.index === undefined) {
    return {
      hasNewContent: false,
      content: currentBuffer,
      isInField: isInField,
      fieldEnded: hasFieldEnded,
    };
  }

  const contentStart = fieldStartMatch.index + fieldStartMatch[0].length;
  const remainingContent = accumulatedContent.substring(contentStart);
  
  // Check if field ended
  const fieldEndMatch = remainingContent.match(/(?<!\\)"(?=\s*[,}])/);
  
  let newContent = '';
  if (fieldEndMatch && fieldEndMatch.index !== undefined) {
    // Field ended
    newContent = remainingContent.substring(0, fieldEndMatch.index);
    return {
      hasNewContent: newContent !== currentBuffer,
      content: newContent,
      isInField: false,
      fieldEnded: true,
    };
  } else {
    // Field still being typed
    newContent = remainingContent
      .replace(/[",}]+$/, '')
      .replace(/\\+$/, '');
    
    return {
      hasNewContent: newContent !== currentBuffer,
      content: newContent,
      isInField: true,
      fieldEnded: false,
    };
  }
}
