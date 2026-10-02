export type AnnouncementStatus = 'scheduled' | 'active' | 'finished';

interface Period {
  startsAt: string;
  endsAt: string;
}

const HOUR = 3_600_000;
const dayMonth = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const dayMonthShort = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });
const time = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

export const SHOW_BEFORE_OPTIONS = [
  { title: 'Не показывать', value: 0 },
  { title: 'За 1 день', value: 24 },
  { title: 'За 3 дня', value: 72 },
  { title: 'За неделю', value: 168 },
];

export const getAnnouncementStatus = (a: Period, now = Date.now()): AnnouncementStatus => {
  if (now < +new Date(a.startsAt)) return 'scheduled';
  if (now >= +new Date(a.endsAt)) return 'finished';
  return 'active';
};

export type BannerPhase = 'upcoming' | 'active';

// Какую полосу показывать: заранее (за showBeforeHours до начала) или во время работ
export const getBannerPhase = (
  a: Period & { showBeforeHours: number },
  now = Date.now(),
): BannerPhase | null => {
  const start = +new Date(a.startsAt);
  if (now >= +new Date(a.endsAt)) return null;
  if (now >= start) return 'active';
  if (a.showBeforeHours > 0 && now >= start - a.showBeforeHours * HOUR) return 'upcoming';
  return null;
};

// «5 октября, 22:00–02:00» (до суток) или «5 октября, 22:00 — 7 октября, 20:00»
export const formatPeriod = (startsAt: string, endsAt: string) => {
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  if (e.getTime() - s.getTime() < 24 * HOUR) {
    return `${dayMonth.format(s)}, ${time.format(s)}–${time.format(e)}`;
  }
  return `${dayMonth.format(s)}, ${time.format(s)} — ${dayMonth.format(e)}, ${time.format(e)}`;
};

// «5 окт 22:00 — 6 окт 02:00»
export const formatPeriodShort = (startsAt: string, endsAt: string) => {
  const fmt = (d: Date) => `${dayMonthShort.format(d).replace('.', '')} ${time.format(d)}`;
  return `${fmt(new Date(startsAt))} — ${fmt(new Date(endsAt))}`;
};

export const formatEndTime = (endsAt: string) => time.format(new Date(endsAt));

// ISO <-> значение для <input type="datetime-local"> (локальное время)
export const toInputValue = (iso: string) => {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
export const fromInputValue = (value: string) => new Date(value).toISOString();
