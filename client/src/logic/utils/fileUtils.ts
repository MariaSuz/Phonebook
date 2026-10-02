const SIZE_UNITS = ['Б', 'КБ', 'МБ', 'ГБ'];

const MIME_EXTENSIONS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
};

export const formatSize = (bytes?: number | null, empty = '0 Б') => {
  if (!bytes) return empty;
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${SIZE_UNITS[i]}`;
};

export const getExtension = (file: {
  originalFileName?: string;
  fileName: string;
  contentType?: string | null;
}) => {
  const source = file.originalFileName || file.fileName;
  const parts = source.split('.');
  if (parts.length > 1) {
    const ext = parts.pop()!.toUpperCase();
    if (ext.length <= 5) return ext;
  }
  if (file.contentType && MIME_EXTENSIONS[file.contentType]) {
    return MIME_EXTENSIONS[file.contentType];
  }
  return '—';
};
