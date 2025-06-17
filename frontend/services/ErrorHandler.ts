export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: any): never => {
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    response: error.response,
    request: error.request,
  });

  if (error instanceof APIError) {
    throw error;
  }

  if (error.message === 'Network request failed') {
    throw new APIError(
      'Unable to connect to the server. Please check your internet connection and try again.',
      0,
      'NETWORK_ERROR'
    );
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    throw new APIError(
      error.response.data?.message || 'An error occurred',
      error.response.status,
      error.response.data?.code,
      error.response.data
    );
  } else if (error.request) {
    // The request was made but no response was received
    throw new APIError(
      'No response received from server. Please try again later.',
      0,
      'NO_RESPONSE'
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new APIError(
      error.message || 'An unexpected error occurred',
      0,
      'UNKNOWN'
    );
  }
}; 