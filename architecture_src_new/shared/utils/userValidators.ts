import { PaginationParams } from '../types';

/**
 * Validate user ID
 */
export function validateUserId(id: string): void {
  if (!id || id.trim() === '') {
    throw new Error('User ID is required');
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): void {
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): void {
  if (!query || query.trim() === '') {
    throw new Error('Search query is required');
  }

  if (query.length < 2) {
    throw new Error('Search query must be at least 2 characters long');
  }
}

/**
 * Validate avatar URL
 */
export function validateAvatarUrl(avatarUrl: string): void {
  if (!avatarUrl || avatarUrl.trim() === '') {
    throw new Error('Avatar URL is required');
  }

  try {
    new URL(avatarUrl);
  } catch {
    throw new Error('Invalid avatar URL format');
  }
}

/**
 * Validate user data
 */
export function validateUserData(userData: any): void {
  // Validate email if provided
  if (userData.email) {
    validateEmail(userData.email);
  }

  // Validate first name if provided
  if (userData.firstName) {
    if (userData.firstName.trim().length < 2) {
      throw new Error('First name must be at least 2 characters long');
    }
  }

  // Validate last name if provided
  if (userData.lastName) {
    if (userData.lastName.trim().length < 2) {
      throw new Error('Last name must be at least 2 characters long');
    }
  }

  // Validate phone if provided
  if (userData.phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(userData.phone)) {
      throw new Error('Invalid phone number format');
    }
  }
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(params: PaginationParams): void {
  if (params?.page && (params.page < 1 || !Number.isInteger(params.page))) {
    throw new Error('Page must be a positive integer');
  }

  if (params?.limit && (params.limit < 1 || params.limit > 100 || !Number.isInteger(params.limit))) {
    throw new Error('Limit must be between 1 and 100');
  }
}

/**
 * Check if email exists (basic validation)
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || email.trim() === '') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
