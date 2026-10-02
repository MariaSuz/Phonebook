import { helpers, required } from '@vuelidate/validators';
import { useTechSitesStore } from '@/store/techSitesStore';

const uniqueUrl = (value: string, siblings: any) => {
  if (!value) return true;
  const store = useTechSitesStore();
  const currentId = siblings?.id;
  return !store.sites.some((s) => s.id !== currentId && s.url === value);
};

export const techSiteRules = {
  name: { required: helpers.withMessage('Укажите название', required) },
  url: {
    required: helpers.withMessage('Укажите адрес', required),
    format: helpers.withMessage(
      'Адрес должен начинаться с http:// или https://',
      (value: string) => !value || /^https?:\/\/\S+$/.test(value),
    ),
    unique: helpers.withMessage('Сайт с таким адресом уже существует', uniqueUrl),
  },
};
