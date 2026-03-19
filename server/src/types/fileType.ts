export interface File {
  id?: string;
  fileName: string;
  originalFileName?: string;
  fileContent: Buffer | null;
  contentType: string | null;
  sizeBytes: number | null;
  description?: string | null;
  groupId: number;
}