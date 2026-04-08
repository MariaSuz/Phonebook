import { useAlertStore } from "@/store/alertStore";

export function getErrorMessage(error: any): string {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Произошла неизвестная ошибка'
  );
}

export function showError(error: any): never {
  const errorMessage = getErrorMessage(error);
  const alertStore = useAlertStore();
  alertStore.error(errorMessage);
  throw new Error(errorMessage);
}
