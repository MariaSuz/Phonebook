export const ROLE_ADMIN = 1;
export const ROLE_EDITOR = 2;

export const ROLE_LABELS: Record<number, string> = {
  [ROLE_ADMIN]: 'Администратор',
  [ROLE_EDITOR]: 'Редактор',
};

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(
  ([value, label]) => ({
    value: Number(value),
    label,
  }),
);

export const getRoleName = (roleId?: number) => ROLE_LABELS[roleId ?? 0];