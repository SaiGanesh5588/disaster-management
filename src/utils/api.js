// Base URL configuration
const isProduction = import.meta.env.PROD;
const baseURL = isProduction 
  ? (import.meta.env.VITE_API_BASE_URL || 'https://disaster-management-backend-production.up.railway.app')
  : 'http://localhost:5000'; // Local development server

// Helper to handle response
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  }
  
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'Something went wrong');
  }
  return text;
};

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

  // Handle request body
  const body = options.body ? JSON.stringify(options.body) : undefined;

  try {
    const response = await fetch(url, {
      ...options,
      method: options.method || 'GET',
      headers,
      body,
      credentials: 'include',
      mode: 'cors'
    });

    // Handle non-successful responses
    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } else {
        const text = await response.text();
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }
    }

    // Handle successful responses
    const responseContentType = response.headers.get('content-type');
    if (responseContentType && responseContentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text() || {};
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
