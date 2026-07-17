// frontend/app/lib/config.ts
export const API_BASE_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.host}`
  : 'http://umar_api:8000';