import { isAxiosError } from 'axios';
import { useAlertStore } from '@/store/alertStore';

const DEFAULT_MESSAGE = 'Произошла неизвестная ошибка';

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || DEFAULT_MESSAGE;
  }
  if (error instanceof Error) {
    return error.message || DEFAULT_MESSAGE;
  }
  return DEFAULT_MESSAGE;
}

export function showError(error: unknown): never {
  useAlertStore().error(getErrorMessage(error));
  throw error;
}
