export interface CreateFileData {
  fileName: string;
  fileContent: Buffer;
  contentType: string;
  sizeBytes: number;
  description?: string | null;
  groupId: number;
  originalFileName: string;
}
