const LOCALE = 'ru-RU';

type DateInput = Date | string | number;

export const formatDate = (value: DateInput) =>
  new Date(value).toLocaleDateString(LOCALE);
export const formatTime = (value: DateInput) =>
  new Date(value).toLocaleTimeString(LOCALE);
