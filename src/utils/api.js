// Determine the base URL for API requests
const isProduction = import.meta.env.PROD;
const baseURL = isProduction 
  ? import.meta.env.VITE_API_BASE_URL || 'https://disaster-management-backend-production.up.railway.app'
  : ''; // In development, we'll use relative URLs with the proxy

/**
 * Makes an API request with proper error handling
 * @param {string} endpoint - The API endpoint (e.g., '/api/login')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 */
export const apiRequest = async (endpoint, options = {}) => {
  // Ensure endpoint starts with a slash
  const url = `${baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Include credentials for CORS
      credentials: 'include'
    });

    // Handle non-2xx responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      throw new Error(errorData.message || 'Something went wrong');
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {}; // For non-JSON responses
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
