const API_URL = import.meta.env.VITE_API_URL || '/api';

// Función helper para peticiones
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`[API Call Failed] ${endpoint}:`, error);
    throw error;
  }
}

// --------------------------------------------------------
// SERVICIOS CRM
// --------------------------------------------------------
export const getClients = () => fetchAPI('/clients');

export const createClient = (clientData) => 
  fetchAPI('/clients', {
    method: 'POST',
    body: JSON.stringify(clientData)
  });

export const updateClientStatus = (id, status) => 
  fetchAPI(`/clients/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });

// --------------------------------------------------------
// SERVICIOS PIPELINE
// --------------------------------------------------------
export const createPipelineLead = (leadData) =>
  fetchAPI('/pipeline', {
    method: 'POST',
    body: JSON.stringify(leadData)
  });

export const updatePipelineStage = (id, stage_id) =>
  fetchAPI(`/pipeline/${id}/stage`, {
    method: 'PUT',
    body: JSON.stringify({ stage_id })
  });

// --------------------------------------------------------
// SERVICIOS INVENTARIO
// --------------------------------------------------------
export const getInventory = () => fetchAPI('/inventory');

export const createProduct = (productData) =>
  fetchAPI('/inventory', {
    method: 'POST',
    body: JSON.stringify(productData)
  });

export const updateStock = (id, stockData) =>
  fetchAPI(`/inventory/${id}/stock`, {
    method: 'PUT',
    body: JSON.stringify(stockData)
  });
