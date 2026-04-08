export interface FileFormModel {
  id?: string;
  fileName: string;
  originalFileName?: string;
  fileContent: File | null;
  contentType: string | null;
  sizeBytes: number | null;
  description: string | null;
  groupId: number | null;
}

export interface FileUploadModel {
  fileName: string | null;
  fileContent: File | null;
  description?: string | null;
  originalFileName?: string;
  groupId: number | null;
}