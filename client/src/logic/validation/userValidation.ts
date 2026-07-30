import { useUserStore } from '@/store/usersStore';
import { helpers, required, minLength } from '@vuelidate/validators';
import { computed } from 'vue';

const uniqueName = (value: string, siblings: any) => {
  if (!value) return true;
  const store = useUserStore();
  const currentId = siblings?.id;
  const userstList = computed(() => store.list);
  if (currentId) {
    return !userstList.value.some(
      (u) => u.id !== currentId && u.userName === value,
    );
  } else {
    return !userstList.value.some((u) => u.userName === value);
  }
};

export const userRules = {
  userName: {
    required: helpers.withMessage(
      'Имя пользователя обязательно для заполнения',
      required,
    ),
    minLength: helpers.withMessage(
      'Логин должен содержать минимум 2 символа',
      minLength(2),
    ),
    // запрет на пробелы
    noSpaces: helpers.withMessage(
      'Логин не может содержать пробелы',
      (value: string) => !value || !/\s/.test(value),
    ),
    unique: helpers.withMessage(
      'Такой пользователь уже существует',
      uniqueName,
    ),
  },
  password: {
    required: helpers.withMessage('Пароль обязателен для заполнения', required),
    minLength: helpers.withMessage(
      'Пароль должен содержать минимум 2 символа',
      minLength(2),
    ),
    // нет пробелов
    noSpaces: helpers.withMessage(
      'Пароль не может содержать пробелы',
      (value: string) => !value || !/\s/.test(value),
    ),
  },
};
