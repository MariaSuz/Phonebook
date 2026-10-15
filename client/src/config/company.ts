const env = import.meta.env;

export const company = {
  name: env.VITE_COMPANY_NAME ?? 'КОМПАНИЯ',
  subtitle: env.VITE_COMPANY_SUBTITLE ?? 'супер',
  mailUrl: env.VITE_MAIL_URL ?? '#',
  edoMailUrl: env.VITE_EDO_MAIL_URL ?? '#',
  siteUrl: env.VITE_SITE_URL ?? '#',
  emailPlaceholder: env.VITE_EMAIL_PLACEHOLDER ?? 'ivanov.ii@example.ru',
};
