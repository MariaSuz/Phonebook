export function fixEncoding(name?: string | null): string {
  if (!name) return name ?? '';
  if (/[ÃÐÑØ]/.test(name)) {
    return Buffer.from(name, 'latin1').toString('utf8');
  }
  return name;
}
