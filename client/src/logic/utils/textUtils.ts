export const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

// Возвращает HTML-строку для v-html: текст экранирован, совпадения обёрнуты в <span class="cssClass">
export const highlight = (text: string | number, query: string | undefined, cssClass: string) => {
  const source = String(text);
  if (!query) return escapeHtml(source);
  return source
    .split(new RegExp(`(${escapeRegExp(query)})`, 'i'))
    .map((part, index) => (index % 2 ? `<span class="${cssClass}">${escapeHtml(part)}</span>` : escapeHtml(part)))
    .join('');
};

export const displayUrl = (url: string) => url.replace(/^https?:\/\//, '');
