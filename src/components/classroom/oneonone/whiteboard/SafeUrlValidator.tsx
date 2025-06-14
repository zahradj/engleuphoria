
export interface UrlValidationResult {
  isValid: boolean;
  isTrusted: boolean;
  processedUrl: string;
  warning?: string;
}

export function validateAndProcessUrl(url: string): UrlValidationResult {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      isTrusted: false,
      processedUrl: '',
      warning: 'URL is required'
    };
  }

  try {
    // Ensure URL has protocol
    const processedUrl = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(processedUrl);

    // Only allow HTTPS for security
    if (urlObj.protocol !== 'https:') {
      return {
        isValid: false,
        isTrusted: false,
        processedUrl: '',
        warning: 'Only HTTPS URLs are allowed for security'
      };
    }

    // List of trusted educational domains
    const trustedDomains = [
      'scratch.mit.edu',
      'kahoot.it',
      'kahoot.com',
      'wordwall.net',
      'nearpod.com',
      'padlet.com',
      'jamboard.google.com',
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'education.com',
      'abcya.com',
      'coolmathgames.com',
      'funbrain.com',
      'pbs.org',
      'pbskids.org',
      'khanacademy.org',
      'code.org',
      'scratch.mit.edu',
      'tinkercad.com',
      'flipgrid.com'
    ];

    const isTrusted = trustedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    );

    return {
      isValid: true,
      isTrusted,
      processedUrl,
      warning: !isTrusted ? 'This domain is not on our trusted list. Content may be blocked by security policies.' : undefined
    };

  } catch (error) {
    return {
      isValid: false,
      isTrusted: false,
      processedUrl: '',
      warning: 'Invalid URL format'
    };
  }
}
