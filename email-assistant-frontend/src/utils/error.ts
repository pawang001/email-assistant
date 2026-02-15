import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/api';

export function getApiErrorMessage(error: AxiosError<ApiErrorResponse>): string | undefined {
  const responseData = error.response?.data;

  if (typeof responseData === 'string') {
    return responseData;
  }

  return responseData?.message;
}
