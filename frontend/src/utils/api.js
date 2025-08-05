// Base URL configuration
const isProduction = import.meta.env.PROD;
const baseURL = isProduction 
  ? (import.meta.env.VITE_API_BASE_URL || 'https://disaster-management-backend-production.up.railway.app')
  : 'http://localhost:5000'; // Local development server

// Add trailing slash to baseURL if not present
const getFullUrl = (endpoint) => {
  const base = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
  const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${base}${path}`;
};

/**
 * Makes an API request with proper error handling
 * @param {string} endpoint - The API endpoint (e.g., 'api/login')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = getFullUrl(endpoint);
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  // Handle request body
  let body;
  if (options.body) {
    // If body is already a string, use it as is, otherwise stringify it
    body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  } else {
    body = undefined;
  }

  try {
    console.log(`API Request: ${options.method || 'GET'} ${url}`, {
      method: options.method || 'GET',
      headers,
      body: body ? JSON.parse(body) : undefined
    });
    
    const response = await fetch(url, {
      ...options,
      method: options.method || 'GET',
      headers,
      body,
      credentials: 'include',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });

    console.log(`API Response Status: ${response.status} ${response.statusText}`);

    // Handle non-successful responses
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
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
