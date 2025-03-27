/**
 * Gets the full public booking URL with the correct domain and path
 */
export const getPublicBookingUrl = (path: string): string => {
  // If path already has the full URL, return it
  if (path.startsWith('http')) return path;
  
  // If path already starts with a slash, use it as is, otherwise add it
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Use current domain as base for the booking URL
  const baseUrl = window.location.origin;
  
  return `${baseUrl}${formattedPath}`;
};

/**
 * Check if a string is a valid URL
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Helper function to copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for browsers without clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};
