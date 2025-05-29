import { PostgrestError } from '@supabase/supabase-js';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof PostgrestError) {
    return new ApiError(error.message, error.code ? parseInt(error.code) : undefined, error.code);
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unknown error occurred');
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.message.includes('network') || error.message.includes('connection');
  }
  return false;
}

export function isServerError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.statusCode ? error.statusCode >= 500 : false;
  }
  return false;
}

export function isNotFoundError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.statusCode === 404;
  }
  return false;
}

export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.statusCode === 401;
  }
  return false;
}

export function isForbiddenError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.statusCode === 403;
  }
  return false;
} 