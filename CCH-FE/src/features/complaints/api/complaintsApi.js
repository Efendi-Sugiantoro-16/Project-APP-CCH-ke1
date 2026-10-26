import { apiRequest } from '../../../shared/api/apiRequest.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

/**
 * Create a new complaint
 * @param {Object} complaintData - The complaint data
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} Created complaint result
 */
export async function createComplaint(complaintData, token) {
  return apiRequest(`${API_BASE}/complaint/create`, {
    method: 'POST',
    body: complaintData,
    token,
  })
}

/**
 * Update an existing complaint
 * @param {string} id - Complaint ID
 * @param {Object} complaintData - The updated complaint data
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} Updated complaint result
 */
export async function updateComplaint(id, complaintData, token) {
  return apiRequest(`${API_BASE}/api/v1/complaints/${id}`, {
    method: 'PUT',
    body: complaintData,
    token,
  })
}

/**
 * Fetch complaint types master data
 * @param {string} token - JWT authentication token
 * @returns {Promise<Array>} List of complaint types
 */
export async function fetchComplaintTypes(token) {
  return apiRequest(`${API_BASE}/masters/complaint-types`, {
    method: 'GET',
    token,
  })
}

/**
 * Fetch complaint sources master data
 * @param {string} token - JWT authentication token
 * @returns {Promise<Array>} List of complaint sources
 */
export async function fetchComplaintSources(token) {
  return apiRequest(`${API_BASE}/masters/complaint-sources`, {
    method: 'GET',
    token,
  })
}

/**
 * Fetch shipping services master data
 * @param {string} token - JWT authentication token
 * @returns {Promise<Array>} List of shipping services
 */
export async function fetchShippingServices(token) {
  return apiRequest(`${API_BASE}/masters/shipping-services`, {
    method: 'GET',
    token,
  })
}
